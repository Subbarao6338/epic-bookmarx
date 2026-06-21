from fastapi import APIRouter, UploadFile, File, HTTPException, Form
import pandas as pd
import io, os, time
from sklearn.ensemble import IsolationForest
import numpy as np
from api.core.data_adv.reconcile import reconcile_data
from api.core.data_adv.synthetic import generate_synthetic_data
from api.core.data_adv.synthetic_adv import generate_synthetic_adv
from api.core.data_adv.image_lab import anonymize_image, simulate_image_transform

router = APIRouter()
UPLOAD_FOLDER = "/tmp/hub_cache/data_lab"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@router.post("/anomaly-detect")
async def detect_anomalies(file: UploadFile = File(...)):
    try:
        df = pd.read_csv(io.BytesIO(await file.read()))
        numeric_df = df.select_dtypes(include=[np.number]).fillna(0)
        if numeric_df.empty: return {"success": False, "error": "No numeric columns"}
        model = IsolationForest(contamination=0.05).fit(numeric_df)
        preds = model.predict(numeric_df)
        anomalies = df.iloc[np.where(preds == -1)[0]].head(10).to_dict(orient='records')
        return {"success": True, "anomaly_count": len(anomalies), "anomalies": anomalies}
    except Exception as e: raise HTTPException(status_code=500, detail=str(e))

@router.post("/data-quality")
async def check_quality(file: UploadFile = File(...)):
    try:
        df = pd.read_csv(io.BytesIO(await file.read()))
        return {"success": True, "report": [{"column": c, "missing": int(df[c].isnull().sum()), "unique": int(df[c].nunique())} for c in df.columns]}
    except Exception as e: raise HTTPException(status_code=500, detail=str(e))

@router.post("/reconcile")
async def run_reconciliation(file1: UploadFile = File(...), file2: UploadFile = File(...), key_column: str = Form(...)):
    try:
        df1 = pd.read_csv(io.BytesIO(await file1.read()))
        df2 = pd.read_csv(io.BytesIO(await file2.read()))
        result = reconcile_data(df1, df2, key_column)
        return {"success": True, "result": result}
    except Exception as e: raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-synthetic")
async def generate_synthetic(file: UploadFile = File(...), num_rows: int = Form(100), advanced: bool = Form(False)):
    try:
        df = pd.read_csv(io.BytesIO(await file.read()))
        if advanced:
            synthetic_df = generate_synthetic_adv(df, num_rows)
        else:
            synthetic_df = generate_synthetic_data(df, num_rows)
        return {"success": True, "data": synthetic_df.to_dict(orient='records')}
    except Exception as e: raise HTTPException(status_code=500, detail=str(e))

@router.post("/image-anonymize")
async def image_anon(file: UploadFile = File(...)):
    path = os.path.join(UPLOAD_FOLDER, f"in_{int(time.time())}_{file.filename}")
    out_path = os.path.join(UPLOAD_FOLDER, f"anon_{file.filename}")
    with open(path, "wb") as b: b.write(await file.read())
    try:
        count = anonymize_image(path, out_path)
        # In a real app, we would return a URL to the image
        return {"success": True, "detected_count": count, "message": "Image anonymized successfully"}
    except Exception as e: raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(path): os.remove(path)

@router.post("/image-simulate")
async def image_sim(file: UploadFile = File(...), transform: str = Form("rotate")):
    path = os.path.join(UPLOAD_FOLDER, f"in_{int(time.time())}_{file.filename}")
    out_path = os.path.join(UPLOAD_FOLDER, f"sim_{file.filename}")
    with open(path, "wb") as b: b.write(await file.read())
    try:
        simulate_image_transform(path, out_path, transform)
        return {"success": True, "message": f"Applied {transform} transformation"}
    except Exception as e: raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(path) : os.remove(path)
