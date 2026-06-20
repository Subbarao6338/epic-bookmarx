import openai
from langchain.prompts import PromptTemplate
# from typing import List, Dict, Any

def generate_test_cases(chunks, api_key):
    # Set the OpenAI API key
    openai.api_key = api_key

    # Define the prompt template
    prompt_template = PromptTemplate(
        input_variables=["requirement"],
        template="Generate test cases for the following requirement: {requirement}\nTest Cases:"
    )

    test_cases = []
    # Process each chunk individually
    for chunk in chunks:
        requirement_text = chunk.page_content
        # Format the prompt using the template
        prompt = prompt_template.format(requirement=requirement_text)
        # Call OpenAI's API to generate test cases
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        # Extract the generated test cases from the response
        result = response['choices'][0]['message']['content']

        test_cases.append({
            "requirement": requirement_text,
            "test_cases": result.strip()
        })

    return test_cases
