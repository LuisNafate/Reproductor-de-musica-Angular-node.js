import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpotifyTrack, SpotifyArtist, SpotifyAlbum } from '../../services/spotify.service';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.css'
})
export class SearchResultsComponent {
  @Input() tracks: SpotifyTrack[] = [];
  @Input() artists: SpotifyArtist[] = [];
  @Input() albums: SpotifyAlbum[] = [];
  @Input() searchQuery: string = '';
  
  @Output() backToMain = new EventEmitter<void>();
  @Output() trackSelected = new EventEmitter<SpotifyTrack>();

  activeTab: 'tracks' | 'artists' | 'albums' = 'tracks';
  
  // Lista de reproduccion fija (simulada)
  playQueue: any[] = [
    {
      name: 'Blinding Lights',
      artist: 'The Weeknd',
      image: 'https://i.scdn.co/image/ab67616d0000b273ef017e899c0547766997d874'
    },
    {
      name: 'Shape of You',
      artist: 'Ed Sheeran',
      image: 'https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96'
    },
    {
      name: 'Levitating',
      artist: 'Dua Lipa',
      image: 'https://i.scdn.co/image/ab67616d0000b273be841ba4bc24340152e3a79a'
    },
    {
      name: 'Starboy',
      artist: 'The Weeknd ft. Daft Punk',
      image: 'https://i.scdn.co/image/ab67616d0000b2734718e2b124f79258be7bc452'
    },
    {
      name: 'Save Your Tears',
      artist: 'The Weeknd',
      image: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36'
    }
  ];

  // Cambiar pestana activa
  setActiveTab(tab: 'tracks' | 'artists' | 'albums'): void {
    this.activeTab = tab;
  }

  // Regresar a vista principal
  goBack(): void {
    this.backToMain.emit();
  }

  // Seleccionar cancion
  selectTrack(track: SpotifyTrack): void {
    this.trackSelected.emit(track);
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
