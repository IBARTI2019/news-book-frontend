import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API } from '../utils/api';

@Injectable({ providedIn: 'root' })
export class GrupoService extends API<any> {
  protected URL = '/grupos-acceso/';

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

  updateGrupo(id: number, data: any): Observable<any> {
    return this.update(id, data);
  }

  deleteGrupo(id: number): Observable<any> {
    return this.remove(id);
  }
} 