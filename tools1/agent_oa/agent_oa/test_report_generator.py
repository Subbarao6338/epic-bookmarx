import sqlite3
import openai
from langchain.prompts import PromptTemplate
from tabulate import tabulate
# from typing import List, Dict, Any


def generate_test_report(code_vectorstore, requirement_chunk, log_db, api_key):
    try:
        openai.api_key = api_key
        prompt = PromptTemplate(
            input_variables=["requirement", "code_features"],
            template=(
                "Please analyze the following requirement and the provided code features.\n"
                "Requirement: {requirement}\n\n"
                "Code Features:\n{code_features}\n\n"
                "Generate a detailed test report that identifies potential edge cases, missing features, or improvement areas."
            ),
        )

        # Retrieve relevant code features from the vector store.
        retriever = code_vectorstore.as_retriever()
        code_features_docs = retriever.get_relevant_documents(requirement_chunk.page_content)
        code_features_text = "\n".join([doc.page_content for doc in code_features_docs])

        # Format the prompt using the template
        formatted_prompt = prompt.format(requirement=requirement_chunk.page_content, code_features=code_features_text)

        # Call OpenAI's API to generate the test report
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  # You can change this to the desired model
            messages=[
                {"role": "user", "content": formatted_prompt}
            ]
        )

        # Extract the generated test report from the response
        result = response['choices'][0]['message']['content']

        # Insert the result into the logs database.
        insert_log(log_db, requirement_chunk.page_content, code_features_text, result)

        return {"requirement": requirement_chunk.page_content, "test_report": result.strip()}
    except Exception as e:
        print(f"Error generating test report: {e}")
        return {"requirement": getattr(requirement_chunk, 'page_content', 'N/A'),
                "test_report": "Error generating report."}


def initialize_database(db_path):
    try:
        with sqlite3.connect(db_path) as conn:
            conn.execute(
                "CREATE TABLE IF NOT EXISTS logs ("
                "id INTEGER PRIMARY KEY, "
                "requirement TEXT, "
                "code_features TEXT, "
                "result TEXT)"
            )
    except sqlite3.Error as e:
        print(f"Database initialization error: {e}")
        raise


def initialize_execution_db(db):
    conn = sqlite3.connect(db)
    conn.execute(
        "CREATE TABLE IF NOT EXISTS execution_logs (id INTEGER PRIMARY KEY, requirement TEXT, result TEXT, error_logs TEXT, test_code TEXT)"
    )
    conn.close()


def insert_log(db, requirement, code_features, result):
    try:
        with sqlite3.connect(db) as conn:
            conn.execute(
                "INSERT INTO logs (requirement, code_features, result) VALUES (?, ?, ?)",
                (requirement, code_features, result)
            )
    except sqlite3.Error as e:
        print(f"Failed to insert log: {e}")


def display_logs(db):
    try:
        with sqlite3.connect(db) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM logs")
            rows = cursor.fetchall()
        print(tabulate(rows, headers=["ID", "Requirement", "Code Features", "Result"], tablefmt="grid"))
    except sqlite3.Error as e:
        print(f"Error retrieving logs: {e}")


def display_test_report(test_report):
    table_data = [[test_report.get("requirement", "N/A"), test_report.get("test_report", "N/A")]]
    headers = ["Requirement", "Test Report"]
    print(tabulate(table_data, headers=headers, tablefmt="grid"))


def display_test_cases(test_cases):
    table_data = []
    headers = ["Requirement", "Test Cases"]
    for case in test_cases:
        table_data.append([case.get("requirement", "N/A"), case.get("test_cases", "N/A")])
    print(tabulate(table_data, headers=headers, tablefmt="grid"))


def display_test_data(test_data_list):
    table_data = []
    headers = ["Requirement", "Test Data"]
    for case in test_data_list:
        table_data.append([case.get("requirement", "N/A"), case.get("test_data", "N/A")])
    print(tabulate(table_data, headers=headers, tablefmt="grid"))

