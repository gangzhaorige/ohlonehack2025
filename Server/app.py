import os
from flask import Flask, request
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv(), request, jsonify
import requests
import os

# Set your OpenAI API key
OPENAI_API_KEY = "api key"
OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"

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
    
if __name__ == '__main__':
    app.run(debug=True)


















@app.route("/generate report", methods=["POST"])
def ask_openai():
    try:
        data = request.json
        prompt = data.get("prompt", "")
        if not prompt:
            return jsonify({"error": "Prompt is required"}), 400
        
        headers = {
            "Authorization": f"Bearer {OPENAI_API_KEY}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "gpt-3.5-turbo",
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.7
        }
        
        response = requests.post(OPENAI_API_URL, headers=headers, json=payload)
        response_data = response.json()
        
        return jsonify(response_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
