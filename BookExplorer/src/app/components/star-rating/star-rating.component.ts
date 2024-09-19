import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss'],
})
export class StarRatingComponent {
  @Input() rating: number = 1;
  @Output() ratingChange: EventEmitter<number> = new EventEmitter<number>();

  stars: number[] = [1, 2, 3, 4, 5];

  rate(star: number) {
    this.rating = star;
    this.ratingChange.emit(this.rating);
  }

  isFilled(star: number): boolean {
    return star <= this.rating;
  }
}
