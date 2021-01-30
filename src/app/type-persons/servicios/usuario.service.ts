import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from 'app/utils/api';
import { Usuario } from 'app/type-persons/servicios/interface';
import { map, publishReplay, refCount } from 'rxjs/operators';
import { BehaviorSubject, Observable, Observer } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class UsuarioService extends API<Usuario> {
  protected URL = `${this.URL_API}/typepersons/crudtypepersons/`;
  private $actual!: Observable<Usuario> | any;
  constructor(
    protected http: HttpClient,
    private router: Router,
    //private jwtHelperService: JwtHelperService
  ) {
    super(http);
  }

  public get getUsuario(): Observable<Usuario> {
    return this.$actual;
  }

  get isLoggedIn() {
    return localStorage.getItem(API.ISLOGGEDIN);
  }

  public login(usuario?: string, clave?: string) {
    // En el login se quitan los ceros a la izquierda para números de personal
    return this.http
      .post(`${this.URL_API}/users/login/`, { usuario, clave })
      .pipe(
        map((response: any) => {
          localStorage.setItem(API.ISLOGGEDIN, response.logIn);
          localStorage.setItem(API.TOKEN, response.token);
          let usuario: any = this.actual();
          localStorage.setItem(API.USUARIO, usuario.usuario);
          //localStorage.setItem(API.TOKEN, response.access);
          //localStorage.setItem(API.REFRESH_TOKEN, response.refresh);
          return response;
        })
      );
  }

  public activar(id: string) {
    return this.http.patch(this.URL + id + '/activar/', {});
  }

  public logout() {
    this.http.post(`${this.URL_API}/usuario/logout/`, { usuario: localStorage.getItem(API.USUARIO) }).subscribe(data => {
      localStorage.removeItem(API.TOKEN);
      localStorage.removeItem(API.USUARIO);
      localStorage.removeItem(API.MENU_ACTUAL);
      localStorage.removeItem(API.ISLOGGEDIN);
      localStorage.removeItem(API.REFRESH_TOKEN);
      localStorage.removeItem(API.JWT);
      this.$actual = null;
      this.router.navigateByUrl('/login');
    });
  }

  public actual() {
    if (this.$actual) {
      return this.$actual;
    }
    let token = localStorage.getItem(API.TOKEN);
    if (token) {
      let decode: any = jwt_decode(String(token));
      this.$actual = decode;
    }
    /* this.http.get(`${this.URL}actual/`).pipe(
      publishReplay(),
      refCount(),
      map((response: any) => {
        localStorage.setItem(API.JWT, response.jwt_id);
        this.usuario_actual.next(response);
        return response;
      })
    ); */
    return this.$actual;
  }

  public valNroPersonal(nro_personal: any) {
    // tslint:disable-next-line: radix
    return !isNaN(nro_personal) ? '' + parseInt(nro_personal) : nro_personal;
  }

  public cambiarContrasenna(usuario: Usuario) {
    return this.http.post(`${this.URL}cambiar_contrasenna/`, usuario);
  }

  public comprobarContrasenna(nro_personal: string, password: string) {
    return this.http.post(`${this.URL}validar_password/`, {
      nro_personal,
      nuevo_password: password
    });
  }

  tokenRefresh() {
    return this.http
      .post(`${this.URL}token-refresh/`, {
        refresh: localStorage.getItem(API.REFRESH_TOKEN)
      })
      .pipe(
        map((response: any) => {
          localStorage.setItem(API.TOKEN, response.access);
          return response;
        })
      );
  }

}
