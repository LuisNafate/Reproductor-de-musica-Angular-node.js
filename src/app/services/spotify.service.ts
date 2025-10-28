import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';

// Interfaz de cancion de Spotify
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

// Interfaz de artista
export interface SpotifyArtist {
  id: string;
  name: string;
  images: { url: string }[];
  followers: { total: number };
  genres: string[];
}

// Interfaz de album
export interface SpotifyAlbum {
  id: string;
  name: string;
  artists: { name: string }[];
  images: { url: string }[];
  release_date: string;
  total_tracks: number;
}

// Estructura de respuesta de busqueda
export interface SpotifySearchResponse {
  tracks: {
    items: SpotifyTrack[];
  };
}

// Respuesta de busqueda completa
export interface SpotifyFullSearchResponse {
  tracks: {
    items: SpotifyTrack[];
  };
  artists: {
    items: SpotifyArtist[];
  };
  albums: {
    items: SpotifyAlbum[];
  };
}

// Respuesta del token OAuth
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
  
  // Credenciales del cliente para OAuth 2.0
  private readonly clientId = '3fa5ab45fb6b48fa9e717375780ebdf5';
  private readonly clientSecret = '1f136f6871d14e8ba8f9715b22344ec6';
  
  // Cache del token
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor(private http: HttpClient) { }

  // Obtener o renovar el token de acceso
  private getAccessToken(): Observable<string> {
    // Retornar token en cache si aun es valido
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return of(this.accessToken);
    }

    // Solicitar nuevo token usando Client Credentials
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(`${this.clientId}:${this.clientSecret}`)
    });

    const body = 'grant_type=client_credentials';

    return this.http.post<SpotifyTokenResponse>(this.tokenUrl, body, { headers }).pipe(
      map(response => {
        this.accessToken = response.access_token;
        // Establecer expiracion 5 minutos antes de la expiracion real
        this.tokenExpiry = Date.now() + ((response.expires_in - 300) * 1000);
        return this.accessToken;
      }),
      catchError(error => {
        console.error('Error obteniendo token de Spotify:', error);
        return throwError(() => new Error('No se pudo obtener el token de acceso de Spotify. Verifica tus credenciales.'));
      })
    );
  }

  // Buscar canciones por texto
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

  // Buscar todo: canciones, artistas y albums
  searchAll(query: string): Observable<SpotifyFullSearchResponse> {
    return this.getAccessToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.get<SpotifyFullSearchResponse>(
          `${this.apiUrl}/search?q=${encodeURIComponent(query)}&type=track,artist,album&limit=20`,
          { headers }
        );
      }),
      catchError(error => {
        console.error('Error buscando:', error);
        return throwError(() => error);
      })
    );
  }
}
