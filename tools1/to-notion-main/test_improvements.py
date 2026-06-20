import unittest
import os
import json
from core.parsers import parse_json, parse_csv, parse_yaml, parse_xml
from core.notion_engine import NotionEngine

class TestImprovements(unittest.TestCase):
    def test_parse_json(self):
        data = {"key": "value", "list": [1, 2, 3]}
        filepath = "test.json"
        with open(filepath, "w") as f:
            json.dump(data, f)

        result = parse_json(filepath)
        self.assertIn("```json", result[0])
        self.assertIn('"key": "value"', result[0])
        os.remove(filepath)

    def test_parse_csv(self):
        content = "Name,Age\nAlice,30\nBob,25"
        filepath = "test.csv"
        with open(filepath, "w") as f:
            f.write(content)

        result = parse_csv(filepath)
        self.assertIn("| Name | Age |", result[0])
        self.assertIn("| Alice | 30 |", result[0])
        self.assertIn("| --- | --- |", result[0])
        os.remove(filepath)

    def test_parse_yaml(self):
        data = {"key": "value", "list": [1, 2, 3]}
        filepath = "test.yaml"
        import yaml
        with open(filepath, "w") as f:
            yaml.dump(data, f)

        result = parse_yaml(filepath)
        self.assertIn("```yaml", result[0])
        self.assertIn("key: value", result[0])
        os.remove(filepath)

    def test_parse_xml(self):
        content = "<root><child>value</child></root>"
        filepath = "test.xml"
        with open(filepath, "w") as f:
            f.write(content)

        result = parse_xml(filepath)
        self.assertIn("```xml", result[0])
        self.assertIn("<child>value</child>", result[0])
        os.remove(filepath)

    def test_markdown_to_rich_text(self):
        engine = NotionEngine("fake", "fake", enable_translation=False)

        # Test Bold
        text = "Hello **world**"
        rich = engine.parse_markdown_to_rich_text(text)
        self.assertEqual(len(rich), 2)
        self.assertEqual(rich[1]["text"]["content"], "world")
        self.assertTrue(rich[1]["annotations"]["bold"])

        # Test Italic
        text = "Hello *world*"
        rich = engine.parse_markdown_to_rich_text(text)
        self.assertEqual(len(rich), 2)
        self.assertEqual(rich[1]["text"]["content"], "world")
        self.assertTrue(rich[1]["annotations"]["italic"])

        # Test Inline Code
        text = "Hello `code`"
        rich = engine.parse_markdown_to_rich_text(text)
        self.assertEqual(len(rich), 2)
        self.assertEqual(rich[1]["text"]["content"], "code")
        self.assertTrue(rich[1]["annotations"]["code"])

        # Test Link
        text = "Hello [google](https://google.com)"
        rich = engine.parse_markdown_to_rich_text(text)
        self.assertEqual(len(rich), 2)
        self.assertEqual(rich[1]["text"]["content"], "google")
        self.assertEqual(rich[1]["text"]["link"]["url"], "https://google.com")

        # Test Strikethrough
        text = "Hello ~~world~~"
        rich = engine.parse_markdown_to_rich_text(text)
        self.assertEqual(len(rich), 2)
        self.assertEqual(rich[1]["text"]["content"], "world")
        self.assertTrue(rich[1]["annotations"]["strikethrough"])

        # Test Underline
        text = "Hello <u>world</u>"
        rich = engine.parse_markdown_to_rich_text(text)
        self.assertEqual(len(rich), 2)
        self.assertEqual(rich[1]["text"]["content"], "world")
        self.assertTrue(rich[1]["annotations"]["underline"])

        # Test Mixed
        text = "**Bold** and *Italic* with `code` and [link](url)"
        rich = engine.parse_markdown_to_rich_text(text)
        self.assertEqual(len(rich), 7)
        self.assertTrue(rich[0]["annotations"]["bold"])
        self.assertEqual(rich[1]["text"]["content"], " and ")
        self.assertTrue(rich[2]["annotations"]["italic"])
        self.assertEqual(rich[3]["text"]["content"], " with ")
        self.assertTrue(rich[4]["annotations"]["code"])
        self.assertEqual(rich[5]["text"]["content"], " and ")
        self.assertEqual(rich[6]["text"]["content"], "link")
        self.assertEqual(rich[6]["text"]["link"]["url"], "url")

    def test_rich_text_limit(self):
        engine = NotionEngine("fake", "fake", enable_translation=False)
        long_text = "a" * 2500
        rich = engine.parse_markdown_to_rich_text(long_text)
        self.assertEqual(len(rich), 2)
        self.assertEqual(len(rich[0]["text"]["content"]), 2000)
        self.assertEqual(len(rich[1]["text"]["content"]), 500)

if __name__ == "__main__":
    unittest.main()
