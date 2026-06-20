import os
import requirements_loader
import code_loader
import chunker
import vector_store
import test_case_generator
import test_data_generator
import test_report_generator
import test_executor

def main():
    project_path = input("Enter the project path: ").strip()
    requirements_path = input("Enter the requirements file path: ").strip()
    log_db = "test_logs.db"
    execution_log_db = "execution_logs.db"
    code_index = "code_index"
    requirement_index = "requirement_index"
    api_key = "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"

    # Validate the provided paths.
    if not os.path.isdir(project_path):
        print("Error: Project path does not exist or is not a directory.")
        return
    if not os.path.isfile(requirements_path):
        print("Error: Requirements file does not exist or is not a file.")
        return

    # Initialize logs and execution databases.
    try:
        test_report_generator.initialize_database(log_db)
        test_report_generator.initialize_execution_db(execution_log_db)
    except Exception as e:
        print(f"Error initializing the database: {e}")
        return

    # Load documents.
    code_documents = code_loader.load_code_from_project(project_path)
    requirements_documents = requirements_loader.load_requirements(requirements_path)
    if not code_documents:
        print("Error: No code files found in the project path.")
        return
    if not requirements_documents:
        print("Error: No requirements found in the provided file.")
        return

    # Chunk the documents.
    code_chunks = chunker.chunk_documents(code_documents)
    requirements_chunks = chunker.chunk_documents(requirements_documents)

    # Check if chunks are empty
    if not code_chunks:
        print("Error: No code chunks created from the code documents.")
        return
    if not requirements_chunks:
        print("Error: No requirement chunks created from the requirements documents.")
        return

    # Create vector stores using FAISS by embedding the chunks.
    try:
        embedding_model = "text-embedding-ada-002"
        code_vectorstore = vector_store.embed_and_store_in_faiss(code_chunks, code_index, api_key, embedding_model)
        requirements_vectorstore = vector_store.embed_and_store_in_faiss(requirements_chunks, requirement_index,
                                                                         api_key, embedding_model)
    except Exception as e:
        print(f"Error during vector embedding and storing: {e}")
        return

    # Generate test cases using OpenAI.
    try:
        test_cases = test_case_generator.generate_test_cases(requirements_chunks, api_key)
        test_report_generator.display_test_cases(test_cases)
    except Exception as e:
        print(f"Error generating test cases: {e}")

    # Generate test data.
    try:
        test_data = test_data_generator.generate_test_data(requirements_chunks, api_key)
        test_report_generator.display_test_data(test_data)
    except Exception as e:
        print(f"Error generating test data: {e}")

    # For each requirement chunk, generate a test report and execute test code.
    test_reports = []
    for requirement_chunk in requirements_chunks:
        try:
            report = test_report_generator.generate_test_report(code_vectorstore, requirement_chunk, log_db, api_key)
            test_reports.append(report)
            test_code = test_executor.generate_test_code(code_vectorstore, requirements_vectorstore, api_key)
            actual_result, error_logs = test_executor.execute_test_code(test_code, project_path, execution_log_db, requirement_chunk.page_content)
            test_executor.insert_execution_log(execution_log_db, requirement_chunk.page_content, actual_result, error_logs, test_code)
        except Exception as e:
            print(f"Error generating test report for a requirement chunk: {e}")

    # Display test reports and logs.
    try:
        test_report_generator.display_test_report(test_reports)
        test_report_generator.display_logs(log_db)
        test_executor.display_execution_logs(execution_log_db)
    except Exception as e:
        print(f"Error displaying test reports or logs: {e}")

if __name__ == "__main__":
    main()

