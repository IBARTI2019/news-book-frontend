import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from 'app/utils/api';
import { Plantilla} from 'app/plantillas/servicios/interface';
import { map, publishReplay, refCount } from 'rxjs/operators';
import { BehaviorSubject, Observable, Observer } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class UsuarioService extends API<Plantilla> {
  protected URL = `${this.URL_API}/plantillas/crudplantilla/`;
  private $actual!: Observable<Plantilla> | any;
  constructor(
    protected http: HttpClient,
    private router: Router,
    //private jwtHelperService: JwtHelperService
  ) {
    super(http);
  }

  public get getPlantilla(): Observable<Plantilla> {
    return this.$actual;
  }

}
