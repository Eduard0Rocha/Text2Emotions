import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})

export class AppComponent {
  // Title shown in the UI
  title = 'Text2Emotions';
  // User input text bound to the textarea
  prompt = '';
  // API results
  emotionResults: any[] = [];
  // Processed HTML text with highlights
  highlightedText = '';

  /**
   * Injects the HttpClient service to perform HTTP requests.
   * @param http Angular HttpClient for making API calls.
   */
  constructor(private http: HttpClient) {}

  /**
   * Sends the user's input text to the emotion analysis API and processes the response to update the UI with highlighted emotions.
   */
  submitPrompt() {
    const url = 'http://localhost:8000/analyze/emotions'; // API endpoint
    const body = { text: this.prompt };                   // Request payload

    this.http.post<any[]>(url, body).subscribe({
      next: (response) => {
        // Store response
        this.emotionResults = response;
        // Update highlighted text
        this.highlightedText = this.buildHighlightedText(this.prompt, response);
      },
      error: (error) => console.error('Error:', error) // Log errors if any
    });
  }

  /**
   * Builds HTML string with emotion-based highlights for matching text segments.
   *
   * @param originalText The original input text to be processed and highlighted.
   * @param emotions Array of emotion objects containing text segments and their corresponding emotions.
   * @returns A string of HTML with matched text wrapped in styled <span> elements reflecting emotions.
   */
  buildHighlightedText(originalText: string, emotions: any[]): string {
    let highlighted = originalText;
    for (const item of emotions) {
      // Skip if no content to highlight
      if (!item.content) continue;
      // Escape special regex characters in the content string
      const escaped = this.escapeRegex(item.content);
      // Create a global regex to find all occurrences of the content
      const regex = new RegExp(escaped, 'g');
      // Get the CSS class based on the detected emotion
      const cssClass = this.getEmotionClass(item.emotion);
      // Replace all occurrences with a <span> that applies styling for the emotion
      highlighted = highlighted.replace(
        regex,
        `<span class="rounded px-1 ${cssClass}">${item.content}</span>`
      );
    }
    // Replace newlines with <br> tags to maintain line breaks in HTML output
    return highlighted.replace(/\n/g, '<br>');
  }

  /**
   * Escapes special characters in a string so it can be safely used in a regular expression.
   *
   * @param text The input string that may contain special regex characters.
   * @returns A new string with all regex special characters escaped.
   */
  escapeRegex(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Maps an emotion string to a corresponding CSS class for styling.
   *
   * @param emotion The emotion label as a string (e.g., 'joy', 'sadness', etc.), or null.
   * @returns A string with CSS classes for the emotion's background and text color.
   */
  getEmotionClass(emotion: string | null): string {
    switch (emotion) {
      case 'joy':
        return 'bg-pastel-yellow text-dark'; // Soft pastel yellow background with dark text
      case 'sadness':
        return 'bg-pastel-blue text-dark';   // Light pastel blue background with dark text
      case 'anger':
        return 'bg-pastel-coral text-dark';  // Pastel coral background with dark text
      case 'fear':
        return 'bg-pastel-purple text-dark'; // Soft pastel purple background with dark text
      case 'disgust':
        return 'bg-pastel-green text-dark';  // Pastel mint green background with dark text
      case 'surprise':
        return 'bg-pastel-peach text-dark';  // Soft pastel peach background with dark text
      case null:
      default:
        return '';                           // No styling (empty string) for unknown or null emotions
    }
  }
}
