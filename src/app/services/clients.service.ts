import { Injectable } from '@angular/core';
import { API } from '../utils/api';
import { Client } from '../interfaces/index'
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ClientsService extends API<Client> {
  protected URL = `${this.URL_API}/customers/client/`;
  constructor(
    protected http: HttpClient,
  ) {
    super(http);
  }
}