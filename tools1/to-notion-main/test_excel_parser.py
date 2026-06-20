import unittest
import os
from core.parsers import parse_excel
from openpyxl import Workbook

class TestExcelParser(unittest.TestCase):
    def setUp(self):
        self.test_file = "test_data.xlsx"
        wb = Workbook()
        ws = wb.active
        ws.title = "TestSheet"
        ws.append(["Name", "Age", "City"])
        ws.append(["Alice", 30, "New York"])
        ws.append(["Bob", 25, "Los Angeles"])
        wb.save(self.test_file)

    def tearDown(self):
        if os.path.exists(self.test_file):
            os.remove(self.test_file)

    def test_parse_excel(self):
        content = parse_excel(self.test_file)
        self.assertEqual(len(content), 1)
        self.assertIn("## Sheet: TestSheet", content[0])
        self.assertIn("| Name | Age | City |", content[0])
        self.assertIn("| Alice | 30 | New York |", content[0])
        self.assertIn("| Bob | 25 | Los Angeles |", content[0])

if __name__ == "__main__":
    unittest.main()
