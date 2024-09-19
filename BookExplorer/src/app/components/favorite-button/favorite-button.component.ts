import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-favorite-button',
  templateUrl: './favorite-button.component.html',
  styleUrls: ['./favorite-button.component.scss'],
})
export class FavoriteButtonComponent {
  @Input() isFavorited: boolean = false;
  @Output() toggleFavorite = new EventEmitter<void>();

  onToggleFavorite() {
    this.toggleFavorite.emit();
  }
}
