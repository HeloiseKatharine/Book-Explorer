import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { SearchComponent } from './components/search/search.component';
import { FormsModule } from '@angular/forms';
import { FavoritesListComponent } from './components/favorites-list/favorites-list.component';
import { HomeComponent } from './components/home/home.component';
import { BookListComponent } from './components/book-list/book-list.component';
import { HttpClientModule } from '@angular/common/http';
import { StarRatingComponent } from './components/star-rating/star-rating.component';
import { FavoriteButtonComponent } from './components/favorite-button/favorite-button.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SearchComponent,
    FavoritesListComponent,
    HomeComponent,
    BookListComponent,
    StarRatingComponent,
    FavoriteButtonComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
