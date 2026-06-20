import sys
import os

def test_imports():
    print("Testing imports...")
    try:
        import flask
        import requests
        import notion_client
        import bs4
        import deep_translator
        import pypdf
        import docx
        from core.parsers import process_uploaded_document
        from core.notion_engine import NotionEngine
        from core.scraper import ForumCrawler
        from app import app
        print("All imports successful!")
    except ImportError as e:
        print(f"Import failed: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"An error occurred during import: {e}")
        sys.exit(1)

def test_app_init():
    print("Testing app initialization...")
    from app import app
    app.testing = True
    with app.test_client() as client:
        try:
            res = client.get('/')
            if res.status_code == 200:
                print("App initialized and root route accessible!")
            else:
                print(f"App initialized but root route returned status {res.status_code}")
                sys.exit(1)
        except Exception as e:
            print(f"App initialization failed: {e}")
            sys.exit(1)

if __name__ == "__main__":
    test_imports()
    test_app_init()
    print("Verification setup complete and successful!")
