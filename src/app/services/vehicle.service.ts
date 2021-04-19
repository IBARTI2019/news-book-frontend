import { Injectable } from '@angular/core';
import { API } from '../utils/api'
import { Vehicle } from '../interfaces/index'
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VehicleService extends API<Vehicle> {
  protected URL = `${this.URL_API}/vehiculos/crudvehiculos/`;
  constructor(
    protected http: HttpClient,
  ) {
    super(http);
  }
}
