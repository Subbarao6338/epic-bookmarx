from fastapi import APIRouter, UploadFile, File, HTTPException, Form
import pandas as pd
import io, os, numpy as np

router = APIRouter()

@router.post("/anomaly-detect")
async def detect_anomalies(file: UploadFile = File(...)):
    try:
        df = pd.read_csv(io.BytesIO(await file.read()))
        numeric_df = df.select_dtypes(include=[np.number]).fillna(0)
        if numeric_df.empty: return {"success": False, "error": "No numeric columns"}
        # Simple Z-score fallback for backend if still called
        mean = numeric_df.mean()
        std = numeric_df.std()
        anomalies = ((numeric_df - mean).abs() > 3 * std).any(axis=1)
        return {"success": True, "anomaly_count": int(anomalies.sum()), "anomalies": df[anomalies].head(10).to_dict(orient='records')}
    except Exception as e: raise HTTPException(status_code=500, detail=str(e))

@router.post("/data-quality")
async def check_quality(file: UploadFile = File(...)):
    try:
        df = pd.read_csv(io.BytesIO(await file.read()))
        return {"success": True, "report": [{"column": c, "missing": int(df[c].isnull().sum()), "unique": int(df[c].nunique())} for c in df.columns]}
    except Exception as e: raise HTTPException(status_code=500, detail=str(e))
