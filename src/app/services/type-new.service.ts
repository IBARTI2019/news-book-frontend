import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TypeNew } from '../interfaces';
import { API } from '../utils/api';

@Injectable({
  providedIn: 'root'
})
export class TypeNewService extends API<TypeNew> {
  protected URL = `${this.URL_API}/core/type_news/`;
  constructor(
    protected http: HttpClient,
  ) {
    super(http);
  }

  public getCodesTemplate() {
    return this.http.get(this.URL + 'codes_template/', {});
  }
}
