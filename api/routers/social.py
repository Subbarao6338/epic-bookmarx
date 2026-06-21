from fastapi import APIRouter, HTTPException, Query
import yt_dlp
import requests
import os
from typing import Optional
import google.generativeai as genai

router = APIRouter()

# Initialize Gemini if API key is present
GEMINI_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_KEY:
    genai.configure(api_key=GEMINI_KEY)

@router.get("/info")
async def get_video_info(url: str):
    ydl_opts = {'quiet': True, 'no_warnings': True}
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            return {
                "id": info.get('id'),
                "title": info.get('title'),
                "thumbnail": info.get('thumbnail'),
                "duration": info.get('duration'),
                "uploader": info.get('uploader'),
                "description": info.get('description'),
                "formats": [
                    {
                        "format_id": f.get('format_id'),
                        "ext": f.get('ext'),
                        "resolution": f.get('resolution'),
                        "filesize": f.get('filesize')
                    } for f in info.get('formats', []) if f.get('filesize')
                ]
            }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/summarize")
async def summarize_video(url: str):
    if not GEMINI_KEY:
        return {"success": False, "message": "Gemini API key not configured"}

    try:
        # 1. Get transcript or description
        ydl_opts = {'quiet': True, 'skip_download': True, 'write_auto_sub': True, 'extract_flat': True}
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            text_to_summarize = info.get('description', '')

        # 2. Call Gemini
        model = genai.GenerativeModel('gemini-1.5-flash')
        prompt = f"Summarize the following YouTube video based on its metadata and description. URL: {url}\n\nContent:\n{text_to_summarize[:5000]}"
        response = model.generate_content(prompt)

        return {"success": True, "summary": response.text}
    except Exception as e:
        return {"success": False, "message": str(e)}

@router.get("/download")
async def download_media(url: str, format_id: Optional[str] = None):
    ydl_opts = {'format': format_id if format_id else 'best'}
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            return {"url": info.get('url'), "filename": f"{info.get('title')}.{info.get('ext')}"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/sponsor-segments")
async def get_sponsors(video_id: str):
    try:
        res = requests.get(f"https://sponsor.ajay.app/api/skipSegments?videoID={video_id}")
        if res.status_code == 200:
            return {"success": True, "segments": res.json()}
        return {"success": False, "message": "No segments found"}
    except:
        return {"success": False, "message": "API error"}
