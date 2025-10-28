import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainViewComponent } from './views/main-view/main-view.component';
import { SearchResultsComponent } from './components/search-results/search-results.component';
import { SpotifyService, SpotifyTrack, SpotifyArtist, SpotifyAlbum } from './services/spotify.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MainViewComponent,
    SearchResultsComponent
  ],
  template: `
    <!-- Vista principal siempre visible -->
    <app-main-view
      [tracks]="tracks"
      [selectedTrack]="selectedTrack"
      [errorMessage]="errorMessage"
      (search)="onSearch($event)"
      (trackSelected)="onTrackSelected($event)">
    </app-main-view>

    <!-- Overlay de resultados de busqueda -->
    <div *ngIf="showSearchResults" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
      <app-search-results
        [tracks]="searchTracks"
        [artists]="searchArtists"
        [albums]="searchAlbums"
        [searchQuery]="currentSearchQuery"
        (backToMain)="closeSearchResults()"
        (trackSelected)="onTrackSelectedFromSearch($event)">
      </app-search-results>
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

  // Cerrar resultados de busqueda
  closeSearchResults(): void {
    this.showSearchResults = false;
  }

  // Seleccionar cancion desde busqueda
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
