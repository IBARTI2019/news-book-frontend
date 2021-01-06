import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Menu } from '../seguridad/servicios/interface';
import { Observable } from 'rxjs';
import { MenuItems } from '../shared/menu-items/menu-items';

@Injectable()
export class RutasResolve implements Resolve<Menu[]> {

  constructor(public menuItems: MenuItems) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Menu[] | Observable<Menu[]> | Promise<Menu[]> {
    // Buscamos la rutas dependiendo de la opcion de menu
    return this.menuItems.getMenuitem();
  }

}
