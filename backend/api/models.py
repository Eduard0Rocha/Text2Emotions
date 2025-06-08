from pydantic import BaseModel, Field
from typing import Optional

# Schema for the input payload containing the text to be analyzed
class TextInput(BaseModel):
    text: str = Field(
        ...,
        example=(
            "I am so happy and excited today! But yesterday I was a bit sad and worried...\n"
            "Life is full of ups and downs, right? Sometimes I feel angry when things don't go my way.\n"
            "Do you understand how I feel? It's complicated, isn't it!"
        ),
        description=(
            "Input text for emotion analysis. "
            "Can contain multiple sentences; the API returns the dominant emotion for each."
        )
    )

# Represents the emotion analysis result for a single sentence in the text
class EmotionResult(BaseModel):
    sentence_pos: int = Field(
        ...,
        description="Position of the sentence in the text, zero-indexed",
        example=0
    )
    content: str = Field(
        ...,
        description="The text content of the sentence",
        example="I am so happy and excited today!"
    )
    emotion: Optional[str] = Field(
        None,
        description="Dominant emotion detected for the sentence; None if no emotion is detected",
        example="joy"
    )