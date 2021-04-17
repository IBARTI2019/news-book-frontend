import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from 'app/utils/api';
import { listemail } from 'app/listemail/servicios/interface';
import { map, publishReplay, refCount } from 'rxjs/operators';
import { BehaviorSubject, Observable, Observer } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class UsuarioService extends API<listemail> {
  protected URL = `${this.URL_API}/listemail/crudlistemail/`;
  private $actual!: Observable<listemail> | any;
  constructor(
    protected http: HttpClient,
    private router: Router,
    //private jwtHelperService: JwtHelperService
  ) {
    super(http);
  }

  public get getPlantilla(): Observable<listemail> {
    return this.$actual;
  }

}