import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { TrackListComponent } from '../../components/track-list/track-list.component';
import { PlayerComponent } from '../../components/player/player.component';
import { SpotifyTrack } from '../../services/spotify.service';

@Component({
  selector: 'app-main-view',
  standalone: true,
  imports: [
    CommonModule,
    SearchBarComponent,
    TrackListComponent,
    PlayerComponent
  ],
  templateUrl: './main-view.component.html',
  styleUrl: './main-view.component.css'
})
export class MainViewComponent {
  @Input() tracks: SpotifyTrack[] = [];
  @Input() selectedTrack: SpotifyTrack | null = null;
  @Input() errorMessage: string = '';
  
  @Output() search = new EventEmitter<string>();
  @Output() trackSelected = new EventEmitter<SpotifyTrack>();

  // Emitir busqueda hacia AppComponent
  onSearch(query: string): void {
    this.search.emit(query);
  }

  // Emitir seleccion de cancion
  onTrackSelected(track: SpotifyTrack): void {
    this.trackSelected.emit(track);
  }
}
