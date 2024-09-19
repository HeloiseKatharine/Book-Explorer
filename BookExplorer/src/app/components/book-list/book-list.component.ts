import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { FavoriteService } from 'src/app/services/favorite.service';

export interface Book {
  id: string;
  notes: [];
  rating?: number;
  tags: [];
}

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss'],
})

export class BookListComponent implements OnInit {
  @Input() searchTerm: string = '';
  data: any;
  maxLength: number = 300;
  ratings: { [key: string]: number } = {};
  favoriteBooks: Set<string> = new Set();
  notes: number[] = [];
  tags: number[] = [];

  constructor(
    private http: HttpClient,
    private favoriteService: FavoriteService
  ) {}

  ngOnInit(): void {
    this.getDataFromAPI();
  }

  ngOnChanges(): void {
    this.getDataFromAPI();
  }

  getDataFromAPI(): void {
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const apiUrl =
        'https://www.googleapis.com/books/v1/volumes?q=' + this.searchTerm;

      this.http
        .get(apiUrl)
        .pipe(
          catchError((error) => {
            console.error('Erro ao consumir API: (pesquisa)', error);
            return of([]);
          })
        )
        .subscribe((response) => {
          this.data = response;
          console.log('Dados da API:', this.data);
        });
    }
  }

  getTruncatedText(description: string | null | undefined): string {
    if (!description) {
      return '';
    }

    return description.length > this.maxLength
      ? description.slice(0, this.maxLength) + '...'
      : description;
  }

  isFavorite(bookId: string): boolean {
    return this.favoriteBooks.has(bookId);
  }

  toggleFavorite(
    bookId: string,
    rating: number | null | undefined,
    notes: number[] | null | undefined,
    tags: number[] | null | undefined
  ) {
    if (this.isFavorite(bookId)) {
      this.favoriteBooks.delete(bookId);
    } else {
      this.favoriteBooks.add(bookId);

      this.favoriteService.addFavorite(bookId, rating, notes, tags).subscribe({
        next: (response) => {
          console.log('Livro adicionado aos favoritos: ', response);
        },
        error: (error) => {
          console.error('Erro ao adicionar o livro aos favoritos: ', error);
        },
      });
    }
  }

  onRatingChange(livro: Book, newRating: number): void {
    livro.rating = newRating;

    this.favoriteService.updateRating(livro.id, newRating).subscribe({
      next: (response) => {
        console.log('Avaliação atualizada com sucesso: ', response);
      },
      error: (error) => {
        console.error('Erro ao atualizar a avaliação do livro: ', error);
      },
    });
  }
}
