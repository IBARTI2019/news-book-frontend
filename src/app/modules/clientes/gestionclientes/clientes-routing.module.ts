import { Routes } from '@angular/router';
import { ADMIN } from '../../../constants';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { CreateAndEditClientescomponent } from './create-and-edit-clientes/create-and-edit-clientes.component';
import { ClientesComponent } from './clientes.component';


export const ClientesRouting: Routes = [
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
            label: "Clientes",
          },
        },
        component: ClientesComponent,
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
            label: "Clientes",
            url: "clientes",
            params: [],
          },
          breadcrumb: {
            label: "Crear Clientes",
          },
        },
        component: CreateAndEditClientescomponent,
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
            label: "Clientes",
            url: "clientes",
            params: [],
          },
          breadcrumb: {
            label: "Editar Clientes",
          },
        },
        component: CreateAndEditClientescomponent,
      },
    ],
  },
];

