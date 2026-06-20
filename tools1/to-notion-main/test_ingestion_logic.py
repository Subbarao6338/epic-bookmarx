import unittest
from unittest.mock import MagicMock, patch
from core.notion_engine import NotionEngine

class TestIngestionLogic(unittest.TestCase):
    def setUp(self):
        self.engine = NotionEngine("fake_token", "fake_parent_id", enable_translation=False)

    def test_smart_chunk_text_no_split_needed(self):
        text = "Short text"
        chunks = self.engine.smart_chunk_text(text, limit=20)
        self.assertEqual(chunks, [text])

    def test_smart_chunk_text_split_at_space(self):
        text = "Hello world this is a test"
        # "Hello world" is 11 chars.
        chunks = self.engine.smart_chunk_text(text, limit=12)
        self.assertEqual(chunks[0], "Hello world")
        self.assertEqual(chunks[1], "this is a")
        self.assertEqual(chunks[2], "test")

    def test_smart_chunk_text_split_at_newline(self):
        text = "Line one\nLine two"
        chunks = self.engine.smart_chunk_text(text, limit=10)
        self.assertEqual(chunks[0], "Line one")
        self.assertEqual(chunks[1], "Line two")

    def test_smart_chunk_text_forced_split(self):
        text = "Superlongwordwithoutspaces"
        chunks = self.engine.smart_chunk_text(text, limit=10)
        self.assertEqual(chunks[0], "Superlongw")
        self.assertEqual(chunks[1], "ordwithout")
        self.assertEqual(chunks[2], "spaces")

    @patch('core.notion_engine.NotionEngine.safe_create_page')
    @patch('core.notion_engine.NotionEngine.compile_and_append_blocks')
    def test_ingest_content_single_chunk(self, mock_append, mock_create):
        mock_create.return_value = "new_page_id"
        chunks = ["Single chunk content"]

        page_id = self.engine.ingest_content("Test Title", chunks)

        self.assertEqual(page_id, "new_page_id")
        mock_create.assert_called_once_with("Test Title", "fake_parent_id")
        mock_append.assert_called_once_with("new_page_id", chunks, [])

    @patch('core.notion_engine.NotionEngine.safe_create_page')
    @patch('core.notion_engine.NotionEngine.compile_and_append_blocks')
    def test_ingest_content_multiple_chunks(self, mock_append, mock_create):
        mock_create.side_effect = ["parent_id", "sub1_id", "sub2_id"]
        chunks = ["Chunk 1", "Chunk 2"]

        page_id = self.engine.ingest_content("Multi Part", chunks)

        self.assertEqual(page_id, "parent_id")
        self.assertEqual(mock_create.call_count, 3)
        self.assertEqual(mock_append.call_count, 2)
        mock_append.assert_any_call("sub1_id", ["Chunk 1"], [])
        mock_append.assert_any_call("sub2_id", ["Chunk 2"], [])

if __name__ == "__main__":
    unittest.main()
