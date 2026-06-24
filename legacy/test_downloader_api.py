import requests
import sys
import time

def test_download(url, limit=1, download_type='auto'):
    print(f"Testing download for: {url} (limit={limit}, type={download_type})")
    payload = {
        "url": url,
        "limit": limit,
        "download_type": download_type
    }
    try:
        response = requests.post("http://localhost:8000/api/social/download", json=payload)
        if response.status_code == 200:
            print(f"SUCCESS: Downloaded {response.headers.get('Content-Disposition')}")
            return True
        else:
            print(f"FAILED: Status {response.status_code}, Detail: {response.text}")
            return False
    except Exception as e:
        print(f"ERROR: {str(e)}")
        return False

if __name__ == "__main__":
    # Wait for server to be ready
    for i in range(5):
        try:
            requests.get("http://localhost:8000/api/health")
            print("Server is up!")
            break
        except:
            print("Waiting for server...")
            time.sleep(2)

    # Test cases
    # 1. YouTube Short (fast)
    test_download("https://www.youtube.com/shorts/I6m6GCHXkTo", limit=1, download_type='video')

    # 2. Audio only
    test_download("https://www.youtube.com/watch?v=dQw4w9WgXcQ", limit=1, download_type='audio')
