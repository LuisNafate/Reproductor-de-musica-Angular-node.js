import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';

// Track interface from Spotify API
export interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string }[];
  };
  preview_url: string | null;
}

// Search response structure
export interface SpotifySearchResponse {
  tracks: {
    items: SpotifyTrack[];
  };
}

// OAuth token response
interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  private readonly apiUrl = 'https://api.spotify.com/v1';
  private readonly tokenUrl = 'https://accounts.spotify.com/api/token';
  
  // Client credentials for OAuth 2.0
  private readonly clientId = '3fa5ab45fb6b48fa9e717375780ebdf5';
  private readonly clientSecret = '1f136f6871d14e8ba8f9715b22344ec6';
  
  // Token cache
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor(private http: HttpClient) { }

  // Get or refresh access token
  private getAccessToken(): Observable<string> {
    // Return cached token if still valid
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return of(this.accessToken);
    }

    // Request new token using Client Credentials flow
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(`${this.clientId}:${this.clientSecret}`)
    });

    const body = 'grant_type=client_credentials';

    return this.http.post<SpotifyTokenResponse>(this.tokenUrl, body, { headers }).pipe(
      map(response => {
        this.accessToken = response.access_token;
        // Set expiry 5 minutes before actual expiration
        this.tokenExpiry = Date.now() + ((response.expires_in - 300) * 1000);
        return this.accessToken;
      }),
      catchError(error => {
        console.error('Error obteniendo token de Spotify:', error);
        return throwError(() => new Error('No se pudo obtener el token de acceso de Spotify. Verifica tus credenciales.'));
      })
    );
  }

  // Search tracks by query string
  searchTracks(query: string): Observable<SpotifySearchResponse> {
    return this.getAccessToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.get<SpotifySearchResponse>(
          `${this.apiUrl}/search?q=${encodeURIComponent(query)}&type=track&limit=20`,
          { headers }
        );
      }),
      catchError(error => {
        console.error('Error buscando canciones:', error);
        return throwError(() => error);
      })
    );
  }
}
