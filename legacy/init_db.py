import sys
import os

# Add the project root to sys.path so we can import from api
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from api.index import init_db

if __name__ == '__main__':
    init_db()
