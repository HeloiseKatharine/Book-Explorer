import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  @Input() livro = {
    id: '1',
    titulo: 'Aprendendo Angular',
    autor: 'Aprendendo Angular',
  };

  searchTerm: string = '';
  bookSearchTerm: string = '';

  ngOnInit(): void {}

  handleSearch() {
    console.log(this.searchTerm);
    this.bookSearchTerm = this.searchTerm;
  }
}
