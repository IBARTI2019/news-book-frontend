import { Injectable } from '@angular/core';
import { API } from '../utils/api';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FacialRecognitionService extends API<any> {
  protected URL = `${this.URL_API}/setting/facial-recognition/`;
  constructor(
    protected http: HttpClient,
  ) {
    super(http);
  }
}