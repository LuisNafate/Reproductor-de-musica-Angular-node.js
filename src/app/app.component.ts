import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { TrackListComponent } from './components/track-list/track-list.component';
import { PlayerComponent } from './components/player/player.component';
import { SpotifyService, SpotifyTrack } from './services/spotify.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    SearchBarComponent,
    TrackListComponent,
    PlayerComponent
  ],
  template: `
    <div class="min-h-screen p-8">
      <!-- Barra de búsqueda superior -->
      <app-search-bar (search)="onSearch($event)"></app-search-bar>

      <!-- Contenedor principal con diseño en grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        <!-- Panel izquierdo: Lista de canciones -->
        <div class="lg:col-span-1">
          <app-track-list 
            [tracks]="tracks" 
            (trackSelected)="onTrackSelected($event)">
          </app-track-list>
        </div>

        <!-- Panel central: Reproductor principal -->
        <div class="lg:col-span-2 flex items-center justify-center">
          <app-player [currentTrack]="selectedTrack"></app-player>
        </div>
      </div>

      <!-- Mensaje de error si hay problemas con la API -->
      <div *ngIf="errorMessage" class="fixed bottom-4 right-4 bg-red-500/90 text-white px-6 py-3 rounded-lg shadow-lg">
        {{ errorMessage }}
      </div>
    </div>
  `,
  styles: []
})
export class AppComponent {
  tracks: SpotifyTrack[] = [];
  selectedTrack: SpotifyTrack | null = null;
  errorMessage: string = '';

  constructor(private spotifyService: SpotifyService) {}

  onSearch(query: string): void {
    this.errorMessage = '';
    this.spotifyService.searchTracks(query).subscribe({
      next: (response) => {
        this.tracks = response.tracks.items;
        if (this.tracks.length > 0 && !this.selectedTrack) {
          this.selectedTrack = this.tracks[0];
        }
      },
      error: (error) => {
        console.error('Error al buscar canciones:', error);
        this.errorMessage = 'Error al conectar con Spotify. Verifica tu token de acceso.';
        setTimeout(() => this.errorMessage = '', 5000);
      }
    });
  }

  onTrackSelected(track: SpotifyTrack): void {
    this.selectedTrack = track;
  }
}
