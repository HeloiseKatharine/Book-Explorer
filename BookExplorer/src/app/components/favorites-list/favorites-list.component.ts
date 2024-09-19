import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  catchError,
  forkJoin,
  Observable,
  of,
  shareReplay,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { FavoriteService } from 'src/app/services/favorite.service';

export interface Book {
  bookId: string;
  title: string;
  rating?: number;
}
export interface BookRating {
  id: string;
  title: string;
  rating?: number;
}
export interface Note {
  _id: string;
  bookId: string;
  // noteText?: number;
}

@Component({
  selector: 'app-favorites-list',
  templateUrl: './favorites-list.component.html',
  styleUrls: ['./favorites-list.component.scss'],
})
export class FavoritesListComponent {
  favorites: any;
  data: any;

  maxLength: number = 300;
  @Input() idBook: string = '';
  favoriteBooks: Set<string> = new Set();
  isRemoving: boolean = false;
  newNoteText: string = '';
  editingNoteText: any = null;
  noteToEdit: any = null;
  notes: { [bookId: string]: string } = {};
  showAllNotesPopup = false;
  selectedBookNotes: any = null;
  selectedBookNote: Note[] = [];
  errorMessage: string = '';

  constructor(
    private favoritesService: FavoriteService,
    private http: HttpClient,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchFavorites();
  }

  private destroy$ = new Subject<void>();

  fetchFavorites(): void {
    this.favoritesService
      .getFavoritesList()
      .pipe(
        switchMap((response: any) => {
          this.favorites = response;
          console.log('Dados da API:', this.favorites);
          return this.getDataFromAPI();
        }),
        shareReplay(1),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (data: any) => {
          this.data = data;
          console.log('depois do map = ', this.data);
        },
        error: (error) => {
          console.error('Erro ao buscar a lista de favoritos', error);
        },
      });
  }

  getDataFromAPI(): Observable<any> {
    const apiCalls = this.favorites.map((book: Book) => {
      const apiUrl =
        'https://www.googleapis.com/books/v1/volumes/' + book.bookId;

      return this.http.get(apiUrl).pipe(
        catchError((error) => {
          console.error('Erro ao consumir API:', error);
          return of(null);
        })
      );
    });

    return forkJoin(apiCalls);
  }

  onRatingChange(livro: BookRating, newRating: number): void {
    livro.rating = newRating;

    this.favoritesService.updateRating(livro.id, newRating).subscribe({
      next: (response) => {
        console.log('Avaliação atualizada com sucesso: ', response);
      },
      error: (error) => {
        console.error('Erro ao atualizar a avaliação do livro: ', error);
      },
    });
  }

  getTruncatedText(description: string | null | undefined): string {
    if (!description) {
      return '';
    }

    return description.length > this.maxLength
      ? description.slice(0, this.maxLength) + '...'
      : description;
  }

  removeFavorite(bookId: string): void {
    this.isRemoving = true;

    this.favoritesService.removeFavorite(bookId).subscribe({
      next: (response) => {
        console.log('Livro removido dos favoritos:', response);

        this.changeDetectorRef.detectChanges();
        this.isRemoving = false;
        this.fetchFavorites();
      },
      error: (error) => {
        console.error('Erro ao remover o livro dos favoritos:', error);
        this.isRemoving = false;
      },
    });
  }

  addNote(bookId: string): void {
    if (this.notes[bookId].length > 500) {
      alert('O texto da nota deve ter no máximo 500 caracteres.');
      return;
    }

    this.favoritesService.addNote(bookId, this.notes[bookId]).subscribe({
      next: (response) => {
        console.log('Nota adicionada com sucesso:', response);
        this.notes[bookId] = '';
        this.fetchFavorites();
      },
      error: (error) => {
        console.error('Erro ao adicionar a nota:', error);
      },
    });
  }

  editNote(): void {
    if (this.noteToEdit && this.editingNoteText.length > 0) {
      this.favoritesService
        .editNote(this.noteToEdit, this.editingNoteText)
        .subscribe({
          next: (response) => {
            console.log('Nota atualizada com sucesso:', response);
            this.editingNoteText = '';
            this.noteToEdit = null;
            this.fetchFavorites();
          },
          error: (error) => {
            console.error('Erro ao editar a nota:', error);
          },
        });
    }
  }

  deleteNote(noteId: string): void {
    this.favoritesService.deleteNote(noteId).subscribe({
      next: (response) => {
        this.showAllNotes(noteId);
        this.closeAllNotes();
        console.log('Nota excluída :', response);
      },
      error: (error) => {
        console.error('Erro ao excluir a nota:', error);
      },
    });
  }

  showAllNotes(bookId: string): void {
    this.favoritesService.getNotes(bookId).subscribe({
      next: (notes: any[]) => {
        this.selectedBookNotes = notes;
        this.showAllNotesPopup = true;
        this.errorMessage = '';
      },
      error: (error) => {
        if (error.status === 404) {
          this.errorMessage =
            'Notas não encontradas para o livro especificado.';
          alert(this.errorMessage);
        } else {
          this.errorMessage = 'Ocorreu um erro ao buscar as notas.';
        }
        console.error('Erro ao buscar notas.', error);
      },
    });
  }

  closeAllNotes() {
    this.showAllNotesPopup = false;
    this.selectedBookNotes = [];
  }
}
