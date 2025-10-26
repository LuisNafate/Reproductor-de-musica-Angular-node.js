import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';

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

export interface SpotifySearchResponse {
  tracks: {
    items: SpotifyTrack[];
  };
}

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
  
  // CONFIGURA TUS CREDENCIALES AQUÍ:
  // 1. Ve a: https://developer.spotify.com/dashboard
  // 2. Crea una app (si no tienes una)
  // 3. Ve a Settings y copia el Client ID y Client Secret
  private readonly clientId = '3fa5ab45fb6b48fa9e717375780ebdf5'; // Reemplaza con tu Client ID
  private readonly clientSecret = '1f136f6871d14e8ba8f9715b22344ec6'; // Reemplaza con tu Client Secret
  
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor(private http: HttpClient) { }

  private getAccessToken(): Observable<string> {
    // Si ya tenemos un token válido, lo retornamos
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return of(this.accessToken);
    }

    // Si no, obtenemos uno nuevo
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(`${this.clientId}:${this.clientSecret}`)
    });

    const body = 'grant_type=client_credentials';

    return this.http.post<SpotifyTokenResponse>(this.tokenUrl, body, { headers }).pipe(
      map(response => {
        this.accessToken = response.access_token;
        // Guardamos el tiempo de expiración (menos 5 minutos de margen)
        this.tokenExpiry = Date.now() + ((response.expires_in - 300) * 1000);
        return this.accessToken;
      }),
      catchError(error => {
        console.error('Error obteniendo token de Spotify:', error);
        return throwError(() => new Error('No se pudo obtener el token de acceso de Spotify. Verifica tus credenciales.'));
      })
    );
  }

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
