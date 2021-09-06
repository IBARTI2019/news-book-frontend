import { _MatTabLinkBase } from "@angular/material/tabs";
import { Routes } from "@angular/router";
import { ADMIN } from 'app/constants';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { CreateAndEditTypeNewComponent } from "./create-and-edit-type-new/create-and-edit-type-new.component";
import { TypeNewComponent } from "./type-new.component";

export const TypeNewsRouting: Routes = [
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
            label: "Tipos de Novedades",
          },
        },
        component: TypeNewComponent,
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
            label: "Tipos de Novedades",
            url: "type-new",
            params: [],
          },
          breadcrumb: {
            label: "Crear Tipo de Novedad",
          },
        },
        component: CreateAndEditTypeNewComponent,
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
            label: "Tipos de Novedades",
            url: "type-new",
            params: [],
          },
          breadcrumb: {
            label: "Editar Tipo de Novedad",
          },
        },
        component: CreateAndEditTypeNewComponent,
      },
    ],
  },
];
