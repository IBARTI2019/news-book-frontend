import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { environment } from "../../environments/environment";
import {
  SigninData,
  User,
  APIMessage,
  VerifyCodeResponse,
} from "../interfaces";
import { throwError, Observable, BehaviorSubject } from "rxjs";
import { catchError, map } from "rxjs/operators";
import * as jwt_decode from "jwt-decode";
import { API } from "app/utils/api";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class SessionService extends API<User> {
  protected URL = `${this.URL_API}/security`;
  private apiURL = `${environment.API}`;
  private $user!: BehaviorSubject<User>;

  constructor(protected http: HttpClient, private router: Router) {
    super(http);
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

  private deleteStorageItem(fieldName: string) {
    localStorage.removeItem(fieldName);
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
          this.setLocalStorage(API.ISLOGGEDIN, true);
          this.setLocalStorage(API.TOKEN, res.token);
          this.actual().subscribe(async (user: User) => {
            if (user) {
              this.setLocalStorage(API.USUARIO, user.user_id);
            }
          });
          return res;
        }),
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  public logout() {
    /*     this.$user.subscribe((user: User) => {
          this.http
            .post(`${this.URL_API}/users/validate/logout/`, {
              _id: user.id,
            })
            .subscribe((data) => { */
    this.deleteStorageItem(API.TOKEN);
    this.deleteStorageItem(API.USUARIO);
    this.deleteStorageItem(API.MENU_ACTUAL);
    this.deleteStorageItem(API.ISLOGGEDIN);
    this.deleteStorageItem(API.REFRESH_TOKEN);
    this.deleteStorageItem(API.JWT);
    this.$user = new BehaviorSubject<User>({
      name: "",
      last_name: "",
      email: "",
      user_id: "",
    });
    this.router.navigateByUrl("/");
    /*
   });
}); */
  }

  public actual(): BehaviorSubject<User> {
    if (this.$user) {
      return this.$user;
    }
    let token = this.getLocalStorage(API.TOKEN);
    if (token) {
      let decode: any = jwt_decode(String(token));
      this.$user = new BehaviorSubject<User>(decode);
      return this.$user;
    }
    return new BehaviorSubject<User>({
      name: "",
      last_name: "",
      email: "",
      user_id: "",
    });
  }

  /**
   * isSuperUser
   */
  public async isSuperUser(): Promise<boolean> {
    // const userId = this.getLocalStorage(API.USUARIO)
    // const user = await this.http.get<User>(`${this.apiURL}/security/user/${userId}/`).toPromise();
    // return (user.is_superuser || false);
    return true;
  }

  public async isStaff(): Promise<boolean> {
    // const userId = this.getLocalStorage(API.USUARIO)
    // const user = await this.http.get<User>(`${this.apiURL}/security/user/${userId}/`).toPromise();
    // return (user.is_staff || false);
    return false;
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
