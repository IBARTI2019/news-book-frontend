import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClassificationNew } from '../interfaces'
import { API } from '../utils/api'

@Injectable({
  providedIn: 'root'
})
export class ClassificationNewService extends API<ClassificationNew> {
  protected URL = `${this.URL_API}/classifynew/crudclassifynews/`;
  constructor(
    protected http: HttpClient,
  ) {
    super(http);
  }
}
