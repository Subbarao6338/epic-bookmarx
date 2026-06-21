from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from typing import List, Optional
import os, time, shutil, random
from api.core.notion.parsers import process_uploaded_document

router = APIRouter()
UPLOAD_FOLDER = "/tmp/agent_cache"

@router.post("/ingest")
async def ingest_codebase(files: List[UploadFile] = File(...)):
    if not os.path.exists(UPLOAD_FOLDER): os.makedirs(UPLOAD_FOLDER)

    all_chunks = []
    try:
        for file in files:
            file_path = os.path.join(UPLOAD_FOLDER, f"{int(time.time())}_{file.filename}")
            with open(file_path, "wb") as b:
                shutil.copyfileobj(file.file, b)

            try:
                _, ext = os.path.splitext(file.filename)
                chunks = process_uploaded_document(file_path, ext)
                for i, chunk in enumerate(chunks):
                    all_chunks.append({
                        "pageContent": chunk,
                        "metadata": {"filename": file.name, "chunkIndex": i}
                    })
            finally:
                if os.path.exists(file_path): os.remove(file_path)

        return {"success": True, "chunks": all_chunks}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/status")
async def get_agent_status():
    return {"status": "idle", "message": "Agent is ready"}
