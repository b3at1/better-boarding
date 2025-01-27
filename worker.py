from flask import Flask, request, jsonify
from flask_cors import CORS
import uuid
import threading
import requests 
from gen import process_data

app = Flask(__name__)
CORS(
    app,
    resources={r"/*": {"origins": ["*"]}},
    allow_headers=["Content-Type", "Authorization"]
)

# Handle preflight (OPTIONS) requests explicitly, in case the browser triggers one.
@app.route('/process', methods=['OPTIONS'])
def options():
    response = app.make_response('')
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    return response
    
@app.route('/process', methods=['POST'])
def api():
    data = request.json
    generated_uuid = str(uuid.uuid4())

    def process():
        try:
            result = process_data(data)
            time_taken = result[-1]
            result = result[:-1][0]

            body = {
                'jobId': generated_uuid,
                'result': result,
                'timeTaken': time_taken
            }

            # requests.post('https://betterboarding.tech/api/finish', json=body)
            requests.post('http://localhost:3000/api/finish', json=body)

        except Exception as e:
            print(f"Error during processing: {e}")

    threading.Thread(target=process).start()
    return jsonify(jobId=generated_uuid)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)