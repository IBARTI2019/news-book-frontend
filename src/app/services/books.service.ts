import { Injectable } from '@angular/core';
import { API } from '../utils/api';
import { Book } from '../interfaces/index'
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BooksService extends API<Book> {
  protected URL = `${this.URL_API}/main/location/`;
  constructor(
    protected http: HttpClient,
  ) {
    super(http);
  }
}