import { _MatTabLinkBase } from "@angular/material/tabs";
import { Routes } from "@angular/router";
import { ADMIN, AUDITOR, SUPERVISOR, USER } from 'app/constants';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { CreateAndEditNewComponent } from "./create-and-edit-new/create-and-edit-new.component";
import { NewComponent } from "./new.component";
import { SelectNewComponent } from './select-new/select-new.component';

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
        data: {
          permissions: {
            only: [ADMIN, USER, SUPERVISOR, AUDITOR],
          },
          breadcrumbAnt: {
            label: "Novedades",
            url: "new",
            params: [],
          },
          breadcrumb: {
            label: "Novedades",
          },
          skipPermission: true,
        },
        component: NewComponent,
      },
      {
        path: "crear/:idTN",
        data: {
          permissions: {
            only: [ADMIN, USER, SUPERVISOR],
            redirectTo: '/new/view'
          },
          breadcrumbAnt: {
            label: "Novedades",
            url: "new/crear",
            params: [],
          },
          breadcrumb: {
            label: "Crear Novedad",
          },
          skipPermission: true,
        },
        component: CreateAndEditNewComponent,
      },
      {
        path: "editar/:id",
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
            label: "Editar Novedades",
          },
          skipPermission: true,
        },
        component: CreateAndEditNewComponent,
      },
    ],
  },
];
