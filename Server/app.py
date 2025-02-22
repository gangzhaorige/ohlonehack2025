from flask import Flask, request, jsonify
import requests
import os

# Set your OpenAI API key
OPENAI_API_KEY = "api key"
OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

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
