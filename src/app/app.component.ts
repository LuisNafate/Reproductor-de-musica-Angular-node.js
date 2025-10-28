import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { TrackListComponent } from './components/track-list/track-list.component';
import { PlayerComponent } from './components/player/player.component';
import { SearchResultsComponent } from './components/search-results/search-results.component';
import { SpotifyService, SpotifyTrack, SpotifyArtist, SpotifyAlbum } from './services/spotify.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    SearchBarComponent,
    TrackListComponent,
    PlayerComponent,
    SearchResultsComponent
  ],
  template: `
    <!-- Vista de resultados de busqueda -->
    <div *ngIf="showSearchResults">
      <app-search-results
        [tracks]="searchTracks"
        [artists]="searchArtists"
        [albums]="searchAlbums"
        [searchQuery]="currentSearchQuery"
        (backToMain)="goBackToMain()"
        (trackSelected)="onTrackSelectedFromSearch($event)">
      </app-search-results>
    </div>

    <!-- Vista principal -->
    <div *ngIf="!showSearchResults" class="min-h-screen p-8">
      <app-search-bar (search)="onSearch($event)"></app-search-bar>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        <div class="lg:col-span-1">
          <app-track-list 
            [tracks]="tracks" 
            (trackSelected)="onTrackSelected($event)">
          </app-track-list>
        </div>

        <div class="lg:col-span-2 flex items-center justify-center">
          <app-player [currentTrack]="selectedTrack"></app-player>
        </div>
      </div>

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
  
  // Estado de vista de busqueda
  showSearchResults: boolean = false;
  searchTracks: SpotifyTrack[] = [];
  searchArtists: SpotifyArtist[] = [];
  searchAlbums: SpotifyAlbum[] = [];
  currentSearchQuery: string = '';

  constructor(private spotifyService: SpotifyService) {}

  // Buscar en Spotify y mostrar resultados
  onSearch(query: string): void {
    this.errorMessage = '';
    this.currentSearchQuery = query;
    
    this.spotifyService.searchAll(query).subscribe({
      next: (response) => {
        this.searchTracks = response.tracks.items;
        this.searchArtists = response.artists.items;
        this.searchAlbums = response.albums.items;
        this.showSearchResults = true;
      },
      error: (error) => {
        console.error('Error al buscar:', error);
        this.errorMessage = 'Error al conectar con Spotify. Verifica tu token de acceso.';
        setTimeout(() => this.errorMessage = '', 5000);
      }
    });
  }

  // Regresar a vista principal
  goBackToMain(): void {
    this.showSearchResults = false;
  }

  // Seleccionar cancion desde busqueda y volver a vista principal
  onTrackSelectedFromSearch(track: SpotifyTrack): void {
    this.selectedTrack = track;
    this.tracks = this.searchTracks;
    this.showSearchResults = false;
  }

  // Cambiar cancion seleccionada en vista principal
  onTrackSelected(track: SpotifyTrack): void {
    this.selectedTrack = track;
  }
}
