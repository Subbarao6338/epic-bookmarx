import os
from langchain_community.document_loaders import TextLoader
from langchain_unstructured import UnstructuredLoader
import logging

# Set up basic logging for error reporting
logging.basicConfig(level=logging.ERROR)
logger = logging.getLogger(__name__)

# Walks through the project directory and loads content from files using appropriate loaders.
def load_code_from_project(project_path):
    documents = []
    extension_to_loader = {".py": TextLoader}

    # Use UnstructuredLoader as the default loader if no specific loader is defined.
    default_loader = UnstructuredLoader

    for root, _, files in os.walk(project_path):
        for file in files:
            file_path = os.path.join(root, file)
            try:
                ext = os.path.splitext(file)[1].lower()
                loader_cls = extension_to_loader.get(ext, default_loader)
                loader = loader_cls(file_path)
                documents.extend(loader.load())
            except Exception as e:
                logger.error(f"Error loading {file_path}: {e}")
    return documents

