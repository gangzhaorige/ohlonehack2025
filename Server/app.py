import os
from flask import Flask, request
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
import os

app = Flask(__name__)

# Set up openai client
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
client = OpenAI(api_key=OPENAI_API_KEY)

# Endpoint to determine corrct answer and explain user's choice accordingly
@app.route('/generate-explain', methods=['POST'])
def generate_explain():
    data = request.get_json()
    question = data.get("question", "")
    answers = data.get("answers", [])
    user_selection = data.get("user_selection", {})
    prompt_text = data.get("prompt", "")
    
    if not question or len(answers) != 4 or not user_selection:
        return {"error": "Invalid input format"}, 400
    
    correct_answer = next((ans for ans in answers if ans.get("correct", False)), None)
    if not correct_answer:
        return {"error": "No correct answer provided"}, 400
    
    user_correct = user_selection.get("id") == correct_answer.get("id")
    
    prompt = f"You are an intelligent AI assistant that evaluates multiple-choice answers. Given a question, four possible answers, and a user's selection, your task is to determine if the user's answer is correct. If correct, provide a detailed explanation of why the answer is right. If incorrect, explain why the user's choice is wrong, provide the correct answer, and explain why it is correct.\n\n"
    prompt += f"Question: {question}\n\nChoices:\n" + "\n".join(
        [f"{ans['text']}" for ans in answers]
    ) + f"\n\nUser's Answer: {user_selection['text']}\n\n"
    
    if user_correct:
        prompt += "Explain why this answer is correct."
    else:
        prompt += f"Explain why this answer is wrong. Provide the correct answer ({correct_answer['text']}) and explain why it is correct."
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}]
        )
        explanation = response.choices[0].message.content
        return {"correct": user_correct, "explanation": explanation}
    except Exception as e:
        return {"error": str(e)}, 500
    



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


















