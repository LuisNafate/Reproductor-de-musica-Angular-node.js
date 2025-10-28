import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { TrackListComponent } from '../../components/track-list/track-list.component';
import { PlayerComponent } from '../../components/player/player.component';
import { SpotifyService, SpotifyTrack } from '../../services/spotify.service';

@Component({
  selector: 'app-main-view',
  standalone: true,
  imports: [
    CommonModule,
    SearchBarComponent,
    TrackListComponent,
    PlayerComponent
  ],
  templateUrl: './main-view.component.html',
  styleUrl: './main-view.component.css'
})
export class MainViewComponent implements OnInit {
  tracks: SpotifyTrack[] = [];
  selectedTrack: SpotifyTrack | null = null;
  errorMessage: string = '';

  constructor(
    private spotifyService: SpotifyService,
    private router: Router
  ) {}

  // Inicializar componente y verificar si viene de search-results
  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state || history.state;
    
    if (state && state['selectedTrack']) {
      this.selectedTrack = state['selectedTrack'];
      this.tracks = state['tracks'] || [];
    }
  }

  // Buscar en Spotify y navegar a resultados
  onSearch(query: string): void {
    this.errorMessage = '';
    
    this.spotifyService.searchAll(query).subscribe({
      next: (response) => {
        // Navegar a la ruta de busqueda con query params
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

  // Cambiar cancion seleccionada
  onTrackSelected(track: SpotifyTrack): void {
    this.selectedTrack = track;
  }
}
