import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../../utils/api';
import { UsuarioG } from '../../gestion/servicios/interface';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioServiceG extends API<UsuarioG> {
  protected URL = `${this.URL_API}/users/crud/`;
  private $actual!: Observable<UsuarioG> | any;
  constructor(
    protected http: HttpClient,
    private router: Router,
    //private jwtHelperService: JwtHelperService
  ) {
    super(http);
  }

  obtenerUsuarios(params: any) {
    console.log('parametros', params);

    return this.http.get(`${this.URL}`, {});
  }
}
