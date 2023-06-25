import os, openai
from flask import Flask, jsonify, request
from flask.cli import load_dotenv
from flask_cors import CORS

#Load env variables from .env file
load_dotenv()

#get api key from env variable
OPENAI_API_KEY= os.getenv("OPENAI_API_KEY")

app = Flask(__name__)
#Allow cross origin requests
CORS(app)

@app.route("/voiceText", methods = ["POST"])
def handle_text_input():
    transcribed_text = request.json.get("transcribed_text")

    #Generate response based on text
    response = generate_response(transcribed_text)
    return jsonify({'response' : response})

#Method to generate response based on text
def generate_response(transcribed_text):
    openai.api_key = OPENAI_API_KEY
    response = openai.ChatCompletion.create(
        model='gpt-3.5-turbo',  # GPT-3.5 model
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": transcribed_text}
        ],
        max_tokens=100  # response length in tokens
    )
    generated_text = response.choices[0].message['content'].strip()

    return generated_text

if __name__ == '__main__':
    app.run()