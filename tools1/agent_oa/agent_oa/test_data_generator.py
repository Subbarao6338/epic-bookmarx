import openai
from langchain.prompts import PromptTemplate

def generate_test_data(chunks, api_key):
    openai.api_key = api_key
    # Define the prompt template for generating test data
    prompt_template = PromptTemplate(
        input_variables=["requirement"],
        template="""Generate example test data for the following requirement: {requirement}
        Test Data:""",
        )

    test_data_list = []

    # Process each chunk separately
    for chunk in chunks:
        requirement_text = chunk.page_content

        # Format the prompt using the template
        prompt = prompt_template.format(requirement=requirement_text)

        # Call OpenAI's API to generate test data
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        # Extract the generated test data from the response
        result = response['choices'][0]['message']['content']

        test_data_list.append({
            "requirement": requirement_text,
            "test_data": result.strip()
        })

    return test_data_list
