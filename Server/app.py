import os
from flask import Flask, request
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Set up openai client
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
client = OpenAI(api_key=OPENAI_API_KEY)

def generate_openai_response(user_prompt):
    """Helper function to send a prompt to OpenAI and return the response"""
    SYSTEM_PROMPT = """
        You are an AI mentor specializing in LeetCode-style coding problems. Your role is to guide learners step by step, 
        helping them test their knowledge of algorithms and data structures.

        Guidelines:
        - Always act as a patient, encouraging, and constructive mentor.
        - If a student answers correctly, acknowledge their effort with positive reinforcement 
        (e.g., congratulating them or affirming their understanding). Include a brief explanation of why their answer is 
        correct, referencing the overall goal of the problem.
        - If a student answers incorrectly, gently guide them toward the correct answer; adapt your response to the current 
        problem without being too direct or discouraging. Encourage learning by briefly explaining what went wrong and the 
        correct approach, linking back to the problem's context.
        - Provide concise explanations, limited to 3-4 lines max. Do not go beyond that.
        - Keep all explanations within the context of the given question. Do not introduce unrelated topics.
        - If the user provides a non-LeetCode-related question, politely redirect them: 
        *"I can only assist with LeetCode-style coding challenges. Please provide an algorithm or data structure problem!"*

        Response Format:
        - **If correct:** Provide a brief but motivational response and explain why the answer is correct, including the overall
        goal of the problem.
        - **If incorrect:** Gently guide the user toward the correct answer; adapt to the current problem without being too direct 
        or discouraging. Encourage learning by briefly explaining what went wrong and what the correct answer is, referencing 
        relevant concepts related to the problem.

        Your goal is to make learning enjoyable, effective, and confidence-boosting while keeping responses short and to the point."""

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},  
                {"role": "user", "content": user_prompt}
            ]
        )

        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"Error: {str(e)}"

def determine_correct_answer(question, options):
    """Uses OpenAI to determine the correct answer based on the question and options"""
    user_prompt = (
        f"Given the following multiple-choice question and four possible answers, determine the correct answer:\n\n"
        f"Question: {question}\n\nChoices:\n" +
        "\n".join([f"{key}: {value}" for key, value in options.items()])
    )
    
    return generate_openai_response(user_prompt)

def generate_explanation_prompt(question, options, user_selection_text, correct_answer_text, user_correct):
    """Generates an explanation prompt based on whether the user was correct or not"""
    options_text = "\n".join([f"{key}: {value}" for key, value in options.items()])
    
    user_prompt = (
        f"Question: {question}\n\nChoices:\n{options_text}\n\n"
        f"User's Answer: {user_selection_text}\n\n"
    )

    if user_correct:
        user_prompt += "Explain why this answer is correct."
    else:
        user_prompt += f"Explain why this answer is incorrect. The correct answer is ({correct_answer_text}). Explain why it is correct."

    return generate_openai_response(user_prompt)

@app.route('/generate-explain', methods=['POST'])
def generate_explain():
    """API endpoint to determine the correct answer and explain the user's choice"""
    data = request.get_json()
    
    question = data.get("question", "")
    options = data.get("options", {})
    user_selection_text = data.get("user_selection", "")

    # Validate input format
    if not question or len(options) != 4 or not user_selection_text:
        return {"error": "Invalid input format"}, 400

    # Determine the correct answer using OpenAI
    correct_answer_text = determine_correct_answer(question, options)

    # Check if user selected the correct answer
    user_correct = user_selection_text.strip().lower() == correct_answer_text.strip().lower()

    # Generate explanation
    explanation = generate_explanation_prompt(question, options, user_selection_text, correct_answer_text, user_correct)

    return {"correct": user_correct, "explanation": explanation}


@app.route('/generate-recommendation', methods=['POST'])
def generate_recommendation():
    data = request.get_json()
    total_questions = data.get("total_questions", 0)
    correct_answers = data.get("correct_answers", 0)
    user_answers = data.get("user_answers", [])  # List of question-answer pairs
    
    if total_questions <= 0 or correct_answers < 0 or correct_answers > total_questions:
        return {"error": "Invalid input format"}, 400
    
    incorrect_questions = [entry for entry in user_answers if not entry.get("correct", False)]
    topics = []
    
    for entry in incorrect_questions:
        question = entry.get("question", "")
        answer = entry.get("answer", "")
        prompt = f"Identify the main topic of the following question-answer pair and suggest a study recommendation:\n\nQuestion: {question}\nUser Answer: {answer}\n\nProvide the topic and a brief study recommendation."
        
        try:
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}]
            )
            topic_recommendation = response.choices[0].message.content
            topics.append(topic_recommendation)
        except Exception as e:
            print(f"Error generating topic recommendation: {e}")
            topics.append("Error generating topic recommendation.")
    
    if topics:
        recommendation = "Here are some areas you should focus on: " + " ".join(topics)
    else:
        recommendation = "Excellent work! You have a strong grasp of all topics. Keep practicing to maintain your knowledge."
    
    return {"correct_answers": correct_answers, "total_questions": total_questions, "recommendation": recommendation}

    
if __name__ == '__main__':
    app.run(debug=True)


















