import os
import logging
from core.parsers import process_uploaded_document

logger = logging.getLogger(__name__)

class FolderScanner:
    def __init__(self, engine, database_id=None, stop_event=None, status_callback=None):
        self.engine = engine
        self.database_id = database_id
        self.stop_event = stop_event
        self.status_callback = status_callback

    def scan_and_upload(self, root_path):
        for root, dirs, files in os.walk(root_path):
            if self.stop_event and self.stop_event.is_set():
                break
            # Calculate relative path to maintain structure
            rel_path = os.path.relpath(root, root_path)
            path_parts = [] if rel_path == "." else rel_path.split(os.sep)

            # Find or create the nested page structure in Notion
            current_parent_id = self.engine.get_or_create_nested_pages(path_parts)

            total_files = len(files)
            for i, file in enumerate(files, 1):
                if self.stop_event and self.stop_event.is_set():
                    break

                name, ext = os.path.splitext(file)
                supported_exts = ['.pdf', '.docx', '.doc', '.html', '.htm', '.md', '.markdown', '.txt', '.mhtml', '.json', '.csv', '.yaml', '.yml', '.xml', '.zip', '.tar.gz', '.tgz', '.tar']
                if ext.lower() in supported_exts or file.lower().endswith(('.tar.gz', '.tgz')):
                    file_path = os.path.join(root, file)
                    if self.status_callback:
                        self.status_callback(f"Ingesting: {file} ({i}/{total_files} in folder)")
                    try:
                        content_chunks = process_uploaded_document(file_path, ext)
                        metadata = {"path": file_path, "extension": ext.lower().replace('.', '')}
                        self.engine.ingest_content(file, content_chunks, metadata, self.database_id, current_parent_id)
                    except Exception as e:
                        logger.error(f"Error processing {file_path}: {e}")
