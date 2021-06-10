import { _MatTabLinkBase } from "@angular/material/tabs";
import { Routes } from "@angular/router";
import { CreateAndEditPersonComponent } from './create-and-edit-person/create-and-edit-person.component';
import { PersonComponent } from './person.component';

export const PersonRouting: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        data: {
          breadcrumb: {
            label: "Personas",
          },
          skipPermission: true,
        },
        component: PersonComponent,
      },
      {
        path: "crear",
        data: {
          breadcrumbAnt: {
            label: "Personas",
            url: "person",
            params: [],
          },
          breadcrumb: {
            label: "Crear Persona",
          },
          skipPermission: true,
        },
        component: CreateAndEditPersonComponent,
      },
      {
        path: ":id",
        data: {
          breadcrumbAnt: {
            label: "Personas",
            url: "person",
            params: [],
          },
          breadcrumb: {
            label: "Editar Persona",
          },
          skipPermission: true,
        },
        component: CreateAndEditPersonComponent,
      },
    ],
  },
];
