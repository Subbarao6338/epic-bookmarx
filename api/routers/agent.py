from fastapi import APIRouter, Form, HTTPException, UploadFile, File, BackgroundTasks
from typing import Optional, List, Dict
import os, time, shutil, threading, json, random
from api.core.agent.code_loader import load_code_from_directory
from api.core.agent.vector_store import embed_and_store_in_faiss
from api.core.agent.test_case_generator import generate_test_cases
from api.core.agent.test_executor import execute_tests
from api.core.agent.test_report_generator import generate_report

router = APIRouter()
WORKSPACE = "/tmp/hub_cache/agent_workspace"
os.makedirs(WORKSPACE, exist_ok=True)

# Status tracking
agent_status = {"status": "idle", "message": ""}
agent_history = []

def add_to_history(task, details, status="success"):
    agent_history.insert(0, {
        "id": str(int(time.time())),
        "task": task,
        "details": details,
        "status": status,
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
    })

def background_agent_task(task_type, api_key, path_or_req):
    global agent_status
    agent_status["status"] = "running"
    try:
        if task_type == "ingest":
            agent_status["message"] = "Loading and indexing code..."
            chunks = load_code_from_directory(path_or_req)
            embed_and_store_in_faiss(chunks, os.path.join(WORKSPACE, "faiss_index"), api_key, "text-embedding-3-small")
            agent_status["message"] = "Ingestion complete"
            add_to_history("Ingestion", f"Path: {path_or_req}")

        elif task_type == "generate":
            agent_status["message"] = "Generating test cases..."
            # For simplicity in this port, we use the requirement directly
            # A more advanced version would retrieve context from FAISS first
            from langchain_core.documents import Document
            mock_chunks = [Document(page_content=path_or_req)]
            test_cases = generate_test_cases(mock_chunks, api_key)
            with open(os.path.join(WORKSPACE, "last_test_cases.json"), "w") as f:
                json.dump(test_cases, f)
            agent_status["message"] = "Generation complete"
            add_to_history("Generation", f"Req: {path_or_req[:30]}...")

        agent_status["status"] = "success"
    except Exception as e:
        agent_status["status"] = "failed"
        agent_status["message"] = str(e)
        add_to_history(task_type.capitalize(), str(e), "failed")

@router.post("/ingest")
async def ingest_code(background_tasks: BackgroundTasks, api_key: str = Form(...), path: str = Form(...)):
    background_tasks.add_task(background_agent_task, "ingest", api_key, path)
    return {"started": True}

@router.post("/generate")
async def generate_tests_endpoint(background_tasks: BackgroundTasks, api_key: str = Form(...), requirement: str = Form(...)):
    background_tasks.add_task(background_agent_task, "generate", api_key, requirement)
    return {"started": True}

@router.get("/status")
async def get_agent_status():
    return agent_status

@router.get("/results")
async def get_results():
    path = os.path.join(WORKSPACE, "last_test_cases.json")
    if os.path.exists(path):
        with open(path, "r") as f:
            return json.load(f)
    return []

@router.get("/history")
async def get_agent_history():
    return agent_history
