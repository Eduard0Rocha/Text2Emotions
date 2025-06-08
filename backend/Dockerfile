# Use official Python base image
FROM python:3.10-slim

# Set working directory inside the container
WORKDIR /app

# Copy requirements file into the container
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt \
    && pip install torch --index-url https://download.pytorch.org/whl/cpu

# Copy backend source code into the container
COPY . .

# Expose the port FastAPI will run on
EXPOSE 8000

# Command to run FastAPI app with Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
