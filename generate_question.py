from openai import OpenAI

client = OpenAI()
client.api_key = ""

def generate_question(problem_statement):
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": [
                    {
                    "type": "text",
                    "text": "Create a quiz based on a provided LeetCode problem statement. Ensure that each question includes a question prompt and four possible answers. The quiz should guide the user through problem-solving steps in the sequence: Brute Force, How to Improve Brute Force, Time and Space Complexity, How to Improve Time and Space, leading up to the Optimal Solution. Include multiple questions on each of the following: time complexity, data structure choices for optimization, and potential algorithmic techniques such as two pointers, sliding window, or sorting. If there is no brute force solution start with the possible solutions. \n\n**Include a code snippet for the optimal solution as part of the JSON object for each question set.**\n\n# Steps\n\n1. **Understand the Problem**: Review the provided LeetCode problem to identify key elements and constraints.\n   - Formulate multiple questions about the edge case of the problem.\n\n2. **Identify Brute Force Solution**:\n   - Formulate multiple questions about the brute force approach. Include some hints.\n   - Provide four answer options for each without specifying correct answers.\n   - Include questions about why brute force is not sufficient.\n\n3. **Improvement from Brute Force**:\n   - Develop questions on initial improvements to the brute force approach.\n\n4. **Time and Space Complexity Analysis**:\n   - Create multiple questions regarding the time and space complexity of different approaches.\n   - Develop questions about improving time and space complexity further.\n\n5. **Optimization Techniques**:\n   - Identify potential data structures and algorithms that can improve the solution.\n   - Develop multiple questions about choosing the right data structure.\n   - Create multiple questions about specific algorithmic techniques (e.g., two pointers, sliding window, sorting).\n\n6. **Optimal Solution**:\n   - Develop questions that lead to understanding and implementing the optimal solution.\n\n7. **Wrap-Up Questions**:\n   - Formulate final questions that encapsulate the problem-solving journey from brute force to the optimal solution.\n\n# Output Format\n\nReturn a JSON array with each question structured as a JSON object. Each object should follow this format:\n\n```json\n{\n  \"questions\": [\n    { \n      \"question\": \"[question text]\",\n      \"options\": {\n        \"1\": \"[Answer option]\",\n        \"2\": \"[Answer option]\",\n        \"3\": \"[Answer option]\",\n        \"4\": \"[Answer option]\"\n      },\n    }\n    //... add more questions as needed\n  ],\n \"optimal_code\": \"optimal solution code snippet\",\n}\n```\n\n# Notes \n\n- Each question should logically progress to build understanding from basic concepts to the optimal solution.\n- Include relevant hints to guide the thought process without giving away answers."
                    }
                ]
            },
            {
                "role": "user",
                "content": [
                    {
                    "type": "text",
                    "text": problem_statement,
                    }
                ]
            },
        ],
        response_format={
            "type": "json_object"
        },
        temperature=0.15,
        max_completion_tokens=2048,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0
    )
    return response["choices"][0]["message"]["content"]