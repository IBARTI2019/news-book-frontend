import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { API } from "../utils/api";
import { User } from "../interfaces";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { getLocalStorage } from "app/utils/localStorage";
import { ADMIN, AUDITOR, ID_CRYPT, SUPERVISOR, USER } from "app/constants";
import { NgxPermissionsService } from "ngx-permissions";
import { decryptUsingAES256, encryptUsingAES256 } from "../utils/crypt"

@Injectable({
  providedIn: "root",
})
export class UserService extends API<User> {
  protected URL = `${this.URL_API}/security/user/`;
  user$ = new BehaviorSubject<{
    exist: boolean;
    type: number;
    oesvica_user: boolean;
  }>({
    exist: false,
    type: 0,
    oesvica_user: false,
  });
  constructor(
    protected http: HttpClient,
    private ngxPermissionService: NgxPermissionsService
  ) {
    super(http);
  }

  get(id: string | number, params?: {}): Observable<User> {
    return this.http
      .get<User>(this.URL + id + "/?not_paginator=true", {
        params,
      })
      .pipe(
        map((res: User) => {
          console.log('Response: ', res)
          this.user$.next({
            exist: true,
            type: res.type || 0,
            oesvica_user: res.oesvica_user || false,
          });
          encryptUsingAES256(res.id || "");
          return res;
        })
      );
  }

  public checkAuthenticationAsPromise(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      const userCrypt = getLocalStorage(ID_CRYPT);
      if (userCrypt) {
        const userDecrypt = decryptUsingAES256(userCrypt);
        if (userDecrypt) {
          // this.get(userDecrypt).subscribe((user: User) => {
          //   console.log("User: ", user);
            this.ngxPermissionService.loadPermissions(this.getPermissions());
            resolve(true);
          // });
        } else {
          resolve(false);
        }
      } else {
        resolve(false);
      }
    });
  }

  private getPermissions(role: string = "ADMIN"): string[] {
    // if (role === ADMIN) {
    //   return [ADMIN]
    // } else if (role === SUPERVISOR) {
    //   return [SUPERVISOR]
    // } else if (role === AUDITOR) {
    //   return [AUDITOR]
    // } else if (role === USER) {
    //   return [USER]
    // }
    return [role];
  }

}
