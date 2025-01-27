from flask import Flask, request, jsonify

app = Flask(__name__)

def process_data(data):
    # Example processing step (you would implement your logic here)
    processed_data = {"message": "Processed successfullyPOOOOO", "input_data": data}

    # Return the processed data
    return processed_data