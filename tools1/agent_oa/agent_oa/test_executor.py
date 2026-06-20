import os
import subprocess
import openai
import sqlite3
from langchain.prompts import PromptTemplate
from tabulate import tabulate

def generate_test_code(code_vectorstore, requirement_chunk, api_key):
    openai.api_key = api_key

    # Define the prompt template
    prompt = PromptTemplate(
        input_variables=["requirement", "code_features"],
        template="""Generate executable Python test code for the following requirement and code features:

        Requirement: {requirement}

        Code Features: {code_features}

        Test Code:
        """,
    )

    # Retrieve relevant code features from the vector store
    retriever = code_vectorstore.as_retriever()
    code_features = retriever.get_relevant_documents(requirement_chunk.page_content)
    code_features_text = "\n".join([doc.page_content for doc in code_features])

    # Format the prompt using the template
    formatted_prompt = prompt.format(requirement=requirement_chunk.page_content, code_features=code_features_text)

    # Call OpenAI's API to generate test code
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",  # You can change this to the desired model
        messages=[
            {"role": "user", "content": formatted_prompt}
        ]
    )

    # Extract the generated test code from the response
    test_code = response['choices'][0]['message']['content']
    return test_code.strip()


def execute_test_code(test_code, project_path, log_db, requirement):
    try:
        temp_file_path = os.path.join(project_path, "temp_test.py")
        with open(temp_file_path, "w") as f:
            f.write(test_code)

        process = subprocess.run(["python", temp_file_path], capture_output=True, text=True, cwd=project_path)
        actual_result = process.stdout.strip()
        error_logs = process.stderr.strip()
        return actual_result, error_logs
    except Exception as e:
        insert_execution_log(log_db, requirement, "Error", str(e), "")
        return "Error", str(e)
    finally:
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)


def insert_execution_log(db, requirement, result, error_logs, test_code):
    conn = sqlite3.connect(db)
    cursor = conn.cursor()
    cursor.execute("INSERT INTO execution_logs (requirement, result, error_logs, test_code) VALUES (?, ?, ?, ?)",
                   (requirement, result, error_logs, test_code))
    conn.commit()
    conn.close()


def display_execution_logs(db):
    conn = sqlite3.connect(db)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM execution_logs")
    rows = cursor.fetchall()
    conn.close()
    print(tabulate(rows, headers=["ID", "Requirement", "Result", "Error Logs", "Test Code"], tablefmt="grid"))
