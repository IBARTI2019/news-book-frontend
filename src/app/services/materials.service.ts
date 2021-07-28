import { Injectable } from '@angular/core';
import { API } from '../utils/api';
import { Material } from '../interfaces/index'
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class MaterialsService extends API<Material> {
  protected URL = `${this.URL_API}/main/material/`;
  constructor(
    protected http: HttpClient,
  ) {
    super(http);
  }
}
