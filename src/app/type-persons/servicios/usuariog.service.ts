import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from 'app/utils/api';
import { UsuarioG } from 'app/type-persons/servicios/interface';
import { map, publishReplay, refCount } from 'rxjs/operators';
import { BehaviorSubject, Observable, Observer } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UsuarioServiceG extends API<UsuarioG> {
  protected URL = `${this.URL_API}/typepersons/crudtypepersons/`;
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
