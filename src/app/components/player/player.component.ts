import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpotifyTrack } from '../../services/spotify.service';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player.component.html',
  styleUrl: './player.component.css'
})
export class PlayerComponent {
  @Input() currentTrack: SpotifyTrack | null = null;
  
  currentTime: string = '0:00';
  duration: string = '0:30';
  progress: number = 0;
  isPlaying: boolean = false;
  
  private progressInterval: any;

  // Alternar entre play y pause
  togglePlay(): void {
    this.isPlaying = !this.isPlaying;
    
    if (this.isPlaying) {
      this.startProgress();
    } else {
      this.stopProgress();
    }
  }

  // Iniciar simulacion de progreso
  startProgress(): void {
    const totalDuration = 30;
    let currentSeconds = this.parseTime(this.currentTime);
    
    this.progressInterval = setInterval(() => {
      currentSeconds++;
      
      if (currentSeconds >= totalDuration) {
        currentSeconds = 0;
        this.isPlaying = false;
        this.stopProgress();
      }
      
      this.progress = (currentSeconds / totalDuration) * 100;
      
      const minutes = Math.floor(currentSeconds / 60);
      const seconds = currentSeconds % 60;
      this.currentTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
  }

  // Detener simulacion de progreso
  stopProgress(): void {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  // Convertir formato de tiempo a segundos
  parseTime(time: string): number {
    const [minutes, seconds] = time.split(':').map(Number);
    return minutes * 60 + seconds;
  }

  // Obtener imagen del album o placeholder
  getAlbumImage(): string {
    if (!this.currentTrack || !this.currentTrack.album.images || this.currentTrack.album.images.length === 0) {
      return 'https://via.placeholder.com/400x400/1e3d59/ffffff?text=No+Track';
    }
    return this.currentTrack.album.images[0].url;
  }

  // Obtener nombres de artistas
  getArtists(): string {
    if (!this.currentTrack) {
      return 'Enjambre';
    }
    return this.currentTrack.artists.map(artist => artist.name).join(', ');
  }

  // Saltar a una posicion en la barra de progreso
  seekTo(event: MouseEvent): void {
    const element = event.currentTarget as HTMLElement;
    const rect = element.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = (clickX / rect.width) * 100;
    this.progress = Math.max(0, Math.min(100, percentage));
    
    const totalSeconds = 30;
    const currentSeconds = Math.floor((totalSeconds * this.progress) / 100);
    const minutes = Math.floor(currentSeconds / 60);
    const seconds = currentSeconds % 60;
    this.currentTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  // Limpiar intervalo al destruir componente
  ngOnDestroy(): void {
    this.stopProgress();
  }
}
