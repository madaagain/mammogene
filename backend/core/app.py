from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

API_KEY = "TA_CLE_API_TOGETHER"  # Remplace par ta vraie clé

@app.route("/api", methods=["POST"])
def api():
    user_prompt = request.json.get("prompt", "")

    response = requests.post(
        "https://api.together.xyz/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "model": "mistralai/Mistral-7B-Instruct-v0.1",
            "messages": [{"role": "user", "content": user_prompt}],
            "temperature": 0.7,
            "max_tokens": 300
        }
    )

    data = response.json()
    reponse = data["choices"][0]["message"]["content"]
    return jsonify({"reponse": reponse})
