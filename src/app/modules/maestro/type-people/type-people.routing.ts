import { _MatTabLinkBase } from "@angular/material/tabs";
import { Routes } from "@angular/router";
import { TypePeopleComponent } from './type-people.component';

export const GestionRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        data: {
          breadcrumb: {
            label: "Tipoe de Personas",
          },
          omitirPermiso: true,
        },
        component: TypePeopleComponent,
      },
      {
        path: "crear",
        data: {
          breadcrumbAnt: {
            label: "Tipo de Personas",
            url: "inicio/type-people",
            params: [],
          },
          breadcrumb: {
            label: "Crear Tipo",
          },
          omitirPermiso: true,
        },
        component: UsuarioCrearComponent,
      },
      {
        path: ":id",
        data: {
          breadcrumbAnt: {
            label: "Tipo de Personas",
            url: "inicio/type-people",
            params: [],
          },
          breadcrumb: {
            label: "Editar Tipo",
          },
          omitirPermiso: true,
        },
        component: UsuarioEditarComponent,
      },
    ],
  },
];
