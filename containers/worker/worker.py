from flask import Flask, request, jsonify
from dotenv import load_dotenv
import gen  # Assuming gen.py is in the same directory
import requests  # Import requests to send data to another server
import os # For dotenv

app = Flask(__name__)
load_dotenv()

# Define the allowed URL that can send requests
ALLOWED_API_KEY = os.getenv('ALLOWED_API_KEY')

@app.route('/process', methods=['POST'])
def process_request():
    # Check if the 'X-API-Key' header exists
    api_key = request.headers.get('X-API-Key')
    
    # If the API key is not provided or does not match the allowed key, return an error
    if not api_key or api_key != ALLOWED_API_KEY:
        return jsonify({"error": "Unauthorized: Invalid or missing API Key"}), 403
    


    data = request.json  # Assuming the data is sent as JSON
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    # Pass the data to gen.py for processing
    result = gen.process_data(data)
    
    # Define the URL of the server to send the processed data to
    target_url = 'https://webhook.site/6f69b66c-3db1-4def-863a-a4a9a2c27a2e'  # Replace with the actual URL of the server

    # Send the result via POST to the target server
    try:
        # Send the result dictionary directly to the target URL
        response = requests.post(target_url, json=result)
        
        # Check if the request was successful
        if response.status_code == 200:
            return jsonify({"message": "Data successfully sent to the server"}), 200
        else:
            return jsonify({"error": f"Failed to send data to the server: {response.text}"}), 500
    except requests.exceptions.RequestException as e:
        # Handle any errors during the POST request
        return jsonify({"error": f"Error sending data: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080)  # Binding to 0.0.0.0 to allow external requests
