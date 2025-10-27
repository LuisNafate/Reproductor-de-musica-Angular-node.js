import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {
  @Output() search = new EventEmitter<string>();
  searchQuery = '';

  // Emitir evento de busqueda al presionar Enter
  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.search.emit(this.searchQuery);
    }
  }
}
