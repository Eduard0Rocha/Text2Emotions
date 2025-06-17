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
  // Loading spinner visibility
  isLoading = false;
  // List of emotion names
  emotionNames: string[] = [
    'joy',
    'sadness',
    'anger',
    'fear',
    'disgust',
    'surprise'
  ];

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

    // Show loading spinner
    this.isLoading = true;

    this.http.post<any[]>(url, body).subscribe({
      next: (response) => {
        // Store response
        this.emotionResults = response;
        // Update highlighted text
        this.highlightedText = this.buildHighlightedText(this.prompt, response);
        // Hide spinner after success
        this.isLoading = false;
      },
      error: (error) => {
        // Log errors if any
        console.error('Error:', error)
        // Hide spinner on error
        this.isLoading = false;
      }
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
      // Skip if no content to highlight OR if the emotion is not recognized in the predefined list
      if (!item.content ||
          !this.emotionNames.includes(item.emotion)) continue;
      // Escape special regex characters in the content string
      const escaped = this.escapeRegex(item.content);
      // Create a global regex to find all occurrences of the content
      const regex = new RegExp(escaped, 'g');
      // Replace the matched text with a styled <span> using the emotion color
      highlighted = highlighted.replace(
        regex,
        `<span class="rounded px-1 text-dark bg-${item.emotion}" title="${item.emotion}">${item.content}</span>`
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
}
