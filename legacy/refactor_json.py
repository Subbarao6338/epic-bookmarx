import json
import os
import re

FILE_PATH = 'data/url_links.json'

# ONLY touch these categories
SOURCE_CATEGORIES = ["Tools", "Utilities", "Productivity"]

DOC_KEYWORDS = [r"PDF", r"Word", r"Excel", r"PowerPoint", r"Markdown", r"Document", r"Reader", r"Notes", r"OCR", r"Smallpdf", r"ILovePDF"]
TIME_KEYWORDS = [r"Panchangam", r"Birthday", r"\bAge\b", r"Clock", r"\bTime\b", r"\bDate\b", r"Stopwatch", r"Pomodoro", r"Countdown", r"Timestamp", r"Worldometers"]

EXCEPTIONS = {
    "NotebookLM": "AI",
    "Repo Hub": "Linux",
    "Cloudflare Pages": "Hosting"
}

def refactor():
    if not os.path.exists(FILE_PATH):
        print(f"File not found: {FILE_PATH}")
        return

    with open(FILE_PATH, 'r') as f:
        links = json.load(f)

    # 1. Deduplicate
    seen = set()
    unique_links = []
    for link in links:
        identifier = (link.get('title'), link.get('url'))
        if identifier not in seen:
            seen.add(identifier)
            unique_links.append(link)

    print(f"Original: {len(links)}, Unique: {len(unique_links)}")

    # 2. Reassign categories
    for link in unique_links:
        title = link.get('title', '')
        category = link.get('category', '')
        is_internal = link.get('isInternal', False) or link.get('is_internal', False)

        # Check exceptions first
        matched_exception = False
        for exc_title, exc_cat in EXCEPTIONS.items():
            if exc_title.lower() in title.lower():
                link['category'] = exc_cat
                matched_exception = True
                break

        if matched_exception:
            continue

        # "don't touch Toolbox, only Bookmarks"
        # Since 'Bookmarks' is the main view displaying everything,
        # I should ONLY pull from SOURCE_CATEGORIES and definitely skip Toolbox and internal tools.
        if category in SOURCE_CATEGORIES and not is_internal and category != "Toolbox":
            is_doc = any(re.search(kw, title, re.IGNORECASE) for kw in DOC_KEYWORDS)
            is_time = any(re.search(kw, title, re.IGNORECASE) for kw in TIME_KEYWORDS)

            if is_doc:
                link['category'] = "Documents"
            elif is_time:
                link['category'] = "Date & Time"

    with open(FILE_PATH, 'w') as f:
        json.dump(unique_links, f, indent=2)

    print("Refactoring complete.")

if __name__ == '__main__':
    refactor()
