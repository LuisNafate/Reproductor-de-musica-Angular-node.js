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
  
  // Lista de reproduccion simulada
  playQueue: SpotifyTrack[] = [];

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

  // Agregar cancion a la fila
  addToQueue(track: SpotifyTrack, event: Event): void {
    event.stopPropagation();
    if (!this.playQueue.find(t => t.id === track.id)) {
      this.playQueue.push(track);
    }
  }

  // Remover cancion de la fila
  removeFromQueue(track: SpotifyTrack, event: Event): void {
    event.stopPropagation();
    this.playQueue = this.playQueue.filter(t => t.id !== track.id);
  }

  // Verificar si esta en la fila
  isInQueue(track: SpotifyTrack): boolean {
    return this.playQueue.some(t => t.id === track.id);
  }

  // Limpiar fila
  clearQueue(): void {
    this.playQueue = [];
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
