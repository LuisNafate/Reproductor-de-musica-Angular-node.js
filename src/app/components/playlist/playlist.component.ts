import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpotifyService, SpotifyTrack } from '../../services/spotify.service';
import { MusicStateService } from '../../services/music-state.service';

@Component({
  selector: 'app-playlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './playlist.component.html',
  styleUrl: './playlist.component.css'
})
export class PlaylistComponent implements OnInit {
  playlistTracks: SpotifyTrack[] = [];
  isLoading: boolean = true;

  constructor(
    private spotifyService: SpotifyService,
    private musicState: MusicStateService
  ) {}

  ngOnInit(): void {
    // Buscar canciones populares para la playlist inicial
    this.loadPlaylist();
  }

  // Cargar playlist desde Spotify
  loadPlaylist(): void {
    this.isLoading = true;
    
    // Buscar un mix de artistas populares
    this.spotifyService.searchTracks('LE SSERAFIM Enjambre').subscribe({
      next: (response) => {
        this.playlistTracks = response.tracks.items.slice(0, 10);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando playlist:', error);
        this.isLoading = false;
      }
    });
  }

  // Seleccionar cancion de la playlist
  selectTrack(track: SpotifyTrack): void {
    this.musicState.setSelectedTrack(track);
  }

  // Obtener imagen de cancion
  getTrackImage(track: SpotifyTrack): string {
    if (!track.album.images || track.album.images.length === 0) {
      return 'https://via.placeholder.com/64x64/1e3d59/ffffff?text=No+Image';
    }
    return track.album.images[2]?.url || track.album.images[0]?.url;
  }

  // Obtener artistas de cancion
  getTrackArtists(track: SpotifyTrack): string {
    return track.artists.map(artist => artist.name).join(', ');
  }
}
