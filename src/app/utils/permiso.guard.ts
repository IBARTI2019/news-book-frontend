import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { UsuarioService } from '../seguridad/servicios/usuario.service';
import { ToastrService } from 'ngx-toastr';
import { ABSOLUTE_PATH, GlobalService } from './global.service';
import { pathFromRootConcat } from './function';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Permiso } from 'app/seguridad/servicios/interface';
import { API } from './api';

/**
 * Guard para validar las rutas con los workflows que estan en
 * base de datos.
 *
 * Si queremos que una ruta no este bajo esta validacion debemos
 * colocar en la data de la url el atributo `omitirPermiso:true`
 * Ejemplo:
 * ```
 * {
 *    path: 'inicio',
 *    children: [
 *       { path: '', data: { omitirPermiso: true }, component: InicioComponent, resolve: { items: RutasResolve } },
 *       { path: ':titulo/:id', data: { omitirPermiso: true }, component: InicioComponent, resolve: { items: RutasResolve } },
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
    private usuarioService: UsuarioService
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
    let actual: any = this.usuarioService.actual();

    return true; //Quitar esto para gestionar permisos
    if ((childRoute.data && childRoute.data.omitirPermiso) || childRoute.routeConfig?.path === "inicio") {
      return true;
    } else if (!this.usuarioService.isLoggedIn || actual === undefined) {
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
