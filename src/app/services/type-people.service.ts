import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TypePeople } from '../interfaces';
import { API } from '../utils/api';

@Injectable({
  providedIn: 'root'
})
export class TypePeopleService extends API<TypePeople> {
  protected URL = `${this.URL_API}/typepersons/crudtypepersons/`;
  constructor(
    protected http: HttpClient,
  ) {
    super(http);
  }
}
