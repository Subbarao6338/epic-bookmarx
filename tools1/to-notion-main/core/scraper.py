import time
import re
import random
import logging
import requests
from bs4 import BeautifulSoup
from core.parsers import clean_html_soup
from urllib.parse import urljoin, urlparse
from concurrent.futures import ThreadPoolExecutor, as_completed
import threading

logger = logging.getLogger(__name__)

class ForumCrawler:
    def __init__(self, base_url, username, password, notion_engine, max_workers=5, stop_event=None, status_callback=None):
        self.base_url = base_url
        self.username = username
        self.password = password
        self.engine = notion_engine
        self.max_workers = max_workers
        self.crawled_urls = set()
        self.lock = threading.Lock()
        self.session = requests.Session()
        self.session.headers.update({"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
        self.stop_event = stop_event
        self.status_callback = status_callback

    def run_login(self, login_url, custom_payload=None):
        """Authenticates session. Supports custom payloads for different forum engines."""
        if custom_payload:
            payload = custom_payload.copy()
            # Replace placeholders if they exist
            for k, v in payload.items():
                if v == "{username}": payload[k] = self.username
                if v == "{password}": payload[k] = self.password
        else:
            # Default vBulletin payload
            payload = {
                "vb_login_username": self.username,
                "vb_login_password": self.password,
                "securitytoken": "guest",
                "do": "login"
            }

        try:
            res = self.session.post(login_url, data=payload, timeout=20)
            res.raise_for_status()
            logger.info(f"Successfully authenticated session for {self.base_url}")
        except Exception as e:
            logger.error(f"Authentication phase error for {login_url}: {e}")

    def scrape_thread_pages(self, initial_url, thread_id, thread_title):
        current_url = initial_url
        idx = 1
        while current_url:
            if self.stop_event and self.stop_event.is_set():
                break

            with self.lock:
                if current_url in self.crawled_urls:
                    break
                self.crawled_urls.add(current_url)

            try:
                res = self.session.get(current_url, timeout=25)
                res.raise_for_status()
                if not res.text:
                    logger.warning(f"Empty response from {current_url}")
                    break
                soup = BeautifulSoup(res.text, 'html.parser')
                # Broaden post selectors
                post_selectors = ['div.postbody', 'div.post-content', 'div.message-content', 'div.message-inner', 'article.message-body']
                posts = []
                for selector in post_selectors:
                    found = soup.select(selector)
                    if found:
                        posts.extend(found)

                # Deduplicate posts if same element matched multiple selectors
                posts = list(dict.fromkeys(posts))

                raw_texts, media_links = [], []
                for post in posts:
                    txt = clean_html_soup(post)
                    if txt: raw_texts.append(txt)
                    for img in post.find_all('img'):
                        # Broaden image discovery
                        src = img.get('src') or img.get('data-src') or img.get('data-original') or img.get('data-url')
                        if src and "avatar" not in src and "clear.gif" not in src:
                            media_links.append(urljoin(self.base_url, src))

                subpage_id = self.engine.safe_create_page(f"{thread_title} - Page {idx}", thread_id)
                if subpage_id:
                    self.engine.compile_and_append_blocks(subpage_id, raw_texts, media_links)

                next_el = (
                    soup.find('a', string=re.compile(r'Next|>', re.IGNORECASE)) or
                    soup.find('link', rel='next') or
                    soup.find('a', rel='next') or
                    soup.find('a', title=re.compile(r'Next', re.IGNORECASE))
                )
                if next_el and next_el.get('href'):
                    current_url = urljoin(self.base_url, next_el.get('href'))
                    idx += 1
                    time.sleep(random.uniform(2.0, 4.0))
                else:
                    current_url = None
            except requests.exceptions.RequestException as e:
                logger.error(f"Network error fetching thread page {current_url}: {e}")
                break
            except Exception as e:
                logger.error(f"Unexpected error scraping thread page {current_url}: {e}")
                break

    def _crawl_board_recursive(self, board_label, board_url, parent_notion_id, depth=0):
        if depth > 5: return # Avoid infinite loops or too deep structures
        if self.stop_event and self.stop_event.is_set(): return

        with self.lock:
            if board_url in self.crawled_urls: return
            self.crawled_urls.add(board_url)

        if self.status_callback:
            self.status_callback(f"Crawling board (depth {depth}): {board_label}")

        forum_id = self.engine.safe_create_page(board_label, parent_notion_id)
        if not forum_id: return

        try:
            res = self.session.get(board_url, timeout=15)
            res.raise_for_status()
            if not res.text:
                logger.warning(f"Empty response from board {board_url}")
                return
            soup = BeautifulSoup(res.text, 'html.parser')

            # Find sub-boards and threads
            sub_boards = []
            threads = []

            for a in soup.find_all('a', href=True):
                href = a['href']
                label = a.get_text(strip=True)
                if not label: continue

                full_route = urljoin(self.base_url, href)

                if ("forumdisplay.php" in href or "forums/" in href) and full_route not in self.crawled_urls:
                    # Heuristic: if it's a board link on a board page, it's likely a sub-board
                    # Exclude the current board link if it appears again
                    if full_route != board_url:
                        sub_boards.append((label, full_route))
                elif ("showthread.php" in href or "threads/" in href) and "&page=" not in href:
                    if full_route not in self.crawled_urls:
                        threads.append((label, full_route))

            # Deduplicate
            sub_boards = list(dict.fromkeys(sub_boards))
            threads = list(dict.fromkeys(threads))

            # Process threads in this board
            if threads:
                logger.info(f"Discovered {len(threads)} threads in board '{board_label}'")
                with ThreadPoolExecutor(max_workers=self.max_workers) as executor:
                    futures = []
                    for t_label, t_route in threads:
                        if self.stop_event and self.stop_event.is_set(): break
                        thread_id = self.engine.safe_create_page(t_label, forum_id)
                        if thread_id:
                            futures.append(executor.submit(self.scrape_thread_pages, t_route, thread_id, t_label))

                    for future in as_completed(futures):
                        if self.stop_event and self.stop_event.is_set():
                            executor.shutdown(wait=False, cancel_futures=True)
                            break
                        try:
                            future.result()
                        except Exception as e:
                            logger.error(f"Thread scraping error: {e}")

            # Process sub-boards recursively
            for sb_label, sb_route in sub_boards:
                self._crawl_board_recursive(sb_label, sb_route, forum_id, depth + 1)

        except Exception as e:
            logger.error(f"Error crawling board {board_label}: {e}")

    def start_full_crawl(self):
        domain = urlparse(self.base_url).netloc
        root_id = self.engine.safe_create_page(f"Network Backup Hub: {domain}")
        if not root_id: return

        try:
            res = self.session.get(self.base_url, timeout=25)
            res.raise_for_status()
        except Exception as e:
            logger.error(f"Failed to fetch base URL {self.base_url}: {e}")
            return

        soup = BeautifulSoup(res.text, 'html.parser')
        boards = []
        for a in soup.find_all('a', href=True):
            if "forumdisplay.php" in a['href'] or "forums/" in a['href']:
                full_route = urljoin(self.base_url, a['href'])
                label = a.get_text(strip=True)
                if full_route not in self.crawled_urls and label:
                    boards.append((label, full_route))

        # Deduplicate
        boards = list(dict.fromkeys(boards))

        for b_label, b_route in boards:
            if self.stop_event and self.stop_event.is_set():
                break
            self._crawl_board_recursive(b_label, b_route, root_id)
