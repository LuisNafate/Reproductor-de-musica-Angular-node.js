import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SpotifyTrack, SpotifyArtist, SpotifyAlbum } from '../../services/spotify.service';

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
  
  constructor(private router: Router) {}

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
  
  // Lista de reproduccion fija (simulada)
  playQueue: any[] = [
    {
      name: 'ANTIFRAGILE',
      artist: 'LE SSERAFIM',
      image: 'https://i.scdn.co/image/ab67616d00001e023369310bc92d472415369ed6'
    },
    {
      name: 'Impacto',
      artist: 'Enjambre',
      image: 'https://i.scdn.co/image/ab67616d00001e0266f128e383614b0aa4df5ebd'
    },
    {
      name: 'UNFORGIVEN',
      artist: 'LE SSERAFIM',
      image: 'https://i.scdn.co/image/ab67616d00001e02971bef5fdb2db3fa3e6e3870'
    },
    {
      name: 'Vida En El Espejo',
      artist: 'Enjambre',
      image: 'https://i.scdn.co/image/ab67616d00001e0208b5853acded25e1b5ff5115'
    },
    {
      name: 'FEARLESS',
      artist: 'LE SSERAFIM',
      image: 'https://i.scdn.co/image/ab67616d00001e02971bef5fdb2db3fa3e6e3870'
    }
  ];

  // Cambiar pestana activa
  setActiveTab(tab: 'tracks' | 'artists' | 'albums'): void {
    this.activeTab = tab;
  }

  // Regresar a vista principal
  goBack(): void {
    this.router.navigate(['/']);
  }

  // Seleccionar cancion y volver a main
  selectTrack(track: SpotifyTrack): void {
    this.router.navigate(['/'], {
      state: { selectedTrack: track, tracks: this.tracks }
    });
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
