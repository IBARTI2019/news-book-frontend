import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from 'app/utils/api';
import { personasentrance } from 'app/news/servicios/interface';
import { map, publishReplay, refCount } from 'rxjs/operators';
import { BehaviorSubject, Observable, Observer } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class PerService extends API<personasentrance> {
  protected URL = `${this.URL_API}/newspersons/crudnewspersons/`;
  private $actual!: Observable<personasentrance> | any;
  constructor(
    protected http: HttpClient,
    private router: Router,
    //private jwtHelperService: JwtHelperService
  ) {
    super(http);
  }

  public get getUsuario(): Observable<personasentrance> {
    return this.$actual;
  }

}
