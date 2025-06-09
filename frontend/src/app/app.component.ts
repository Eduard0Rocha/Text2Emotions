import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
  imports: [FormsModule]
})

export class AppComponent {
  // Title shown in the UI
  title = 'Text2Emotions';
  // User input text bound to the textarea
  prompt = '';

  /**
   * Injects the HttpClient service to perform HTTP requests.
   * @param http Angular HttpClient for making API calls
   */
  constructor(private http: HttpClient) {}

  // TODO: Documentation and comments
  submitPrompt() {
    const url = 'http://localhost:8000/analyze/emotions'; // API endpoint URL
    const body = { text: this.prompt };                   // Request payload

    this.http.post(url, body).subscribe({
      next: (response) => console.log('Success:', response), // TODO: handle that
      error: (error) => console.error('Error:', error), // TODO: hanlde that
    });
  }
}
