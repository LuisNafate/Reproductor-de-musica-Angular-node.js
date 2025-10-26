import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpotifyTrack } from '../../services/spotify.service';

@Component({
  selector: 'app-track-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white/5 backdrop-blur-sm rounded-3xl p-6 h-[calc(100vh-200px)] overflow-y-auto shadow-2xl">
      <h2 class="text-xl font-semibold mb-4 text-white/90">Fila de reproduccion</h2>
      
      <div *ngIf="tracks.length === 0" class="text-center text-white/40 mt-20">
        <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
        </svg>
        <p>Busca canciones para comenzar</p>
      </div>

      <div *ngFor="let track of tracks" 
           (click)="onTrackSelect(track)"
           class="flex items-center p-3 mb-2 rounded-xl hover:bg-white/10 cursor-pointer transition-all duration-200 group">
        <img 
          [src]="getTrackImage(track)" 
          [alt]="track.name"
          class="w-12 h-12 rounded-lg mr-4 shadow-md"
        />
        <div class="flex-1 overflow-hidden">
          <p class="text-white font-medium truncate group-hover:text-white/90">{{ track.name }}</p>
          <p class="text-white/60 text-sm truncate">{{ getArtists(track) }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    ::-webkit-scrollbar {
      width: 8px;
    }
    
    ::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 10px;
    }
    
    ::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 10px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  `]
})
export class TrackListComponent {
  @Input() tracks: SpotifyTrack[] = [];
  @Output() trackSelected = new EventEmitter<SpotifyTrack>();

  onTrackSelect(track: SpotifyTrack): void {
    this.trackSelected.emit(track);
  }

  getTrackImage(track: SpotifyTrack): string {
    if (!track.album.images || track.album.images.length === 0) {
      return 'https://via.placeholder.com/48x48/1e3d59/ffffff?text=No+Image';
    }
    return track.album.images[2]?.url || track.album.images[0]?.url || 'https://via.placeholder.com/48x48/1e3d59/ffffff?text=No+Image';
  }

  getArtists(track: SpotifyTrack): string {
    return track.artists.map(artist => artist.name).join(', ');
  }
}
