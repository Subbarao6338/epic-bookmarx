import unittest
import os
from core.parsers import process_uploaded_document

class TestParsers(unittest.TestCase):
    def test_parse_txt(self):
        content = "Hello World"
        filepath = "test.txt"
        with open(filepath, "w") as f:
            f.write(content)
        result = process_uploaded_document(filepath, ".txt")
        self.assertEqual(result, [content])
        os.remove(filepath)

    def test_parse_markdown(self):
        content = "# Title"
        filepath = "test.md"
        with open(filepath, "w") as f:
            f.write(content)
        result = process_uploaded_document(filepath, ".md")
        self.assertEqual(result, [content])
        os.remove(filepath)

    def test_parse_html(self):
        content = "<html><body><p>Hello</p></body></html>"
        filepath = "test.html"
        with open(filepath, "w") as f:
            f.write(content)
        result = process_uploaded_document(filepath, ".html")
        self.assertIn("Hello", result[0])
        os.remove(filepath)

    def test_parse_image_ocr_fallback(self):
        # We don't necessarily need a real image to test the fallback logic
        # since we know tesseract is missing in this environment
        filepath = "test.png"
        with open(filepath, "w") as f:
            f.write("dummy data")
        result = process_uploaded_document(filepath, ".png")
        self.assertTrue("[OCR not available" in result[0] or "[OCR Error" in result[0])
        os.remove(filepath)

if __name__ == "__main__":
    unittest.main()
