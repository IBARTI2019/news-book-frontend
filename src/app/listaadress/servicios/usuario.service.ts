import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from 'app/utils/api';
import { listaadress } from 'app/listaadress/servicios/interface';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class UsuarioService extends API<listaadress> {
  protected URL = `${this.URL_API}/listaadress/crudlistaadress/`;
  private $actual!: Observable<listaadress> | any;
  constructor(
    protected http: HttpClient,
    private router: Router,
    //private jwtHelperService: JwtHelperService
  ) {
    super(http);
  }

  public get getPlantilla(): Observable<listaadress> {
    return this.$actual;
  }

}
