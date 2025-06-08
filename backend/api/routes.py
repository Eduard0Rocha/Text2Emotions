import re
from fastapi import APIRouter, HTTPException
from transformers import pipeline
from typing import Optional, List
from api.models import TextInput, EmotionResult

# Load the emotion classification model once at startup for better performance
emotion_classifier = pipeline(
    'text-classification',
    model='j-hartmann/emotion-english-distilroberta-base',
    # top_k=1 is the default behavior (returns only the best prediction)
)

# Warm-up (optional but useful to avoid latency on first request)
_ = emotion_classifier('This is a test.')

def analyze_emotion_in_sentence(sentence: str) -> Optional[str]:
    """
    Analyze the dominant emotion in a single sentence.
    
    Args:
        sentence (str): The sentence to analyze.
    
    Returns:
        Optional[str]: The emotion label with score >= 0.7 (confidence threshold).
                       Returns None if no emotion passes the threshold.
    
    Note:
        The confidence threshold (0.7) can be adjusted depending on desired sensitivity.
    """
    emotion_classification = emotion_classifier(sentence)
    emotion = emotion_classification[0]
    return emotion['label'] if emotion['score'] >= 0.7 else None

def analyze_emotions(text: str) -> List[EmotionResult]:
    """
    Analyze emotions sentence-by-sentence in the input text.
    
    Args:
        text (str): The full text to analyze.
    
    Returns:
        List[EmotionResult]: List of emotion analysis results, one per sentence.
    """
    results = []
    # Split text into sentences using punctuation delimiters
    sentences = re.split(r'(?<=[.!?…])\s+', text.strip())

    for i, sentence in enumerate(sentences):
        if sentence.strip():
            emotion = analyze_emotion_in_sentence(sentence)
            results.append({
                'sentence_pos': i,
                'content': sentence,
                'emotion': emotion
            })

    return results

# Define router
router = APIRouter()

# API route
@router.post(
    '/analyze/emotions',
    summary="Analyze dominant emotions in text",
    response_description="List of sentences with their dominant emotions",
    response_model=List[EmotionResult],
    responses={
        200: {
            "content": {
                "application/json": {
                    "example": [
                        {
                            "sentence_pos": 0,
                            "content": "I am so happy and excited today!",
                            "emotion": "joy"
                        },
                        {
                            "sentence_pos": 1,
                            "content": "But yesterday I was a bit sad and worried...",
                            "emotion": "sadness"
                        }
                    ]
                }
            }
        }
    }
)
def analyze_emotions_route(input: TextInput):
    if not input.text.strip():
        raise HTTPException(status_code=400, detail='Text input is empty.')
    return analyze_emotions(input.text)