import os
import subprocess
import openai
import sqlite3
from langchain_core.prompts import PromptTemplate

def generate_test_code(code_vectorstore, requirement_chunk, api_key):
    openai.api_key = api_key
    prompt = PromptTemplate(
        input_variables=["requirement", "code_features"],
        template="""Generate executable Python test code for the following requirement and code features:
        Requirement: {requirement}
        Code Features: {code_features}
        Test Code:
        """,
    )
    retriever = code_vectorstore.as_retriever()
    code_features = retriever.get_relevant_documents(requirement_chunk.page_content)
    code_features_text = "\n".join([doc.page_content for doc in code_features])
    formatted_prompt = prompt.format(requirement=requirement_chunk.page_content, code_features=code_features_text)

    client = openai.OpenAI(api_key=api_key)
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": formatted_prompt}]
    )
    return response.choices[0].message.content.strip()

def execute_tests(test_code, project_path):
    """Full implementation of test execution logic."""
    try:
        temp_file_path = os.path.join(project_path, f"temp_test_{int(time.time())}.py")
        with open(temp_file_path, "w") as f:
            f.write(test_code)

        process = subprocess.run(["python3", temp_file_path], capture_output=True, text=True, cwd=project_path, timeout=30)
        return {
            "status": "success" if process.returncode == 0 else "failed",
            "stdout": process.stdout.strip(),
            "stderr": process.stderr.strip(),
            "returncode": process.returncode
        }
    except subprocess.TimeoutExpired:
        return {"status": "error", "message": "Test execution timed out"}
    except Exception as e:
        return {"status": "error", "message": str(e)}
    finally:
        if 'temp_file_path' in locals() and os.path.exists(temp_file_path):
            os.remove(temp_file_path)

import time
