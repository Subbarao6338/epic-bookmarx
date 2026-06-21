from fastapi import APIRouter, UploadFile, File, Form, HTTPException, BackgroundTasks
from typing import Optional, List, Dict
import os, time, shutil, threading, json, random
from api.core.notion.notion_engine import NotionEngine
from api.core.notion.parsers import process_uploaded_document
from api.core.notion.scraper import ForumCrawler
from api.core.notion.scanner import FolderScanner
from notion_client import Client

router = APIRouter()
UPLOAD_FOLDER = "/tmp/hub_cache"
HISTORY_FILE = os.path.join(UPLOAD_FOLDER, "notion_task_history.json")

# Shared state for background jobs
job_status = {"status": "idle", "message": "", "progress": 0}
stop_event = threading.Event()
task_history = []

def load_history():
    global task_history
    if os.path.exists(HISTORY_FILE):
        try:
            with open(HISTORY_FILE, 'r') as f:
                task_history = json.load(f)
        except Exception:
            task_history = []

def save_history():
    try:
        if not os.path.exists(UPLOAD_FOLDER): os.makedirs(UPLOAD_FOLDER)
        with open(HISTORY_FILE, 'w') as f:
            json.dump(task_history, f)
    except Exception:
        pass

def add_to_history(task_type, details, status="success"):
    task_history.insert(0, {
        "id": f"{int(time.time())}_{random.randint(1000, 9999)}",
        "type": task_type,
        "details": details,
        "status": status,
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
    })
    if len(task_history) > 20:
        task_history.pop()
    save_history()

load_history()

def background_scraper(url, token, workspace_id, username=None, password=None, login_url=None, full_crawl=False):
    global job_status
    job_status["status"] = "running"
    job_status["message"] = f"Scraping {url}..."
    try:
        engine = NotionEngine(token, workspace_id)
        crawler = ForumCrawler(url, engine, username=username, password=password, stop_event=stop_event, status_callback=lambda m: job_status.update({"message": m}))

        if login_url:
            crawler.run_login(login_url)

        if full_crawl:
            crawler.start_full_crawl()
        else:
            crawler.scrape_page(url)

        if stop_event.is_set():
             job_status["status"] = "idle"
             job_status["message"] = "Stopped by user"
             add_to_history("Scrape", f"URL: {url}", "stopped")
        else:
            job_status["status"] = "success"
            job_status["message"] = "Scraping finished"
            add_to_history("Scrape", f"URL: {url}", "success")
    except Exception as e:
        job_status["status"] = "failed"
        job_status["message"] = str(e)
        add_to_history("Scrape", f"URL: {url}", "failed")

def background_folder_scan(folder_path, database_id, token, workspace_id):
    global job_status
    job_status["status"] = "running"
    job_status["message"] = f"Scanning {folder_path}..."

    def update_msg(msg):
        job_status["message"] = msg

    try:
        engine = NotionEngine(token, workspace_id)
        scanner = FolderScanner(engine, database_id, stop_event=stop_event, status_callback=update_msg)
        scanner.scan_and_upload(folder_path)
        if stop_event.is_set():
            job_status["status"] = "idle"
            job_status["message"] = "Scan stopped"
            add_to_history("Folder Scan", f"Path: {folder_path}", "stopped")
        else:
            job_status["status"] = "success"
            job_status["message"] = "Folder scan complete"
            add_to_history("Folder Scan", f"Path: {folder_path}", "success")
    except Exception as e:
        job_status["status"] = "failed"
        job_status["message"] = str(e)
        add_to_history("Folder Scan", f"Path: {folder_path}", "failed")

@router.post("/validate")
async def validate_notion(token: str, workspace_id: Optional[str] = None):
    try:
        notion = Client(auth=token); notion.users.me()
        return {"valid": True}
    except Exception as e: return {"valid": False, "error": str(e)}

@router.post("/upload")
async def upload_document(token: str = Form(...), workspace_id: str = Form(...), database_id: Optional[str] = Form(None), file: UploadFile = File(...)):
    if not os.path.exists(UPLOAD_FOLDER): os.makedirs(UPLOAD_FOLDER)
    file_path = os.path.join(UPLOAD_FOLDER, f"{int(time.time())}_{file.filename}")
    with open(file_path, "wb") as b: shutil.copyfileobj(file.file, b)
    try:
        _, ext = os.path.splitext(file.filename)
        chunks = process_uploaded_document(file_path, ext)
        engine = NotionEngine(token, workspace_id)
        entry_id = engine.ingest_content(file.filename, chunks, {"path": file.filename, "extension": ext.replace('.','')}, database_id)
        add_to_history("Upload", f"File: {file.filename}", "success")
        return {"success": True, "page_id": entry_id}
    except Exception as e:
        add_to_history("Upload", f"File: {file.filename}", "failed")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(file_path): os.remove(file_path)

@router.post("/start-scrape")
async def start_scrape(background_tasks: BackgroundTasks,
                      url: str = Form(...),
                      token: str = Form(...),
                      workspace_id: str = Form(...),
                      username: Optional[str] = Form(None),
                      password: Optional[str] = Form(None),
                      login_url: Optional[str] = Form(None),
                      full_crawl: bool = Form(False)):
    global job_status
    if job_status["status"] == "running":
        return {"started": False, "message": "Job already running"}

    stop_event.clear()
    background_tasks.add_task(background_scraper, url, token, workspace_id, username, password, login_url, full_crawl)
    return {"started": True}

@router.post("/scan-folder")
async def scan_folder(background_tasks: BackgroundTasks, folder_path: str = Form(...), token: str = Form(...), workspace_id: str = Form(...), database_id: Optional[str] = Form(None)):
    global job_status
    if job_status["status"] == "running":
        return {"started": False, "message": "Job already running"}

    stop_event.clear()
    background_tasks.add_task(background_folder_scan, folder_path, database_id, token, workspace_id)
    return {"started": True}

@router.get("/status")
async def get_status():
    return job_status

@router.get("/history")
async def get_history():
    return task_history

@router.post("/stop")
async def stop_task():
    stop_event.set()
    return {"stopped": True}

@router.post("/clear-history")
async def clear_history():
    global task_history
    task_history = []
    save_history()
    return {"success": True}
