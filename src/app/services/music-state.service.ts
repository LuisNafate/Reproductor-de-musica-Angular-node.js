import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SpotifyTrack } from './spotify.service';

@Injectable({
  providedIn: 'root'
})
export class MusicStateService {
  // Estado reactivo con BehaviorSubject
  private selectedTrackSubject = new BehaviorSubject<SpotifyTrack | null>(null);
  private tracksSubject = new BehaviorSubject<SpotifyTrack[]>([]);
  
  // Observables publicos para suscripcion
  selectedTrack$ = this.selectedTrackSubject.asObservable();
  tracks$ = this.tracksSubject.asObservable();

  // Obtener valores actuales sin suscripcion
  get selectedTrack(): SpotifyTrack | null {
    return this.selectedTrackSubject.value;
  }

  get tracks(): SpotifyTrack[] {
    return this.tracksSubject.value;
  }

  // Actualizar cancion seleccionada
  setSelectedTrack(track: SpotifyTrack | null): void {
    this.selectedTrackSubject.next(track);
  }

  // Actualizar lista de canciones
  setTracks(tracks: SpotifyTrack[]): void {
    this.tracksSubject.next(tracks);
  }

  // Limpiar estado
  clearState(): void {
    this.selectedTrackSubject.next(null);
    this.tracksSubject.next([]);
  }
}
