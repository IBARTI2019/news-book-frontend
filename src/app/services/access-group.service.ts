import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API } from '../utils/api';

@Injectable({ providedIn: 'root' })
export class AccessGroupService extends API<any> {
  protected URL = `${this.URL_API}/main/access-groups/`;

  constructor(protected http: HttpClient) {
    super(http);
  }

  getAll(params?: any): Observable<any[]> {
    return this.list(params);
  }

  getById(id: number): Observable<any> {
    return this.get(id);
  }

  create(data: any): Observable<any> {
    return this.add(data);
  }

  updateAccessGroup(id: number, data: any): Observable<any> {
    return this.update(id, data);
  }

  deleteAccessGroup(id: number): Observable<any> {
    return this.remove(id);
  }
} 