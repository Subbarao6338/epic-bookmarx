from langchain_community.document_loaders import PyPDFLoader, Docx2txtLoader
import os

def load_requirements(path):
    if not os.path.exists(path):
        raise FileNotFoundError(f"Path not found: {path}")

    documents = []

    # If path is a directory, iterate through files and load supported types
    if os.path.isdir(path):
        found_file = False
        for entry in os.listdir(path):
            full_path = os.path.join(path, entry)
            if os.path.isfile(full_path) and full_path.lower().endswith((".pdf", ".docx")):
                found_file = True
                try:
                    docs = load_file(full_path)
                    documents.extend(docs)
                except Exception as e:
                    print(f"Error loading file {full_path}: {e}")
        if not found_file:
            raise FileNotFoundError("No supported (.pdf or .docx) files were found in the folder.")
    else:
        # Else, process a single file
        documents = load_file(path)

    return documents

def load_file(file_path):
    file_path_lower = file_path.lower()
    if file_path_lower.endswith(".pdf"):
        loader = PyPDFLoader(file_path)
    elif file_path_lower.endswith(".docx"):
        loader = Docx2txtLoader(file_path)
    else:
        raise ValueError(f"Unsupported file type for file: {file_path}. Please use PDF or DOCX.")
    return loader.load()
