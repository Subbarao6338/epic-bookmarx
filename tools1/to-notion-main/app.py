import os
import time
import threading
import random
import json
from flask import Flask, render_template, request, jsonify
from werkzeug.utils import secure_filename
from notion_client import Client
from core.parsers import process_uploaded_document
from core.notion_engine import NotionEngine
from core.scraper import ForumCrawler
from core.scanner import FolderScanner
from dotenv import load_dotenv

load_dotenv()
NOTION_TOKEN = os.getenv("NOTION_TOKEN")
NOTION_WORKSPACE_ID = os.getenv("NOTION_WORKSPACE_ID")

app = Flask(__name__)
UPLOAD_FOLDER = 'temp_cache'
HISTORY_FILE = os.path.join(UPLOAD_FOLDER, 'task_history.json')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
scraping_status = {"status": "idle", "message": ""}
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
    # Keep only last 20 tasks
    if len(task_history) > 20:
        task_history.pop()
    save_history()

def background_scraper_task(base_url, login_url, user, pwd, token, workspace_id, translate=True):
    global scraping_status, stop_event
    scraping_status["status"] = "running"
    scraping_status["message"] = f"Scraping {base_url}..."

    def update_status(msg):
        scraping_status["message"] = msg

    try:
        engine = NotionEngine(token, workspace_id, enable_translation=translate)
        crawler = ForumCrawler(base_url, user, pwd, engine, stop_event=stop_event, status_callback=update_status)

        # Check if custom login payload is provided in request (not yet in API but good for future)
        # For now, just call with default
        crawler.run_login(login_url)
        crawler.start_full_crawl()
        if stop_event.is_set():
            scraping_status["status"] = "idle"
            scraping_status["message"] = "Crawl stopped by user."
            add_to_history("Scrape", f"Forum: {base_url}", "stopped")
        else:
            scraping_status["status"] = "success"
            scraping_status["message"] = "Crawl finished!"
            add_to_history("Scrape", f"Forum: {base_url}", "success")
    except Exception as e:
        scraping_status["status"] = "failed"
        scraping_status["message"] = str(e)
        add_to_history("Scrape", f"Forum: {base_url}", "failed")

def background_folder_scan_task(folder_path, database_id, token, workspace_id, translate=True):
    global scraping_status, stop_event
    scraping_status["status"] = "running"
    scraping_status["message"] = f"Scanning folder: {folder_path}..."

    def update_status(msg):
        scraping_status["message"] = msg

    try:
        engine = NotionEngine(token, workspace_id, enable_translation=translate)
        scanner = FolderScanner(engine, database_id, stop_event=stop_event, status_callback=update_status)
        scanner.scan_and_upload(folder_path)
        if stop_event.is_set():
            scraping_status["status"] = "idle"
            scraping_status["message"] = "Scan stopped by user."
            add_to_history("Folder Scan", f"Path: {folder_path}", "stopped")
        else:
            scraping_status["status"] = "success"
            scraping_status["message"] = "Folder ingestion finished!"
            add_to_history("Folder Scan", f"Path: {folder_path}", "success")
    except Exception as e:
        scraping_status["status"] = "failed"
        scraping_status["message"] = str(e)
        add_to_history("Folder Scan", f"Path: {folder_path}", "failed")

@app.route('/')
def index(): return render_template('index.html')

@app.route('/api/validate', methods=['POST'])
def validate():
    data = request.json
    token = data.get('token') or NOTION_TOKEN
    if not token:
        return jsonify({'valid': False, 'error': 'No Notion token configured.'})
    try:
        notion = Client(auth=token)
        # Simplified validation
        notion.users.me()

        workspace_id = data.get('workspaceId') or NOTION_WORKSPACE_ID
        if workspace_id:
            try:
                # Try to retrieve as page or database to ensure accessibility
                try:
                    notion.pages.retrieve(page_id=workspace_id)
                except Exception:
                    notion.databases.retrieve(database_id=workspace_id)
            except Exception:
                return jsonify({'valid': False, 'error': f"Workspace ID '{workspace_id}' is not accessible by this integration."})

        return jsonify({'valid': True, 'using_backend': not data.get('token') and bool(NOTION_TOKEN)})
    except Exception as e:
        return jsonify({'valid': False, 'error': str(e)})

@app.route('/api/start-scrape', methods=['POST'])
def start_scrape():
    global scraping_status, stop_event
    if scraping_status["status"] == "running":
        return jsonify({'started': False, 'message': 'Job already running.'})

    stop_event.clear()
    data = request.json
    token = data.get('token') or NOTION_TOKEN
    workspace_id = data.get('workspaceId') or NOTION_WORKSPACE_ID

    if not token or not workspace_id:
        return jsonify({'started': False, 'message': 'Missing Notion token or Workspace ID.'})

    translate = data.get('translate', True)
    t = threading.Thread(target=background_scraper_task, args=(
        data['baseUrl'], data['loginUrl'], data['username'], data['password'], token, workspace_id, translate
    ))
    t.start()
    return jsonify({'started': True})

@app.route('/api/scan-folder', methods=['POST'])
def scan_folder():
    global scraping_status, stop_event
    if scraping_status["status"] == "running":
        return jsonify({'started': False, 'message': 'Job already running.'})

    stop_event.clear()
    data = request.json
    token = data.get('token') or NOTION_TOKEN
    workspace_id = data.get('workspaceId') or NOTION_WORKSPACE_ID

    if not token or not workspace_id:
        return jsonify({'started': False, 'message': 'Missing Notion token or Workspace ID.'})

    translate = data.get('translate', True)
    t = threading.Thread(target=background_folder_scan_task, args=(
        data['folderPath'], data.get('databaseId'), token, workspace_id, translate
    ))
    t.start()
    return jsonify({'started': True})

@app.route('/api/scrape-status', methods=['GET'])
def get_status(): return jsonify(scraping_status)

@app.route('/api/task-history', methods=['GET'])
def get_task_history(): return jsonify(task_history)

@app.route('/api/clear-history', methods=['POST'])
def clear_history():
    global task_history
    task_history = []
    save_history()
    return jsonify({'success': True})

@app.route('/api/stop-task', methods=['POST'])
def stop_task():
    global stop_event
    stop_event.set()
    return jsonify({'stopped': True})

@app.route('/api/upload-document', methods=['POST'])
def upload_document():
    token = request.form.get('token') or NOTION_TOKEN
    workspace_id = request.form.get('workspaceId') or NOTION_WORKSPACE_ID
    database_id = request.form.get('databaseId')
    translate = request.form.get('translate', 'true').lower() == 'true'

    if not token or not workspace_id:
        return jsonify({'success': False, 'error': 'Missing Notion token or Workspace ID.'}), 400
    if 'file' not in request.files: return jsonify({'success': False, 'error': 'No file'}), 400
    file = request.files['file']
    file_path = None
    filename = secure_filename(file.filename)
    try:
        unique_filename = f"{int(time.time())}_{filename}"
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        file.save(file_path)
        _, ext = os.path.splitext(filename)

        chunks = process_uploaded_document(file_path, ext)

        engine = NotionEngine(token, workspace_id, enable_translation=translate)
        metadata = {"path": filename, "extension": ext.lower().replace('.', '')}
        entry_id = engine.ingest_content(filename, chunks, metadata, database_id)

        if entry_id:
            add_to_history("File Upload", f"File: {filename}", "success")
            return jsonify({'success': True, 'page_id': entry_id})
        add_to_history("File Upload", f"File: {filename}", "failed")
        return jsonify({'success': False, 'error': 'Failed to create entry'}), 500
    except Exception as e:
        add_to_history("File Upload", f"File: {filename}", "failed")
        return jsonify({'success': False, 'error': str(e)}), 500
    finally:
        if file_path and os.path.exists(file_path):
            os.remove(file_path)

if __name__ == '__main__':
    if not os.path.exists(UPLOAD_FOLDER): os.makedirs(UPLOAD_FOLDER)
    load_history()
    app.run(debug=True, host='0.0.0.0', port=5000)
