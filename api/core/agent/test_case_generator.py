import openai
from langchain_core.prompts import PromptTemplate

def generate_test_cases(chunks, api_key):
    openai.api_key = api_key
    prompt_template = PromptTemplate(
        input_variables=["requirement"],
        template="Generate test cases for the following requirement: {requirement}\nTest Cases:"
    )

    test_cases = []
    for chunk in chunks:
        requirement_text = chunk.page_content
        prompt = prompt_template.format(requirement=requirement_text)

        # Using newer OpenAI API pattern if needed, but keeping for compatibility
        try:
            client = openai.OpenAI(api_key=api_key)
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}]
            )
            result = response.choices[0].message.content
        except Exception:
            # Fallback to legacy if necessary
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}]
            )
            result = response['choices'][0]['message']['content']

        test_cases.append({
            "requirement": requirement_text,
            "test_cases": result.strip()
        })

    return test_cases
