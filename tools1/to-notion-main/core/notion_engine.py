import os
import re
import logging
import time
from functools import wraps
from notion_client import Client, APIResponseError
from deep_translator import GoogleTranslator
import requests

logger = logging.getLogger(__name__)

def retry_notion_api(max_retries=3, backoff_factor=2):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            retries = 0
            while retries < max_retries:
                try:
                    return func(*args, **kwargs)
                except APIResponseError as e:
                    if e.status in [429, 500, 502, 503, 504]:
                        retries += 1
                        if retries >= max_retries:
                            raise
                        wait_time = backoff_factor ** retries
                        if e.status == 429:
                            # Try to get retry-after header if available
                            wait_time = int(e.headers.get("Retry-After", wait_time))
                        logger.warning(f"Notion API error {e.status}. Retrying in {wait_time}s... (Attempt {retries}/{max_retries})")
                        time.sleep(wait_time)
                    else:
                        raise
                except Exception:
                    raise
            raise RuntimeError(f"Max retries reached for {func.__name__}")
        return wrapper
    return decorator

class NotionEngine:
    def __init__(self, token, parent_id, enable_translation=True):
        self.client = Client(auth=token)
        self.parent_id = parent_id
        self.enable_translation = enable_translation
        self._parent_type_cache = {}

    def _get_parent_key(self, parent_id):
        if parent_id in self._parent_type_cache:
            return self._parent_type_cache[parent_id]

        try:
            # Try to retrieve as a block to see if it's a database
            block = self.client.blocks.retrieve(block_id=parent_id)
            if block.get("type") == "child_database":
                self._parent_type_cache[parent_id] = "database_id"
            else:
                self._parent_type_cache[parent_id] = "page_id"
        except Exception:
            # Second attempt: check if it's a top-level database
            try:
                self.client.databases.retrieve(database_id=parent_id)
                self._parent_type_cache[parent_id] = "database_id"
            except Exception:
                # Fallback to page_id, safe_create_page will retry with database_id if it fails
                return "page_id"

        return self._parent_type_cache[parent_id]

    def _is_primarily_english(self, text):
        if not text: return True
        # Simple heuristic: if > 80% of chars are ASCII, assume it's English/code
        ascii_chars = len([c for c in text if ord(c) < 128])
        return (ascii_chars / len(text)) > 0.8

    def clean_and_translate(self, text):
        cleaned = text.strip()
        if not cleaned: return ""
        if not self.enable_translation: return cleaned
        if self._is_primarily_english(cleaned): return cleaned
        try:
            translator = GoogleTranslator(source='auto', target='en')
            # Chunk text to avoid Google Translate limits (approx 5000 chars)
            translation_chunks = self.smart_chunk_text(cleaned, limit=4500)
            translated_parts = [translator.translate(c) for c in translation_chunks]
            return " ".join(translated_parts)
        except Exception:
            return cleaned

    def smart_chunk_text(self, text, limit=2000):
        if len(text) <= limit:
            return [text]
        chunks = []
        while text:
            if len(text) <= limit:
                chunks.append(text)
                break

            # Find the best split point
            split_idx = -1
            space_idx = text.rfind(' ', 0, limit)
            newline_idx = text.rfind('\n', 0, limit)

            split_idx = max(space_idx, newline_idx)

            if split_idx == -1:
                split_idx = limit

            chunks.append(text[:split_idx])
            text = text[split_idx:].lstrip()
        return chunks

    def ingest_content(self, title, content_chunks, metadata=None, database_id=None, current_parent_id=None):
        target_parent = current_parent_id if current_parent_id else self.parent_id
        entry_id = None
        if database_id:
            entry_id = self.create_database_row(database_id, title, metadata or {}, fallback_parent_id=target_parent)
        else:
            entry_id = self.safe_create_page(title, target_parent)

        if entry_id:
            if len(content_chunks) > 1:
                for idx, chunk in enumerate(content_chunks, 1):
                    subpage_id = self.safe_create_page(f"{title} - Part {idx}", entry_id)
                    if subpage_id:
                        self.compile_and_append_blocks(subpage_id, [chunk], [])
            else:
                self.compile_and_append_blocks(entry_id, content_chunks, [])
        return entry_id

    @retry_notion_api()
    def safe_create_page(self, title, custom_parent_id=None):
        target_parent = custom_parent_id if custom_parent_id else self.parent_id
        translated_title = self.clean_and_translate(title) or "Untitled Archived Resource"

        parent_key = self._get_parent_key(target_parent)

        try:
            page = self.client.pages.create(
                parent={parent_key: target_parent},
                properties={"title": {"title": [{"text": {"content": translated_title}}]}}
            )
            return page["id"]
        except Exception as e:
            # If it failed, maybe the parent key was wrong (e.g. it was a database but cache/retrieve said page)
            other_key = "database_id" if parent_key == "page_id" else "page_id"
            try:
                page = self.client.pages.create(
                    parent={other_key: target_parent},
                    properties={"title": {"title": [{"text": {"content": translated_title}}]}}
                )
                self._parent_type_cache[target_parent] = other_key
                return page["id"]
            except Exception as e2:
                logger.error(f"Notion API creation error for '{title}': {e2}")
                return None

    @retry_notion_api()
    def create_database_row(self, database_id, title, metadata, fallback_parent_id=None):
        """Creates a row in a Notion Database with metadata properties."""
        try:
            properties = {
                "Name": {"title": [{"text": {"content": self.clean_and_translate(title)}}]},
                "Path": {"rich_text": [{"text": {"content": metadata.get("path", "")}}]},
                "Extension": {"select": {"name": metadata.get("extension", "unknown")}}
            }
            page = self.client.pages.create(
                parent={"database_id": database_id},
                properties=properties
            )
            return page["id"]
        except Exception as e:
            logger.error(f"Database row creation error for {title}: {e}")
            return self.safe_create_page(title, custom_parent_id=fallback_parent_id)

    @retry_notion_api()
    def find_child_by_title(self, parent_id, title):
        """Checks if a child page with the given title already exists under the parent."""
        try:
            has_more = True
            start_cursor = None
            while has_more:
                response = self.client.blocks.children.list(block_id=parent_id, start_cursor=start_cursor)
                for block in response.get("results", []):
                    if block["type"] == "child_page" and block["child_page"]["title"] == title:
                        return block["id"]
                has_more = response.get("has_more")
                start_cursor = response.get("next_cursor")
        except Exception:
            pass
        return None

    def get_or_create_nested_pages(self, path_parts, current_parent_id=None):
        parent_id = current_parent_id if current_parent_id else self.parent_id
        for part in path_parts:
            translated_title = self.clean_and_translate(part) or "Untitled Archived Resource"
            existing_id = self.find_child_by_title(parent_id, translated_title)
            if existing_id:
                parent_id = existing_id
            else:
                new_id = self.safe_create_page(part, parent_id)
                if new_id:
                    parent_id = new_id
                else:
                    break
        return parent_id

    def upload_media_mirror(self, url, folder="temp_cache"):
        if not os.path.exists(folder): os.makedirs(folder)
        try:
            filename = url.split("/")[-1].split("?")[0]
            if not filename.lower().endswith(('.jpg', '.jpeg', '.png', '.gif', '.mp4', '.webm')):
                return None

            local_path = os.path.join(folder, filename)
            logger.info(f"Downloading media for mirror: {url}")
            res = requests.get(url, stream=True, timeout=15)
            if res.status_code == 200:
                with open(local_path, 'wb') as f:
                    for chunk in res.iter_content(4096): f.write(chunk)

                with open(local_path, "rb") as file_bytes:
                    up_res = requests.post("https://catbox.moe/user/api.php",
                                            data={"reqtype": "fileupload"},
                                            files={"fileToUpload": file_bytes}, timeout=20)
                if os.path.exists(local_path): os.remove(local_path)
                if up_res.status_code == 200 and up_res.text.startswith("http"):
                    return up_res.text.strip()
                else:
                    logger.warning(f"Catbox upload failed for {url}: {up_res.text}")
            else:
                logger.warning(f"Failed to download media {url}: status {res.status_code}")
        except Exception as e:
            logger.error(f"Media mirror error for {url}: {e}")
        return None

    def _to_rich_text_objects(self, text, annotations):
        if not text: return []
        rich_text = []
        annotations_copy = annotations.copy()
        link_url = annotations_copy.pop('link', None)

        for i in range(0, len(text), 2000):
            chunk = text[i:i+2000]
            obj = {"type": "text", "text": {"content": chunk or " "}}
            if annotations_copy:
                obj["annotations"] = annotations_copy
            if link_url:
                obj["text"]["link"] = {"url": link_url}
            rich_text.append(obj)
        return rich_text

    def parse_markdown_to_rich_text(self, text):
        """Robust markdown parser for bold, italic, inline code, and links with nesting support."""
        def _parse(inner_text, current_annotations):
            if not inner_text: return []

            patterns = [
                ('link', r'\[(?P<text>.*?)\]\((?P<url>.*?)\)'),
                ('bold', r'(\*\*|__)(?P<text>.*?)\1'),
                ('italic', r'(\*|_)(?P<text>.*?)\1'),
                ('code', r'`(?P<text>.*?)`'),
                ('strikethrough', r'~~(?P<text>.*?)~~'),
                ('underline', r'<u>(?P<text>.*?)</u>'),
            ]

            best_match = None
            best_type = None

            for m_type, pattern in patterns:
                match = re.search(pattern, inner_text)
                if match:
                    if best_match is None or match.start() < best_match.start():
                        best_match = match
                        best_type = m_type
                    elif match.start() == best_match.start():
                        if len(match.group(0)) > len(best_match.group(0)):
                            best_match = match
                            best_type = m_type

            if not best_match:
                return self._to_rich_text_objects(inner_text, current_annotations)

            result = []
            if best_match.start() > 0:
                result.extend(_parse(inner_text[:best_match.start()], current_annotations))

            new_ann = current_annotations.copy()
            if best_type == 'link':
                new_ann['link'] = best_match.group('url')
                result.extend(_parse(best_match.group('text'), new_ann))
            elif best_type == 'bold':
                new_ann['bold'] = True
                result.extend(_parse(best_match.group('text'), new_ann))
            elif best_type == 'italic':
                new_ann['italic'] = True
                result.extend(_parse(best_match.group('text'), new_ann))
            elif best_type == 'code':
                new_ann['code'] = True
                result.extend(_parse(best_match.group('text'), new_ann))
            elif best_type == 'strikethrough':
                new_ann['strikethrough'] = True
                result.extend(_parse(best_match.group('text'), new_ann))
            elif best_type == 'underline':
                new_ann['underline'] = True
                result.extend(_parse(best_match.group('text'), new_ann))

            result.extend(_parse(inner_text[best_match.end():], current_annotations))
            return result

        rich_results = _parse(text, {})
        return rich_results if rich_results else [{"type": "text", "text": {"content": " "}}]

    def _create_table_block(self, rows):
        if not rows: return None

        # Determine if there is a header row (the second row should be the separator)
        has_column_header = False
        if len(rows) > 1:
            second_row = rows[1].strip()
            # Relaxed regex for markdown table separator
            if re.match(r'^\|?(\s*:?---:?\s*\|)*\s*:?---:?\s*\|?$', second_row) and '---' in second_row:
                has_column_header = True
                data_rows = [rows[0]] + rows[2:]
            else:
                data_rows = rows
        else:
            data_rows = rows

        if not data_rows: return None

        table_children = []
        max_cols = 0
        for row_str in data_rows:
            # Handle rows that might not start/end with | but are pipe-delimited
            content = row_str.strip()
            if content.startswith('|'): content = content[1:]
            if content.endswith('|'): content = content[:-1]

            # Use regex to split by | but ignore \|
            cells = [cell.strip() for cell in re.split(r'(?<!\\)\|', content)]
            # Unescape \|
            cells = [cell.replace('\\|', '|') for cell in cells]

            max_cols = max(max_cols, len(cells))
            row_block = {
                "type": "table_row",
                "table_row": {
                    "cells": [self.parse_markdown_to_rich_text(cell) for cell in cells]
                }
            }
            table_children.append(row_block)

        if max_cols == 0: return None

        # Normalize cell counts
        for row_block in table_children:
            cells = row_block["table_row"]["cells"]
            while len(cells) < max_cols:
                cells.append([{"type": "text", "text": {"content": ""}}])

        return {
            "object": "block",
            "type": "table",
            "table": {
                "table_width": max_cols,
                "has_column_header": has_column_header,
                "has_row_header": False,
                "children": table_children
            }
        }

    @retry_notion_api()
    def compile_and_append_blocks(self, page_id, text_segments, media_urls):
        blocks = []
        for text in text_segments:
            processed = self.clean_and_translate(text)
            if not processed: continue

            # Simple markdown-ish parsing
            lines = processed.split('\n')
            in_code_block = False
            code_content = []
            code_lang = "plain text"
            in_table = False
            table_rows = []

            for line in lines:
                if line.startswith("```"):
                    if in_code_block:
                        # End of code block
                        full_code = "\n".join(code_content)
                        # Split code into chunks of 2000 if needed for rich text
                        rich_text = [{"type": "text", "text": {"content": c or " "}} for c in self.smart_chunk_text(full_code)]
                        blocks.append({"object": "block", "type": "code",
                                       "code": {"rich_text": rich_text[:100], "language": code_lang}})
                        code_content = []
                        in_code_block = False
                    else:
                        if in_table:
                            table_block = self._create_table_block(table_rows)
                            if table_block: blocks.append(table_block)
                            table_rows = []
                            in_table = False
                        in_code_block = True
                        # Detect language
                        lang = line.strip("`").strip().lower()
                        supported_langs = ["abap", "arduino", "bash", "basic", "c", "c#", "c++", "clojure", "coffeescript", "common lisp", "coq", "cpp", "crystal", "css", "dart", "diff", "docker", "elixir", "elm", "emacs lisp", "erlang", "f#", "flow", "fortran", "fsharp", "gherkin", "glsl", "go", "graphql", "groovy", "haskell", "html", "idris", "java", "javascript", "json", "julia", "kotlin", "latex", "less", "lisp", "livecodescript", "lua", "makefile", "markdown", "markup", "matlab", "mermaid", "nix", "objective-c", "ocaml", "pascal", "perl", "php", "plain text", "powershell", "prolog", "protobuf", "python", "r", "racket", "ruby", "rust", "sass", "scala", "scheme", "scss", "shell", "sql", "swift", "typescript", "vb.net", "verilog", "vhdl", "visual basic", "webassembly", "xml", "yaml"]
                        code_lang = lang if lang in supported_langs else "plain text"
                    continue

                if in_code_block:
                    code_content.append(line)
                    continue

                if "|" in line and not in_code_block:
                    if not in_table:
                        in_table = True
                        table_rows = [line]
                    else:
                        table_rows.append(line)
                    continue
                elif in_table:
                    table_block = self._create_table_block(table_rows)
                    if table_block: blocks.append(table_block)
                    table_rows = []
                    in_table = False

                if not line.strip(): continue

                block = {"object": "block"}
                if line.startswith("# "):
                    block.update({"type": "heading_1", "heading_1": {"rich_text": self.parse_markdown_to_rich_text(line[2:])}})
                elif line.startswith("## "):
                    block.update({"type": "heading_2", "heading_2": {"rich_text": self.parse_markdown_to_rich_text(line[3:])}})
                elif line.startswith("### "):
                    block.update({"type": "heading_3", "heading_3": {"rich_text": self.parse_markdown_to_rich_text(line[4:])}})
                elif line.startswith("- "):
                    block.update({"type": "bulleted_list_item", "bulleted_list_item": {"rich_text": self.parse_markdown_to_rich_text(line[2:])}})
                elif re.match(r'^\d+\.\s', line):
                    # Numbered list support: 1. Item
                    match = re.match(r'^\d+\.\s(?P<content>.*)', line)
                    block.update({"type": "numbered_list_item", "numbered_list_item": {"rich_text": self.parse_markdown_to_rich_text(match.group('content'))}})
                elif line.startswith("> [!"):
                    # Callout support: > [!INFO] Message
                    match = re.match(r'> \[!(?P<type>\w+)\]\s*(?P<content>.*)', line)
                    if match:
                        callout_type = match.group('type').upper()
                        content = match.group('content')
                        icon_map = {"INFO": "ℹ️", "WARNING": "⚠️", "ERROR": "🚨", "SUCCESS": "✅", "NOTE": "📝", "TIP": "💡"}
                        icon = icon_map.get(callout_type, "💡")
                        block.update({"type": "callout", "callout": {
                            "rich_text": self.parse_markdown_to_rich_text(content),
                            "icon": {"type": "emoji", "emoji": icon}
                        }})
                    else:
                        block.update({"type": "quote", "quote": {"rich_text": self.parse_markdown_to_rich_text(line[2:])}})
                elif line.startswith("> "):
                    block.update({"type": "quote", "quote": {"rich_text": self.parse_markdown_to_rich_text(line[2:])}})
                elif line.startswith("- [ ] "):
                    block.update({"type": "to_do", "to_do": {"rich_text": self.parse_markdown_to_rich_text(line[6:]), "checked": False}})
                elif line.startswith("- [x] ") or line.startswith("- [X] "):
                    block.update({"type": "to_do", "to_do": {"rich_text": self.parse_markdown_to_rich_text(line[6:]), "checked": True}})
                elif line.strip() in ["---", "***", "___"]:
                    block.update({"type": "divider", "divider": {}})
                else:
                    # Better paragraph chunking to preserve markdown
                    rich_text_objects = self.parse_markdown_to_rich_text(line)
                    # If we have more than 100 rich text objects, we must split into multiple paragraph blocks
                    for i in range(0, len(rich_text_objects), 100):
                        blocks.append({"object": "block", "type": "paragraph",
                                       "paragraph": {"rich_text": rich_text_objects[i:i+100]}})
                    continue

                blocks.append(block)

        for m_url in media_urls:
            stable_url = self.upload_media_mirror(m_url)
            if not stable_url: continue
            b_type = "video" if stable_url.lower().endswith(('.mp4', '.webm')) else "image"
            blocks.append({
                "object": "block",
                "type": b_type,
                b_type: {
                    "type": "external",
                    "external": {"url": stable_url},
                    "caption": [{"type": "text", "text": {"content": f"Source: {m_url}"}}]
                }
            })

        # Final flush for tables
        if in_table:
            table_block = self._create_table_block(table_rows)
            if table_block: blocks.append(table_block)

        try:
            for i in range(0, len(blocks), 100):
                self.client.blocks.children.append(block_id=page_id, children=blocks[i:i+100])
        except Exception as e:
            logger.error(f"Error executing batch append to {page_id}: {e}")
