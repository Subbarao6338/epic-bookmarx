import json
import sqlite3
import os
import uuid

# Use environment variable for DB_PATH if available (from api/index.py)
IS_VERCEL = os.environ.get('VERCEL') == '1'
if IS_VERCEL:
    DEFAULT_DB_PATH = '/tmp/hub.db'
else:
    DEFAULT_DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'hub.db')

def migrate(db_path=None):
    actual_db_path = db_path or DEFAULT_DB_PATH
    if not os.path.exists(actual_db_path):
        # Try relative to current working directory if not found relative to script
        cwd_db_path = os.path.join('data', 'hub.db')
        if os.path.exists(cwd_db_path):
            actual_db_path = cwd_db_path
        else:
            print(f"Database not found at {actual_db_path}. Please ensure it is initialized.")
            return

    conn = sqlite3.connect(actual_db_path)
    cursor = conn.cursor()

    # Get profile IDs
    cursor.execute("SELECT id, name FROM profiles")
    profiles = {name: id for id, name in cursor.fetchall()}

    # Add unique constraint to links if it doesn't exist
    cursor.execute('CREATE UNIQUE INDEX IF NOT EXISTS idx_links_unique ON links(profile_id, title, url)')

    # Helper to find data files
    def get_data_path(filename):
        # Try relative to script
        path = os.path.join(os.path.dirname(__file__), '..', 'data', filename)
        if os.path.exists(path):
            return path
        # Try relative to CWD
        path = os.path.join('data', filename)
        if os.path.exists(path):
            return path
        return None

    # Helper to migrate links
    def migrate_links(filename, profile_name):
        filepath = get_data_path(filename)
        if not filepath:
            print(f"File {filename} not found.")
            return

        profile_id = profiles.get(profile_name)
        if not profile_id:
            print(f"Profile {profile_name} not found in DB.")
            return

        with open(filepath, 'r') as f:
            links = json.load(f)
            for item in links:
                link_id = str(uuid.uuid4())
                title = item.get('title')
                url = item.get('url') or (item.get('urls')[0] if item.get('urls') else '')
                urls = json.dumps(item.get('urls') or [url])
                icon = item.get('icon') or ''
                optional_icon = item.get('optional_icon') or ''
                category = item.get('category') or 'Others'
                is_internal = item.get('is_internal') or item.get('isInternal', False)
                tool_id = item.get('toolId') or item.get('tool_id')

                cursor.execute('''
                    INSERT OR IGNORE INTO links (id, profile_id, title, url, urls, icon, optional_icon, category, is_internal, tool_id)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (link_id, profile_id, title, url, urls, icon, optional_icon, category, is_internal, tool_id))
        print(f"Migrated links from {filename} to {profile_name} profile.")

    # Helper to migrate categories
    def migrate_categories(filename, profile_name):
        filepath = get_data_path(filename)
        if not filepath:
            print(f"File {filename} not found.")
            return

        profile_id = profiles.get(profile_name)
        if not profile_id:
            print(f"Profile {profile_name} not found in DB.")
            return

        with open(filepath, 'r') as f:
            categories = json.load(f)
            for name, icon in categories.items():
                cursor.execute('''
                    INSERT OR REPLACE INTO categories (profile_id, name, icon)
                    VALUES (?, ?, ?)
                ''', (profile_id, name, icon))
        print(f"Migrated categories from {filename} to {profile_name} profile.")

    # Helper to migrate projects
    def migrate_projects(filename):
        filepath = get_data_path(filename)
        if not filepath:
            print(f"File {filename} not found.")
            return

        with open(filepath, 'r') as f:
            projects = json.load(f)
            for p in projects:
                cursor.execute('''
                    INSERT OR IGNORE INTO projects (id, title, description, url, category, icon)
                    VALUES (?, ?, ?, ?, ?, ?)
                ''', (p.get('id', str(uuid.uuid4())), p.get('title'), p.get('description'), p.get('url'), p.get('category'), p.get('icon')))
        print(f"Migrated projects from {filename}.")

    migrate_links('url_links.json', 'Default')
    migrate_categories('url_cat.json', 'Default')
    migrate_links('necs_links.json', 'Private')
    migrate_categories('necs_cat.json', 'Private')
    migrate_projects('projects.json')

    conn.commit()
    conn.close()
    print("Migration complete.")

if __name__ == "__main__":
    migrate()
