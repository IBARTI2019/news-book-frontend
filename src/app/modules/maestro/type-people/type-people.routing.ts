import { _MatTabLinkBase } from "@angular/material/tabs";
import { Routes } from "@angular/router";
import { ADMIN } from 'app/constants';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { CreateAndEditTypePeopleComponent } from "./create-and-edit-type-people/create-and-edit-type-people.component";
import { TypePeopleComponent } from "./type-people.component";

export const TypePeopleRouting: Routes = [
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
            label: "Tipoe de Personas",
          },
        },
        component: TypePeopleComponent,
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
            label: "Tipo de Personas",
            url: "type-people",
            params: [],
          },
          breadcrumb: {
            label: "Crear Tipo",
          },
        },
        component: CreateAndEditTypePeopleComponent,
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
            label: "Tipo de Personas",
            url: "type-people",
            params: [],
          },
          breadcrumb: {
            label: "Editar Tipo",
          },
        },
        component: CreateAndEditTypePeopleComponent,
      },
    ],
  },
];
