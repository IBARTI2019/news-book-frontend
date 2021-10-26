import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { environment } from "../../environments/environment";
import {
  SigninData,
  User,
  VerifyCodeResponse,
} from "../interfaces";
import { throwError, Observable, BehaviorSubject } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { API } from "app/utils/api";
import { Router } from "@angular/router";
import { getLocalStorage, setLocalStorage, deleteLocalStorageItem } from '../utils/localStorage'
import { ID_CRYPT, PERMISSIONS } from 'app/constants';
import { encryptUsingAES256 } from 'app/utils/crypt';
import { getPermissions } from 'app/utils/permissions';
import { UserService } from './user.service';

@Injectable({
  providedIn: "root",
})
export class SessionService extends API<User> {
  protected URL = `${this.URL_API}/security`;
  private apiURL = `${environment.API}`;
  private $user!: BehaviorSubject<User>;

  constructor(protected http: HttpClient, private router: Router, private userService: UserService) {
    super(http);
  }

  public get getUser(): Observable<User> {
    return this.$user;
  }

  get isLoggedIn() {
    return getLocalStorage(API.ISLOGGEDIN);
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
    return this.http
      .post<void>(`${this.apiURL}/security/valid/request_security_code/`, {
        ...signinData,
      })
      .pipe(catchError((error: HttpErrorResponse) => this.handleError(error)));
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
    if (!signinData.security_code)
      throwError({ message: "El codigo no puede estar vacio" });
    return this.http
      .post<VerifyCodeResponse>(`${this.apiURL}/token/`, {
        ...signinData,
      })
      .pipe(
        map((res: VerifyCodeResponse) => {
          setLocalStorage(ID_CRYPT, encryptUsingAES256(res.jwt_id || ""));
          setLocalStorage(API.TOKEN, res.token);
          setLocalStorage(API.TYPE_USER, res.type_user);
          setLocalStorage(PERMISSIONS, encryptUsingAES256(JSON.stringify(getPermissions())));
          this.userService.user$.next({
            exist: true,
            type_user: "",
            oesvica_user: true,
          })
          return res;
        }),
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  public logout() {
    deleteLocalStorageItem(ID_CRYPT);
    this.router.navigateByUrl("/sign-in");
  }

  /**
   * isSuperUser
   */
  public async isSuperUser(): Promise<boolean> {
    // const userId = getLocalStorage(API.USUARIO)
    // const user = await this.http.get<User>(`${this.apiURL}/security/user/${userId}/`).toPromise();
    // return (user.is_superuser || false);
    return false;
  }

  public async isStaff(): Promise<boolean> {
    // const userId = getLocalStorage(API.USUARIO)
    // const user = await this.http.get<User>(`${this.apiURL}/security/user/${userId}/`).toPromise();
    // return (user.is_staff || false);
    return true;
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
    console.error("Error: ", error);
    return throwError(error);
  }
}
