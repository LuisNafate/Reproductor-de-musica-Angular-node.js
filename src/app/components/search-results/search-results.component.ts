import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SpotifyTrack, SpotifyArtist, SpotifyAlbum } from '../../services/spotify.service';
import { MusicStateService } from '../../services/music-state.service';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.css'
})
export class SearchResultsComponent implements OnInit {
  tracks: SpotifyTrack[] = [];
  artists: SpotifyArtist[] = [];
  albums: SpotifyAlbum[] = [];
  searchQuery: string = '';

  activeTab: 'tracks' | 'artists' | 'albums' = 'tracks';
  
  constructor(
    private router: Router,
    private musicState: MusicStateService
  ) {}

  // Inicializar con datos del navigation state
  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state || history.state;
    
    if (state) {
      this.tracks = state['tracks'] || [];
      this.artists = state['artists'] || [];
      this.albums = state['albums'] || [];
      this.searchQuery = state['query'] || '';
    }
  }

  // Cambiar pestana activa
  setActiveTab(tab: 'tracks' | 'artists' | 'albums'): void {
    this.activeTab = tab;
  }

  // Regresar a vista principal
  goBack(): void {
    this.router.navigate(['/']);
  }

  // Seleccionar cancion, actualizar estado y volver
  selectTrack(track: SpotifyTrack): void {
    this.musicState.setSelectedTrack(track);
    this.musicState.setTracks(this.tracks);
    this.router.navigate(['/']);
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

  // Obtener imagen de artista
  getArtistImage(artist: SpotifyArtist): string {
    if (!artist.images || artist.images.length === 0) {
      return 'https://via.placeholder.com/160x160/1e3d59/ffffff?text=No+Image';
    }
    return artist.images[0]?.url;
  }

  // Obtener imagen de album
  getAlbumImage(album: SpotifyAlbum): string {
    if (!album.images || album.images.length === 0) {
      return 'https://via.placeholder.com/160x160/1e3d59/ffffff?text=No+Image';
    }
    return album.images[1]?.url || album.images[0]?.url;
  }

  // Obtener artistas de album
  getAlbumArtists(album: SpotifyAlbum): string {
    return album.artists.map(artist => artist.name).join(', ');
  }

  // Formatear numero de seguidores
  formatFollowers(followers: number): string {
    if (followers >= 1000000) {
      return (followers / 1000000).toFixed(1) + 'M';
    } else if (followers >= 1000) {
      return (followers / 1000).toFixed(1) + 'K';
    }
    return followers.toString();
  }
}
