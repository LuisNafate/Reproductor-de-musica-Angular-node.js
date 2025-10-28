import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { TrackListComponent } from '../../components/track-list/track-list.component';
import { PlayerComponent } from '../../components/player/player.component';
import { SpotifyService, SpotifyTrack } from '../../services/spotify.service';
import { MusicStateService } from '../../services/music-state.service';

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
export class MainViewComponent implements OnInit, OnDestroy {
  tracks: SpotifyTrack[] = [];
  selectedTrack: SpotifyTrack | null = null;
  errorMessage: string = '';
  
  private subscriptions = new Subscription();

  constructor(
    private spotifyService: SpotifyService,
    private musicState: MusicStateService,
    private router: Router
  ) {}

  // Inicializar y suscribirse al estado
  ngOnInit(): void {
    // Suscribirse a cambios en el estado
    this.subscriptions.add(
      this.musicState.selectedTrack$.subscribe(track => {
        this.selectedTrack = track;
      })
    );
    
    this.subscriptions.add(
      this.musicState.tracks$.subscribe(tracks => {
        this.tracks = tracks;
      })
    );
  }

  // Limpiar suscripciones
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // Buscar en Spotify y navegar a resultados
  onSearch(query: string): void {
    this.errorMessage = '';
    
    this.spotifyService.searchAll(query).subscribe({
      next: (response) => {
        // Navegar con datos en state (para SearchResults)
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

  // Cambiar cancion seleccionada y actualizar estado
  onTrackSelected(track: SpotifyTrack): void {
    this.musicState.setSelectedTrack(track);
  }
}
