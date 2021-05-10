import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Warehouse } from '../interfaces'
import { API } from '../utils/api'

@Injectable({
  providedIn: 'root'
})
export class WarehouseService extends API<Warehouse> {
  protected URL = `${this.URL_API}/warehouses/crudwarehouses/`;
  constructor(
    protected http: HttpClient,
  ) {
    super(http);
  }

  public activar(id: string) {
    return this.http.patch(this.URL + id + '/activar/', {});
  }

}
