import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MenuItems } from 'app/shared/menu-items/menu-items';
import { UsuarioService } from 'app/seguridad/servicios/usuario.service';
import { Permiso, Roll } from "app/seguridad/servicios/interface";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: []
})
export class AppSidebarComponent implements OnInit, OnDestroy {
  usuario: any = {};
  roll: Roll = { _id: "", descripcion: "" };
  mobileQuery: MediaQueryList;
  public menuitems: any = [];
  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public menuItems: MenuItems,
    public usuarioService: UsuarioService
  ) {
    this.usuario = this.usuarioService.actual();
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  existModule(module: string) {
    return true;
    let user: any = this.usuarioService.actual();
    if (user.roll.SU === true) {
      return true;
    } else {
      let valid = user.permisos.findIndex((p: Permiso) => p?.routers ? p.routers[0].includes(module) : false);
      return valid !== -1;
    }
  }

  logout() {
    this.usuarioService.logout();
  }
}