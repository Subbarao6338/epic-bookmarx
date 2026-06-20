# Notion Content Ingestion Engine

Bridging data from the open web and localized files into structured Notion workspaces.

## Features

- **Multi-Source Scraping**: Direct integration with forum structures (Xossipy, Desifakes).
- **Recursive Folder Scanning**: Ingest entire local directory structures while maintaining hierarchy in Notion.
- **Advanced File Support**: PDF, DOCX, HTML, MHTML, Markdown, and TXT.
- **Smart Chunking**: Automatically splits long documents (PDF/DOCX) into nested Notion subpages every 10 pages for better readability and API compliance.
- **Database Integration**: Option to map files directly into a Notion Database with metadata properties (Path, Extension).
- **Dynamic Translation**: Automatic translation of content to English via Google API.

## Project Structure

```text
forum-notion-archiver/
├── app.py                   # Flask server coordinating tasks
├── core/
│   ├── scraper.py           # Forum crawler logic
│   ├── parsers.py           # Document parsers (PDF, DOCX, etc.)
│   ├── notion_engine.py     # Notion API interface
│   └── scanner.py           # Recursive folder scanner
├── templates/
│   └── index.html           # React/Material UI dashboard
└── requirements.txt         # Dependencies
```

## Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the application:
   ```bash
   python app.py
   ```
4. Access the dashboard at `http://localhost:5000`.

## Usage

### 1. Notion Setup
- Create an internal integration in Notion and get your Secret Token.
- Share your target parent page or database with the integration.
- Copy the Page ID or Database ID.

### 2. Dashboard
- **Notion Configuration**: Enter your token and workspace ID to validate connectivity.
- **Forum Scrapers**: Enter credentials for Xossipy or Desifakes to start a site-wide crawl.
- **Local Ingestion**:
    - Enter a local path to scan a folder recursively.
    - (Optional) Provide a Database ID to ingest files as database rows with metadata.
    - Alternatively, upload a single file directly.
