import sqlite3
import os

DB_PATH = 'data/hub.db'

def verify():
    if not os.path.exists(DB_PATH):
        print(f"Error: Database not found at {DB_PATH}")
        return

    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    # 1. Check for duplicates
    print("Checking for duplicates...")
    dupes = cursor.execute('''
        SELECT profile_id, title, url, COUNT(*)
        FROM links
        GROUP BY profile_id, title, url
        HAVING COUNT(*) > 1
    ''').fetchall()
    if dupes:
        print(f"Found {len(dupes)} duplicates!")
        for d in dupes:
            print(dict(d))
    else:
        print("No duplicates found.")

    # 2. Check ordering
    print("\nChecking link ordering (is_pinned DESC, title ASC)...")
    links = cursor.execute('SELECT title, is_pinned FROM links ORDER BY is_pinned DESC, title COLLATE NOCASE ASC LIMIT 10').fetchall()
    for l in links:
        print(f"[{'P' if l['is_pinned'] else ' '}] {l['title']}")

    # 3. Test UNIQUE constraint
    print("\nTesting UNIQUE constraint...")
    try:
        cursor.execute('INSERT INTO links (id, profile_id, title, url, category) VALUES (?, ?, ?, ?, ?)',
                       ('test-id', 1, 'NotebookLM', 'https://notebooklm.google.com', 'AI'))
        conn.commit()
        print("Error: Duplicate insertion succeeded!")
    except sqlite3.IntegrityError:
        print("Success: Duplicate insertion failed as expected.")

    # 4. Check category ordering
    print("\nChecking category ordering...")
    cats = cursor.execute('SELECT name FROM categories ORDER BY name ASC LIMIT 5').fetchall()
    cat_names = [c['name'] for c in cats]
    print(f"Categories: {cat_names}")
    if cat_names == sorted(cat_names):
        print("Success: Categories are sorted.")
    else:
         print("Error: Categories are NOT sorted even with ORDER BY.")

    conn.close()

if __name__ == '__main__':
    verify()
