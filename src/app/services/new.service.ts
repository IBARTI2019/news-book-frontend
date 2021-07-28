import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API } from '../utils/api';
import { New } from '../interfaces'

@Injectable({
  providedIn: 'root'
})
export class NewService extends API<New> {
  protected URL = `${this.URL_API}/main/news/`;
  constructor(
    protected http: HttpClient,
  ) {
    super(http);
  }
}
