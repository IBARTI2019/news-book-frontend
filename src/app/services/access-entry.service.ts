import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API } from '../utils/api';

@Injectable({ providedIn: 'root' })
export class AccessEntryService extends API<any> {
  protected URL = `${this.URL_API}/main/access-entries/`;

  public static SINGLE = 'single';
  public static RECURRING = 'recurrent';

  public static weekDays = [
    { value: 'Sunday', label: 'Domingo' },
    { value: 'Monday', label: 'Lunes' },
    { value: 'Tuesday', label: 'Martes' },
    { value: 'Wednesday', label: 'Miercoles' },
    { value: 'Thursday', label: 'Jueves' },
    { value: 'Friday', label: 'Viernes' },
    { value: 'Saturday', label: 'Sabado' }
  ];
    
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

  updateAccessEntry(id: number, data: any): Observable<any> {
    return this.update(id, data);
  }

  deleteAccessEntry(id: number): Observable<any> {
    return this.remove(id);
  }
} 