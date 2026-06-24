import sqlite3
import os
import json
import uuid

DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'hub.db')

def setup_db():
    if not os.path.exists(os.path.dirname(DB_PATH)):
        os.makedirs(os.path.dirname(DB_PATH))

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Create tables
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS profiles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            icon TEXT NOT NULL
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS links (
            id TEXT PRIMARY KEY,
            profile_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            url TEXT NOT NULL,
            urls TEXT,
            icon TEXT,
            optional_icon TEXT,
            category TEXT NOT NULL,
            is_internal BOOLEAN DEFAULT 0,
            tool_id TEXT,
            is_pinned BOOLEAN DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (profile_id) REFERENCES profiles (id)
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS categories (
            profile_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            icon TEXT NOT NULL,
            PRIMARY KEY (profile_id, name),
            FOREIGN KEY (profile_id) REFERENCES profiles (id)
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS projects (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT,
            url TEXT,
            category TEXT,
            icon TEXT
        )
    ''')


    # Default profiles
    cursor.execute("INSERT OR IGNORE INTO profiles (name, icon) VALUES ('Default', 'home')")
    cursor.execute("INSERT OR IGNORE INTO profiles (name, icon) VALUES ('Private', 'lock')")
    cursor.execute("INSERT OR IGNORE INTO profiles (name, icon) VALUES ('Personal', 'person')")

    # Add unique constraint to links if it doesn't exist
    cursor.execute('CREATE UNIQUE INDEX IF NOT EXISTS idx_links_unique ON links(profile_id, title, url)')

    conn.commit()

    # Get profile IDs
    cursor.execute("SELECT id, name FROM profiles")
    profiles = {name: id for id, name in cursor.fetchall()}

    def get_data_path(filename):
        return os.path.join(os.path.dirname(__file__), '..', 'data', filename)

    def migrate_links(filename, profile_name):
        filepath = get_data_path(filename)
        if not os.path.exists(filepath): return
        profile_id = profiles.get(profile_name)
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
                is_internal = item.get('is_internal', False) or item.get('isInternal', False)
                tool_id = item.get('toolId') or item.get('tool_id')

                cursor.execute('''
                    INSERT OR IGNORE INTO links (id, profile_id, title, url, urls, icon, optional_icon, category, is_internal, tool_id)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (link_id, profile_id, title, url, urls, icon, optional_icon, category, is_internal, tool_id))

    def migrate_categories(filename, profile_name):
        filepath = get_data_path(filename)
        if not os.path.exists(filepath): return
        profile_id = profiles.get(profile_name)
        with open(filepath, 'r') as f:
            categories = json.load(f)
            for name, icon in categories.items():
                cursor.execute('INSERT OR REPLACE INTO categories (profile_id, name, icon) VALUES (?, ?, ?)', (profile_id, name, icon))

    def migrate_projects(filename):
        filepath = get_data_path(filename)
        if not os.path.exists(filepath): return
        with open(filepath, 'r') as f:
            projects = json.load(f)
            for p in projects:
                cursor.execute('''
                    INSERT OR IGNORE INTO projects (id, title, description, url, category, icon)
                    VALUES (?, ?, ?, ?, ?, ?)
                ''', (p.get('id', str(uuid.uuid4())), p.get('title'), p.get('description'), p.get('url'), p.get('category'), p.get('icon')))

    # Check if empty
    cursor.execute("SELECT COUNT(*) FROM links")
    if cursor.fetchone()[0] == 0:
        migrate_links('url_links.json', 'Default')
        migrate_categories('url_cat.json', 'Default')
        migrate_links('necs_links.json', 'Private')
        migrate_categories('necs_cat.json', 'Private')
        migrate_projects('projects.json')
        print("Migration complete.")
    else:
        print("Database already has links, skipping migration.")

    conn.commit()
    conn.close()

if __name__ == '__main__':
    setup_db()
