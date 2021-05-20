import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GlobalService } from './global.service';
import { Observable } from 'rxjs';
import { API } from './api';
import { SessionService } from 'app/services/session.service';
import { Permiso } from 'app/interfaces';

/**
 * Guard para validar las rutas con los workflows que estan en
 * base de datos.
 *
 * Si queremos que una ruta no este bajo esta validacion debemos
 * colocar en la data de la url el atributo `skipPermission:true`
 * Ejemplo:
 * ```
 * {
 *    path: 'inicio',
 *    children: [
 *       { path: '', data: { skipPermission: true }, component: InicioComponent, resolve: { items: RutasResolve } },
 *       { path: ':titulo/:id', data: { skipPermission: true }, component: InicioComponent, resolve: { items: RutasResolve } },
 *     ]
 * },
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class PermisoGuard implements CanActivate, CanActivateChild {

  constructor(
    private router: Router,
    private globalService: GlobalService,
    private toastrService: ToastrService,
    private sessionService: SessionService
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return true;
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean> | boolean | UrlTree | Observable<boolean | UrlTree> {
    let actual: any = this.sessionService.actual();

    return true; //Quitar esto para gestionar permisos
    if ((childRoute.data && childRoute.data.skipPermission) || childRoute.routeConfig?.path === "inicio") {
      return true;
    } else if (!this.sessionService.isLoggedIn || actual === undefined) {
      this.router.navigateByUrl('/login');
    }
    if (actual?.roll?.SU === true || childRoute.routeConfig?.path === "") {
      return true;
    } else {
      let menus: any[] = actual?.permisos.filter((permiso: Permiso) => {
        return permiso.routers?.find((ruta: string) => {
          let url = state.url.split("/");
          return `/${url[1]}/${url[2]}` === `/ ${ruta.split(":")[0]}` !== undefined;
        });
      });
      if (menus?.length > 0) {
        localStorage.setItem(API.MENU_ACTUAL, menus[0]);
        return true;
      } else {
        if (childRoute.routeConfig?.path !== "") {
          this.toastrService.error('No tienes permisos para acceder a esta opción');
        }
        //this.router.navigate(['inicio']);
        return false;
      }
    }
  }


}
