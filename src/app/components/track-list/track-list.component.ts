import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpotifyTrack } from '../../services/spotify.service';

@Component({
  selector: 'app-track-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './track-list.component.html',
  styleUrl: './track-list.component.css'
})
export class TrackListComponent {
  @Input() tracks: SpotifyTrack[] = [];
  @Output() trackSelected = new EventEmitter<SpotifyTrack>();

  // Emitir evento cuando se selecciona una cancion
  onTrackSelect(track: SpotifyTrack): void {
    this.trackSelected.emit(track);
  }

  // Obtener imagen de la cancion o placeholder
  getTrackImage(track: SpotifyTrack): string {
    if (!track.album.images || track.album.images.length === 0) {
      return 'https://via.placeholder.com/48x48/1e3d59/ffffff?text=No+Image';
    }
    return track.album.images[2]?.url || track.album.images[0]?.url || 'https://via.placeholder.com/48x48/1e3d59/ffffff?text=No+Image';
  }

  // Formatear lista de artistas
  getArtists(track: SpotifyTrack): string {
    return track.artists.map(artist => artist.name).join(', ');
  }
}
