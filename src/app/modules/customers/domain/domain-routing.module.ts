import { Routes } from '@angular/router';
import { ADMIN } from '../../../constants';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { CreateAndEditDomainComponent } from './create-and-edit-domain/create-and-edit-domain.component';
import { DomainComponent } from './domain.component';


export const DomainsRouting: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: [ADMIN],
            redirectTo: "/",
          },
          breadcrumb: {
            label: "Dominios",
          },
        },
        component: DomainComponent,
      },
      {
        path: "crear",
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: [ADMIN],
            redirectTo: "/",
          },
          breadcrumbAnt: {
            label: "Dominios",
            url: "domains",
            params: [],
          },
          breadcrumb: {
            label: "Crear Dominio",
          },
        },
        component: CreateAndEditDomainComponent,
      },
      {
        path: ":id",
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: [ADMIN],
            redirectTo: "/",
          },
          breadcrumbAnt: {
            label: "Dominios",
            url: "domains",
            params: [],
          },
          breadcrumb: {
            label: "Editar Dominio",
          },
        },
        component: CreateAndEditDomainComponent,
      },
    ],
  },
];

