# Emotion Analysis Backend API

This backend API provides emotion analysis for input text. It splits the input text into sentences and returns the dominant emotion detected in each sentence using a pre-trained Hugging Face transformer model.

## Features

- Analyze dominant emotions sentence-by-sentence
- Uses [Emotion English DistilRoBERTa-base](https://huggingface.co/j-hartmann/emotion-english-distilroberta-base) model for emotion classification
- FastAPI-based REST API with automatic docs (Swagger UI)
- Confidence threshold for emotion detection (default: 0.7)
- Returns `null` if no emotion meets the confidence threshold

## Tech Stack

- **Python 3.10+**
- **FastAPI** – RESTful API framework
- **Uvicorn** – ASGI server for running the app
- **Transformers** – For NLP emotion detection
- **Torch (CPU-only)** – Required backend for Transformers
- **Docker** – Containerization and deployment


## Running the App

To build and run the FastAPI backend using Docker, use the following commands:

```bash
docker build -t emotion-api .
docker run -p 8000:8000 emotion-api
```

Once the container is running, you can access the API documentation at:
[http://localhost:8000/docs](http://localhost:8000/docs)

**Note**: The first time you run the container, it may take a few minutes to start. This delay happens because the Hugging Face model ([Emotion English DistilRoBERTa-base](https://huggingface.co/j-hartmann/emotion-english-distilroberta-base)) needs to be downloaded and loaded into memory.

## Example Request

**POST** /analyze/emotions

```json
{
  "text": "I am so happy and excited today! But yesterday I was a bit sad and worried...\nLife is full of ups and downs, right? Sometimes I feel angry when things don't go my way.\nDo you understand how I feel? It's complicated, isn't it!"
}
```

**Response:**

```json
[
  {
    "sentence_pos": 0,
    "content": "I am so happy and excited today!",
    "emotion": "joy"
  },
  {
    "sentence_pos": 1,
    "content": "But yesterday I was a bit sad and worried...",
    "emotion": "sadness"
  },
  {
    "sentence_pos": 2,
    "content": "Life is full of ups and downs, right?",
    "emotion": "neutral"
  },
  {
    "sentence_pos": 3,
    "content": "Sometimes I feel angry when things don't go my way.",
    "emotion": "anger"
  },
  {
    "sentence_pos": 4,
    "content": "Do you understand how I feel?",
    "emotion": null
  },
  {
    "sentence_pos": 5,
    "content": "It's complicated, isn't it!",
    "emotion": null
  }
]
```

## Project Structure

```bash
Text2Emotions/backend
├── api/
│   ├── models.py    # Pydantic models (schemas) for request and response data
│   └── routes.py    # API route handlers (FastAPI endpoints)
├── input_examples/  # JSON files with example requests for testing
├── Dockerfile       # Docker configuration to build backend container
├── main.py          # FastAPI app instance and router registration
├── README.md        # Backend project documentation
└── requirements.txt # Python dependencies list
```

## Notes

- The model loads once at startup to optimize performance.
- The API returns `null` emotion if no emotion passes the confidence threshold.
- Sentence splitting is done using simple regex; results may vary depending on input formatting.
- **Important:** The emotion analysis model ([Emotion English DistilRoBERTa-base](https://huggingface.co/j-hartmann/emotion-english-distilroberta-base)) is trained exclusively on **English** text.
  Using texts in other languages may result in inaccurate or meaningless emotion predictions.
- For support with other languages, consider using language-specific models or translating text to English before analysis.
