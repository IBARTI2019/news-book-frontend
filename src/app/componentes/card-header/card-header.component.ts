import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, PRIMARY_OUTLET } from '@angular/router';
import { Subscription } from 'rxjs';
import { first, filter, map } from 'rxjs/operators';
import { Location } from '@angular/common';
import { pathFromRootConcat } from 'app/utils/function';
import { GlobalService } from 'app/utils/global.service';
import { Permiso } from 'app/seguridad/servicios/interface';

/**
 * Componente para la creacion del header de los modulos
 * ```
 *  <app-card-header link="crear/" link-titulo="Crear Rol"></app-card-header>
 * ```
 * `link` es un atributo para definir la ruta que redireccionara el boton
 * `link-ruta` titulo del boton
 */
@Component({
  selector: 'app-card-header',
  templateUrl: './card-header.component.html',
  styleUrls: ['./card-header.component.scss']
})
export class CardHeaderComponent implements OnInit, OnDestroy {

  @Input() modulo = "";
  @Input() menu = "";
  @Input() link = "";
  // tslint:disable-next-line: no-input-rename
  @Input('link-menu') linkMenu = "";
  item: Permiso = { metodos: [] };
  private menuSubscription: Subscription;
  urlMenu = "";
  breadcrumbs: {
    url: string;
    label: string;
    params: any;
  }[] = [];
  private subscription: Subscription;
  private INICIO = {
    url: '/inicio',
    label: 'Inicio',
    params: []
  };
  private url_menu: string = "/";
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private globalService: GlobalService,
  ) {
    this.menuSubscription = this.router.events.pipe(
      first(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Quitemos los '/' del inicio
      const url = event.url[0] === '/' ? event.url.substring(1) : event.url;

      // Variable guardada desde el WorkflowGuard
      let { appAbsolutePath } = this.globalService.map;

      // De no existir la variable reconstruimos el path
      if (!appAbsolutePath) {
        appAbsolutePath = pathFromRootConcat(this.activatedRoute.snapshot.pathFromRoot);
      }
    });

    this.subscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .pipe(map(() => this.activatedRoute))
      .pipe(map((route) => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }))
      .pipe(filter(route => route.outlet === PRIMARY_OUTLET))
      .subscribe(route => {
        const snapshot = this.router.routerState.snapshot;
        // Colocamos el primer eslabon que el inicio

        this.breadcrumbs = [this.INICIO];
        const url = snapshot.url[0] === '/' ? snapshot.url.substring(1) : snapshot.url;
        const routeData = route.snapshot.data;
        this.url_menu = routeData.urlMenu ? routeData.urlMenu : url;
        const params = route.snapshot.params ? route.snapshot.params : [];

        if (routeData.breadcrumbAnt) {
          this.breadcrumbs.push({
            url: `/${routeData.breadcrumbAnt.url}`,
            label: routeData.breadcrumbAnt.label,
            params: routeData.breadcrumbAnt.params
          });
        }

        this.breadcrumbs.push({
          url: `/${this.url_menu}`,
          label: routeData.breadcrumb?.label ? routeData.breadcrumb.label : "",
          params
        });
      });
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.menuSubscription.unsubscribe();
    this.subscription.unsubscribe();
  }

  add() {
    console.log(this.url_menu,this.link);
    
    this.router.navigate([`/${this.url_menu}`, this.link]);
  }

  navigate(urlArray: any) {
    console.log(urlArray);
    
    this.router.navigate(urlArray);
  }

  /*   back() {
      const { back } = window.history.state;
  
      if (back) {
        this.router.navigate([back], { relativeTo: this.activatedRoute });
        return;
      }
  
      this.location.back();
    } */

}
