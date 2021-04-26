import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { SigninData, User, APIMessage, VerifyCodeResponse } from '../interfaces';
import { throwError, Observable} from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import * as jwt_decode from 'jwt-decode';
import { API } from 'app/utils/api';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private apiURL = `${environment.API}`;
  private $user!: Observable<User>;

  constructor(
    private http: HttpClient,
  ) {
  }

  public get getUser(): Observable<User> {
    return this.$user;
  }

  private getLocalStorage(fieldName: string) {
    const data = localStorage.getItem(fieldName);
    return data ? JSON.parse(data) : null;
  }

  private setLocalStorage(fieldName: string, value: any) {
    localStorage.setItem(fieldName, JSON.stringify(value));
  }

  get isLoggedIn() {
    return this.getLocalStorage(API.ISLOGGEDIN);
  }

  /**
   * @function sendCode() Recibe el username del usuario, este es enviado a un endpoint de la API
   * el cual se encargara de enviar un codigo via SMS al usuario
   * 
   * @public
   * @param {SigninData} signinData contiene el username del usuario
   * @returns {Observable<void>}
   * @memberof SessionService
  */

  sendCode(signinData: SigninData): Observable<void> {
    return this.http.post<void>(`${this.apiURL}/users/solicitud/codigo/`, { ...signinData }).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    )
  }

  /**
   * @function verifyCode() Recibe el username y el codigo enviado al usuario para que este sea verificado por la API
   *
   * @public
   * @param {SigninData} signinData contiene tanto el username como el codigo
   * @returns {Observable<APIMessage>}
   * @memberof SessionService
   */

  verifyCode(signinData: SigninData): Observable<VerifyCodeResponse> {
    if (!signinData.codigocelular) throwError ({ message: 'El codigo no puede estar vacio' })
    return this.http.post<VerifyCodeResponse>(`${this.apiURL}/users/validate/login/`, { ...signinData }).pipe(
      map((res: VerifyCodeResponse) => {
        this.setLocalStorage(API.ISLOGGEDIN, res.logIn);
        this.setLocalStorage(API.TOKEN, res.token);
        this.actual().subscribe((user: User) => {
          if(user) {
            this.setLocalStorage(API.USUARIO, user._id);
          }
        })
        return res;
      }),
      catchError((error: HttpErrorResponse) => this.handleError(error))
    )
  }

  public actual(): Observable<User> {
    if (this.$user) {
      return this.$user;
    }
    let token = this.getLocalStorage(API.TOKEN);
    if (token) {
      let decode: any = jwt_decode(String(token));
      this.$user = new Observable<User>(decode);
      return this.$user
    }
    return new Observable<User>();
  }

  /**
   * @function handleError() En caso de haber algun error en el cuerpo de respuesta
   * es manejado por esta función
   *
   * @private
   * @param {HttpErrorResponse} error
   * @returns
   * @memberof SessionService
   */
  private handleError(error: HttpErrorResponse) {
    console.error('Error: ', error)
    return (throwError(error));
  }
}
