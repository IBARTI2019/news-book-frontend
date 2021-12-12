import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { API } from "../utils/api";
import { User } from "../interfaces";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { getLocalStorage, setLocalStorage } from "app/utils/localStorage";
import { ID_CRYPT, PERMISSIONS } from "app/constants";
import { NgxPermissionsService } from "ngx-permissions";
import { decryptUsingAES256, encryptUsingAES256 } from "../utils/crypt";
import { getPermissions } from "../utils/permissions"

@Injectable({
  providedIn: "root",
})
export class UserService extends API<User> {
  protected URL = `${this.URL_API}/security/user/`;
  user$ = new BehaviorSubject<{
    exist: boolean;
    type_user: string;
    oesvica_user: boolean;
  }>({
    exist: false,
    type_user: "",
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
      .get<User>(this.URL + id, {
        params,
      })
      .pipe(
        map((res: User) => {
          this.user$.next({
            exist: true,
            type_user: res.type_user || "",
            oesvica_user: res.oesvica_user || true,
          });
          setLocalStorage(ID_CRYPT, encryptUsingAES256(res.id || ""));
          setLocalStorage(PERMISSIONS, encryptUsingAES256(JSON.stringify(getPermissions())))
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
          this.ngxPermissionService.loadPermissions(getPermissions());
          resolve(true);
          //   });
        } else {
          resolve(false);
        }
      } else {
        resolve(false);
      }
    });
  }
}
