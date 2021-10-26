import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Book } from "app/interfaces";
import { BooksService } from "../../../services/books.service";
import { SessionService } from '../../../services/session.service';

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: [],
})
export class AppHeaderComponent implements OnInit {
  books: Book[] = [];
  constructor(private router: Router, private sessionService: SessionService, private booksService: BooksService) { }
  ngOnInit(): void {
    this.booksService.list((books: Book[]) => {
      this.books = books;
    })
  }


  logout() {
    this.sessionService.logout();
  }
}
