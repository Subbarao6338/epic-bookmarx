import os
from langchain_community.document_loaders import TextLoader
import logging

logging.basicConfig(level=logging.ERROR)
logger = logging.getLogger(__name__)

def load_code_from_directory(project_path):
    documents = []
    # Full implementation supporting multiple source file types
    supported_extensions = ('.py', '.js', '.jsx', '.ts', '.tsx', '.html', '.css', '.md', '.json', '.yaml', '.sql')

    for root, _, files in os.walk(project_path):
        for file in files:
            if file.endswith(supported_extensions):
                file_path = os.path.join(root, file)
                try:
                    loader = TextLoader(file_path, encoding='utf-8')
                    documents.extend(loader.load())
                except Exception as e:
                    logger.error(f"Error loading {file_path}: {e}")
    return documents
