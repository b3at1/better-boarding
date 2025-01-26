from flask import Flask, jsonify
from flask_cors import CORS
import uuid
import threading
import requests
from flask import request
from gen import process_data
import time
import asyncio

app = Flask(__name__)
CORS(app)


@app.route('/')
def home():
    return jsonify(message="Hello, World!")


data_store = {}

@app.route('/api', methods=['POST'])
def api():
    data = request.get_json()
    generated_uuid = str(uuid.uuid4())
    data_store[generated_uuid] = data

    async def async_process():
        print('Processing data...')
        result = await process_data(data)
        time_taken = result[-1]
        result = result[:-1][0]

        body = {
            'jobId': generated_uuid,
            'result': result,
            'timeTaken': time_taken
        }

        requests.post('http://localhost:3000/api/finish', json=body)

    threading.Thread(target=lambda: asyncio.run(async_process())).start()
    return jsonify(jobId=generated_uuid)


if __name__ == '__main__':
    app.run(debug=True)
