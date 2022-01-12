import { Injectable } from '@angular/core';
import { API } from '../utils/api';
import { Domain } from '../interfaces/index'
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DomainsService extends API<Domain> {
  protected URL = `${this.URL_API}/customers/domain/`;
  constructor(
    protected http: HttpClient,
  ) {
    super(http);
  }
}