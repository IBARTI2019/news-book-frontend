import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Person } from '../interfaces';
import { API } from '../utils/api'

@Injectable({
  providedIn: 'root'
})
export class PersonService extends API<Person> {
  protected URL = `${this.URL_API}/main/person/`;
  constructor(
    protected http: HttpClient,
  ) {
    super(http);
  }

  getPersonByIdentification(identification: string) {
    return this.http.get<Person>(`${this.URL}get-person?identification=${identification}`);
  }

}
