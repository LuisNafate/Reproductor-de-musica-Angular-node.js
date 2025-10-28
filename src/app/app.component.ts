import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { PlaylistComponent } from './components/playlist/playlist.component';
import { SpotifyService, SpotifyTrack, SpotifyArtist, SpotifyAlbum } from './services/spotify.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SearchBarComponent,
    PlaylistComponent
  ],
  template: `
    <div class="min-h-screen p-8">
      <!-- Barra de busqueda fija -->
      <div class="max-w-7xl mx-auto mb-8">
        <app-search-bar (search)="onSearch($event)"></app-search-bar>
      </div>

      <!-- Layout principal: Playlist + Contenido -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        <!-- Playlist fija (lateral izquierdo) -->
        <div class="lg:col-span-1">
          <app-playlist></app-playlist>
        </div>

        <!-- Contenido dinamico (router-outlet) -->
        <div class="lg:col-span-2">
          <router-outlet></router-outlet>
        </div>
      </div>

      <!-- Mensaje de error -->
      <div *ngIf="errorMessage" class="fixed bottom-4 right-4 bg-red-500/90 text-white px-6 py-3 rounded-lg shadow-lg">
        {{ errorMessage }}
      </div>
    </div>
  `,
  styles: []
})
export class AppComponent {
  errorMessage: string = '';

  constructor(
    private spotifyService: SpotifyService,
    private router: Router
  ) {}

  // Buscar en Spotify y navegar a resultados
  onSearch(query: string): void {
    this.errorMessage = '';
    
    this.spotifyService.searchAll(query).subscribe({
      next: (response) => {
        this.router.navigate(['/search'], {
          state: {
            tracks: response.tracks.items,
            artists: response.artists.items,
            albums: response.albums.items,
            query: query
          }
        });
      },
      error: (error) => {
        console.error('Error al buscar:', error);
        this.errorMessage = 'Error al conectar con Spotify. Verifica tu token de acceso.';
        setTimeout(() => this.errorMessage = '', 5000);
      }
    });
  }
}
