import { Component, OnInit } from "@angular/core";
import { Book, User } from "app/interfaces";
import { API } from "app/utils/api";
import { getLocalStorage, setLocalStorage } from "app/utils/localStorage";
import { SessionService } from '../../../services/session.service';

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: [],
})
export class AppHeaderComponent implements OnInit {
  user!: User;
  books: Book[] = [];
  select_book!: Book;
  constructor(private sessionService: SessionService) { }
  ngOnInit() {
    let id_book = getLocalStorage(API.BOOK);
    this.sessionService.current().subscribe(user => {
      this.user = user;
      this.books = this.user.locations || [];
      this.select_book = this.books.find(b => b.id == id_book) as Book;
    });
  }


  logout() {
    this.sessionService.logout();
  }

  setBook(book: Book) {
    this.select_book = book;
    setLocalStorage(API.BOOK, book.id);
    window.location.reload();
  }
}
