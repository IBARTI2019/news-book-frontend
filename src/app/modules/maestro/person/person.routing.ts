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
          omitirPermiso: true,
        },
        component: PersonComponent,
      },
      {
        path: "crear",
        data: {
          breadcrumbAnt: {
            label: "Personas",
            url: "inicio/person",
            params: [],
          },
          breadcrumb: {
            label: "Crear Persona",
          },
          omitirPermiso: true,
        },
        component: CreateAndEditPersonComponent,
      },
      {
        path: ":id",
        data: {
          breadcrumbAnt: {
            label: "Personas",
            url: "inicio/person",
            params: [],
          },
          breadcrumb: {
            label: "Editar Persona",
          },
          omitirPermiso: true,
        },
        component: CreateAndEditPersonComponent,
      },
    ],
  },
];