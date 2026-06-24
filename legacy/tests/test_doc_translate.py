import requests
import os

def test_translation():
    url = "http://localhost:8000/api/docs/translate"

    # Create a dummy text file
    with open("test.txt", "w") as f:
        f.write("Hello world. This is a test.")

    try:
        with open("test.txt", "rb") as f:
            files = {"file": ("test.txt", f, "text/plain")}
            data = {"target_lang": "telugu"}
            response = requests.post(url, files=files, data=data)

        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            print(f"Response: {response.json().get('translated_text')}")
        else:
            print(f"Error: {response.text}")
    finally:
        if os.path.exists("test.txt"):
            os.remove("test.txt")

if __name__ == "__main__":
    # Ensure server is running or mock if needed
    # For this environment, we might need to start it in background
    print("Testing translation endpoint...")
    test_translation()
