import requests
from bs4 import BeautifulSoup
from api.core.notion.notion_engine import NotionEngine
from api.core.notion.parsers import clean_html_soup
import re, time, random, logging
from urllib.parse import urljoin, urlparse
from concurrent.futures import ThreadPoolExecutor, as_completed
import threading

logger = logging.getLogger(__name__)

class ForumCrawler:
    def __init__(self, base_url, engine: NotionEngine, username=None, password=None, max_workers=5, stop_event=None, status_callback=None):
        self.base_url = base_url
        self.engine = engine
        self.username = username
        self.password = password
        self.max_workers = max_workers
        self.crawled_urls = set()
        self.lock = threading.Lock()
        self.session = requests.Session()
        self.session.headers.update({"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
        self.stop_event = stop_event
        self.status_callback = status_callback

    def run_login(self, login_url, custom_payload=None):
        if not self.username or not self.password: return
        payload = custom_payload or {
            "vb_login_username": self.username,
            "vb_login_password": self.password,
            "securitytoken": "guest",
            "do": "login"
        }
        try:
            res = self.session.post(login_url, data=payload, timeout=20)
            res.raise_for_status()
        except Exception as e:
            logger.error(f"Login error: {e}")

    def scrape_page(self, url):
        response = self.session.get(url, timeout=25)
        soup = BeautifulSoup(response.content, 'html.parser')
        title = soup.title.string if soup.title else "Untitled"
        content = clean_html_soup(soup)
        self.engine.ingest_content(title, [content], {"url": url})
        return title

    def scrape_thread_pages(self, initial_url, thread_id, thread_title):
        current_url = initial_url
        idx = 1
        while current_url:
            if self.stop_event and self.stop_event.is_set(): break
            with self.lock:
                if current_url in self.crawled_urls: break
                self.crawled_urls.add(current_url)
            try:
                res = self.session.get(current_url, timeout=25)
                res.raise_for_status()
                soup = BeautifulSoup(res.text, 'html.parser')
                post_selectors = ['div.postbody', 'div.post-content', 'div.message-content', 'article.message-body']
                posts = []
                for s in post_selectors: posts.extend(soup.select(s))
                posts = list(dict.fromkeys(posts))

                raw_texts, media_links = [], []
                for post in posts:
                    txt = clean_html_soup(post)
                    if txt: raw_texts.append(txt)
                    for img in post.find_all('img'):
                        src = img.get('src') or img.get('data-src')
                        if src and "avatar" not in src: media_links.append(urljoin(self.base_url, src))

                subpage_id = self.engine.safe_create_page(f"{thread_title} - Page {idx}", thread_id)
                if subpage_id: self.engine.compile_and_append_blocks(subpage_id, raw_texts, media_links)

                next_el = soup.find('a', rel='next') or soup.find('a', string=re.compile(r'Next|>', re.IGNORECASE))
                if next_el and next_el.get('href'):
                    current_url = urljoin(self.base_url, next_el.get('href'))
                    idx += 1
                    time.sleep(random.uniform(1, 2))
                else: current_url = None
            except Exception: break

    def start_full_crawl(self):
        domain = urlparse(self.base_url).netloc
        root_id = self.engine.safe_create_page(f"Backup: {domain}")
        if not root_id: return
        try:
            res = self.session.get(self.base_url, timeout=25)
            soup = BeautifulSoup(res.text, 'html.parser')
            boards = []
            for a in soup.find_all('a', href=True):
                if "forumdisplay.php" in a['href'] or "forums/" in a['href']:
                    boards.append((a.get_text(strip=True), urljoin(self.base_url, a['href'])))

            for b_label, b_route in list(dict.fromkeys(boards)):
                if self.stop_event and self.stop_event.is_set(): break
                self._crawl_board_recursive(b_label, b_route, root_id)
        except Exception: pass

    def _crawl_board_recursive(self, label, url, parent_id, depth=0):
        if depth > 3 or (self.stop_event and self.stop_event.is_set()): return
        with self.lock:
            if url in self.crawled_urls: return
            self.crawled_urls.add(url)

        forum_id = self.engine.safe_create_page(label, parent_id)
        if not forum_id: return

        try:
            res = self.session.get(url, timeout=15)
            soup = BeautifulSoup(res.text, 'html.parser')
            threads = []
            for a in soup.find_all('a', href=True):
                if "showthread.php" in a['href'] or "threads/" in a['href']:
                    threads.append((a.get_text(strip=True), urljoin(self.base_url, a['href'])))

            for t_label, t_route in list(dict.fromkeys(threads))[:10]: # Limit for integration
                if self.stop_event and self.stop_event.is_set(): break
                tid = self.engine.safe_create_page(t_label, forum_id)
                if tid: self.scrape_thread_pages(t_route, tid, t_label)
        except Exception: pass

def run_scraper(url, token, workspace_id):
    engine = NotionEngine(token, workspace_id)
    crawler = ForumCrawler(url, engine)
    return crawler.scrape_page(url)
