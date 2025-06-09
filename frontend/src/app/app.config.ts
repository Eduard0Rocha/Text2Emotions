import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

// Application-wide configuration for providers
export const appConfig: ApplicationConfig = {
  providers: [
    // Improves change detection performance by coalescing events
    provideZoneChangeDetection({ eventCoalescing: true }),
    // Registers HttpClient service for making HTTP requests
    [provideHttpClient()]
  ]
};
