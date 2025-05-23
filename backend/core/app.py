import os
from flask import Flask, request, jsonify
from flask_cors import CORS  # AJOUTE ÇA
import requests
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)  # AJOUTE ÇA - Autorise toutes les origines

API_KEY = os.getenv("TOGETHER_API_KEY")

@app.route("/api", methods=["POST"])
def api():
    print("=== Route /api appelée ===")

    if not API_KEY:
        print("ERROR: API key manquante")
        return jsonify({"error": "API key not configured"}), 500

    user_prompt = request.json.get("prompt", "")
    print(f"Prompt reçu: '{user_prompt}'")

    print("Envoi requête à Together.AI...")

    try:
        response = requests.post(
            "https://api.together.xyz/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
                "messages": [{"role": "user", "content": user_prompt}]
            },
            timeout=30
        )

        print(f"Status code: {response.status_code}")
        data = response.json()
        print(f"Réponse Together.AI: {data}")

        reponse = data["choices"][0]["message"]["content"]
        print(f"Réponse extraite: '{reponse}'")

        return jsonify({"reponse": reponse})

    except Exception as e:
        print(f"ERREUR: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=False, port=8000)
