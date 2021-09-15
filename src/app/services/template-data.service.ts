import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API } from '../utils/api'
import { TemplateData } from '../interfaces'

@Injectable({
  providedIn: 'root'
})
export class TemplateDataService extends API<TemplateData> {
  protected URL = `${this.URL_API}/setting/ibarti/`;
  constructor(
    protected http: HttpClient,
  ) {
    super(http);
  }
}