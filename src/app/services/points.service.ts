import { Injectable } from '@angular/core';
import { API } from '../utils/api';
import { Point } from '../interfaces/index'
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PointsService extends API<Point> {
  protected URL = `${this.URL_API}/main/point/`;
  constructor(
    protected http: HttpClient,
  ) {
    super(http);
  }
}