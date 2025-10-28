import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { PlayerComponent } from '../../components/player/player.component';
import { SpotifyTrack } from '../../services/spotify.service';
import { MusicStateService } from '../../services/music-state.service';

@Component({
  selector: 'app-main-view',
  standalone: true,
  imports: [
    CommonModule,
    PlayerComponent
  ],
  templateUrl: './main-view.component.html',
  styleUrl: './main-view.component.css'
})
export class MainViewComponent implements OnInit, OnDestroy {
  selectedTrack: SpotifyTrack | null = null;
  
  private subscriptions = new Subscription();

  constructor(private musicState: MusicStateService) {}

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
}
