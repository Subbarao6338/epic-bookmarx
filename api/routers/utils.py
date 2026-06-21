from fastapi import APIRouter, HTTPException
import random, string
from api.core.data_adv.kusto import generate_kusto_query

router = APIRouter()

@router.get("/generate-otp")
async def generate_otp_api(length: int = 6):
    return {"otp": ''.join(random.choice(string.digits) for _ in range(length))}

@router.get("/regex-gen")
async def regex_gen(pattern_type: str):
    mapping = {"email": r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$", "url": r"https?://.*"}
    return {"regex": mapping.get(pattern_type, ".*")}

@router.post("/kusto-gen")
async def kusto_gen(data: dict):
    try:
        query = generate_kusto_query(data['table'], data['fields'], data.get('joins'), data.get('filters'))
        return {"query": query}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
