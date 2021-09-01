import { _MatTabLinkBase } from "@angular/material/tabs";
import { Routes } from "@angular/router";
import { ADMIN } from 'app/constants';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { CreateAndEditPersonComponent } from './create-and-edit-person/create-and-edit-person.component';
import { PersonComponent } from './person.component';

export const PersonRouting: Routes = [
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
            label: "Personas",
          },
        },
        component: PersonComponent,
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
            label: "Personas",
            url: "person",
            params: [],
          },
          breadcrumb: {
            label: "Crear Persona",
          },
        },
        component: CreateAndEditPersonComponent,
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
            label: "Personas",
            url: "person",
            params: [],
          },
          breadcrumb: {
            label: "Editar Persona",
          },
        },
        component: CreateAndEditPersonComponent,
      },
    ],
  },
];
