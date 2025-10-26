import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpotifyTrack } from '../../services/spotify.service';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center">
      <div class="mb-8">
        <div class="relative">
          <img 
            [src]="getAlbumImage()" 
            [alt]="currentTrack?.name || 'No track selected'"
            class="w-80 h-80 rounded-2xl shadow-2xl border-4 border-white/10"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-dark-blue/50 to-transparent rounded-2xl"></div>
        </div>
      </div>

      <div class="text-center mb-6">
        <h1 class="text-3xl font-bold mb-2">{{ currentTrack?.name || 'La diferencia' }}</h1>
        <p class="text-xl text-white/70">{{ getArtists() }}</p>
      </div>

      <div class="w-full max-w-2xl mb-6 px-4">
        <div class="flex items-center gap-4">
          <span class="text-sm text-white/60 font-medium min-w-[40px]">{{ currentTime }}</span>
          
          <div class="flex-1 group cursor-pointer" (click)="seekTo($event)">
            <div class="relative h-2 bg-white/20 rounded-full overflow-hidden hover:h-3 transition-all">
              <div 
                class="absolute h-full bg-gradient-to-r from-white to-white/90 rounded-full transition-all"
                [style.width.%]="progress">
              </div>
              <div 
                class="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                [style.left.%]="progress"
                [style.transform]="'translate(-50%, -50%)'">
              </div>
            </div>
          </div>
          
          <span class="text-sm text-white/60 font-medium min-w-[40px]">{{ duration }}</span>
        </div>
      </div>

      <div class="flex items-center gap-6 mb-4">
        <button class="text-white/70 hover:text-white transition-colors">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17 17H7V14L3 18L7 22V19H17V22L21 18L17 14V17Z"/>
          </svg>
        </button>

        <button class="text-white/70 hover:text-white transition-colors">
          <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
          </svg>
        </button>

        <button class="bg-white text-dark-blue rounded-full p-4 hover:scale-110 transition-transform shadow-lg">
          <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </button>

        <button class="text-white/70 hover:text-white transition-colors">
          <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
          </svg>
        </button>

        <button class="text-white/70 hover:text-white transition-colors">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
          </svg>
        </button>
      </div>

      <div class="flex items-center gap-3 mt-4">
        <svg class="w-5 h-5 text-white/70" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
        </svg>
        <div class="w-32 h-1 bg-white/20 rounded-full overflow-hidden">
          <div class="h-full bg-white w-3/4"></div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class PlayerComponent {
  @Input() currentTrack: SpotifyTrack | null = null;
  
  currentTime: string = '0:00';
  duration: string = '3:45';
  progress: number = 35;

  getAlbumImage(): string {
    if (!this.currentTrack || !this.currentTrack.album.images || this.currentTrack.album.images.length === 0) {
      return 'https://via.placeholder.com/400x400/1e3d59/ffffff?text=No+Track';
    }
    return this.currentTrack.album.images[0].url;
  }

  getArtists(): string {
    if (!this.currentTrack) {
      return 'Enjambre';
    }
    return this.currentTrack.artists.map(artist => artist.name).join(', ');
  }

  seekTo(event: MouseEvent): void {
    const element = event.currentTarget as HTMLElement;
    const rect = element.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = (clickX / rect.width) * 100;
    this.progress = Math.max(0, Math.min(100, percentage));
    
    const totalSeconds = 225;
    const currentSeconds = Math.floor((totalSeconds * this.progress) / 100);
    const minutes = Math.floor(currentSeconds / 60);
    const seconds = currentSeconds % 60;
    this.currentTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}
