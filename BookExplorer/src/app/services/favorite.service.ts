import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  // private baseUrl = 'http://localhost:5000';
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  addFavorite(
    bookId: string,
    rating: number | null | undefined,
    notes: number[] | null | undefined,
    tags: number[] | null | undefined
  ) {
    const favoriteData = {
      bookId: bookId,
      rating: rating,
      notes: notes,
      tags: tags,
    };

    return this.http.post(`${this.baseUrl}/favorites_list`, favoriteData);
  }

  getFavoritesList(): Observable<any> {
    return this.http.get(`${this.baseUrl}/favorites_list`);
  }

  updateRating(bookId: string, rating: number): Observable<any> {
    const body = { bookId, rating };

    return this.http.post(`${this.baseUrl}/rating_list`, body);
  }

  removeFavorite(bookId: string) {
    return this.http.delete(`${this.baseUrl}/favorites_list/${bookId}`);
  }

  // Notas

  addNote(bookId: string, noteText: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/note`, { bookId, noteText });
  }

  editNote(noteId: string, noteText: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/note/${noteId}`, { noteText });
  }

  deleteNote(noteId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/note/${noteId}`);
  }

  getNotes(bookId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/note/${bookId}`);
  }
}
