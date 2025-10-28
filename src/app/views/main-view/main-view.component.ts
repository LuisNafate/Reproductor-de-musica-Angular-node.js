import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { PlayerComponent } from '../../components/player/player.component';
import { SpotifyService, SpotifyTrack } from '../../services/spotify.service';
import { MusicStateService } from '../../services/music-state.service';

@Component({
  selector: 'app-main-view',
  standalone: true,
  imports: [
    CommonModule,
    SearchBarComponent,
    PlayerComponent
  ],
  templateUrl: './main-view.component.html',
  styleUrl: './main-view.component.css'
})
export class MainViewComponent implements OnInit, OnDestroy {
  selectedTrack: SpotifyTrack | null = null;
  errorMessage: string = '';
  
  // Lista de reproduccion fija (simulada)
  playQueue: any[] = [
    {
      name: 'ANTIFRAGILE',
      artist: 'LE SSERAFIM',
      image: 'https://i.scdn.co/image/ab67616d00001e023369310bc92d472415369ed6'
    },
    {
      name: 'Impacto',
      artist: 'Enjambre',
      image: 'https://i.scdn.co/image/ab67616d00001e0266f128e383614b0aa4df5ebd'
    },
    {
      name: 'UNFORGIVEN',
      artist: 'LE SSERAFIM',
      image: 'https://i.scdn.co/image/ab67616d00001e02971bef5fdb2db3fa3e6e3870'
    },
    {
      name: 'Vida En El Espejo',
      artist: 'Enjambre',
      image: 'https://i.scdn.co/image/ab67616d00001e0208b5853acded25e1b5ff5115'
    },
    {
      name: 'FEARLESS',
      artist: 'LE SSERAFIM',
      image: 'https://i.scdn.co/image/ab67616d00001e02971bef5fdb2db3fa3e6e3870'
    }
  ];
  
  private subscriptions = new Subscription();

  constructor(
    private spotifyService: SpotifyService,
    private musicState: MusicStateService,
    private router: Router
  ) {}

  // Inicializar y suscribirse al estado
  ngOnInit(): void {
    // Suscribirse solo a la cancion seleccionada
    this.subscriptions.add(
      this.musicState.selectedTrack$.subscribe(track => {
        this.selectedTrack = track;
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

  // Seleccionar cancion de la lista de reproduccion fija
  selectFromPlayQueue(queueItem: any): void {
    // Convertir item de playQueue a formato SpotifyTrack
    const track: any = {
      id: queueItem.name.toLowerCase().replace(/\s+/g, '-'),
      name: queueItem.name,
      artists: [{ name: queueItem.artist }],
      album: {
        name: queueItem.name,
        images: [{ url: queueItem.image }]
      },
      preview_url: null
    };
    this.musicState.setSelectedTrack(track);
  }
}
