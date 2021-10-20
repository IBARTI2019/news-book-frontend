import { _MatTabLinkBase } from "@angular/material/tabs";
import { Routes } from "@angular/router";
import { ADMIN, AUDITOR, SUPERVISOR, USER } from 'app/constants';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { CreateAndEditNewComponent } from "./create-and-edit-new/create-and-edit-new.component";
import { NewComponent } from "./new.component";
import { SelectNewComponent } from './select-new/select-new.component';
import { ViewNewComponent } from "./view-new/view-new.component";

export const NewRouting: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: [ADMIN, USER, SUPERVISOR],
            redirectTo: '/new/view'
          },
          breadcrumb: {
            label: "Seleccionar Tipo de Novedad",
          },
        },
        component: SelectNewComponent,
      },
      {
        path: "view",
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: [ADMIN, USER, SUPERVISOR, AUDITOR],
          },
          breadcrumb: {
            label: "Novedades",
          },
        },
        component: NewComponent,
      },
      {
        path: "crear/:idTN",
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: [ADMIN, USER, SUPERVISOR],
            redirectTo: '/new/view'
          },
          breadcrumbAnt: {
            label: "Novedades",
            url: "new",
            params: [],
          },
          breadcrumb: {
            label: "Crear Novedad",
          },
        },
        component: CreateAndEditNewComponent,
      },
      {
        path: ":idTN",
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: [ADMIN, USER, SUPERVISOR],
            redirectTo: '/new/view'
          },
          breadcrumbAnt: {
            label: "Novedades",
            url: "new",
            params: [],
          },
          breadcrumb: {
            label: "Editar Novedad",
          },
        },
        component: CreateAndEditNewComponent,
      },
      {
        path: "view/:id",
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: [ADMIN, USER, SUPERVISOR, AUDITOR],
            redirectTo: '/new/view'
          },
          breadcrumbAnt: {
            label: "Novedades",
            url: "new",
            params: [],
          },
          breadcrumb: {
            label: "Ver Novedad",
          },
        },
        component: ViewNewComponent,
      },
    ],
  },
];
