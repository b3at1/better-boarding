# Use an official Python runtime as the base image
FROM python:3.9-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the current directory contents (including worker.py and gen.py) into the container
COPY . /app

# Install any needed dependencies (from requirements.txt)
RUN pip install --no-cache-dir -r requirements.txt

# Expose the port the app will run on
EXPOSE 8080

# Command to run the worker.py when the container starts
CMD ["python", "worker.py"]
