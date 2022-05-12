import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API } from '../utils/api';
import { New } from '../interfaces'
import { Observable } from 'rxjs';

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

  getAllow(id: string, schema_name: string): Observable<any> {
    return this.http.get<any>(`${this.URL_API}/main/newslink/${id}/`, {params: {schema_name}});
  }
}
