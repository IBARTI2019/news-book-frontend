import { _MatTabLinkBase } from "@angular/material/tabs";
import { Routes } from "@angular/router";
import { CreateAndEditNewComponent } from "./create-and-edit-new/create-and-edit-new.component";
import { NewComponent } from "./new.component";
import { SelectNewComponent } from './select-new/select-new.component';

export const NewRouting: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        data: {
          breadcrumb: {
            label: "Seleccionar Tipo de Novedad",
          },
          omitirPermiso: true,
        },
        component: SelectNewComponent,
      },
      {
        path: "view",
        data: {
          breadcrumbAnt: {
            label: "Novedades",
            url: "inicio/new",
            params: [],
          },
          breadcrumb: {
            label: "Novedades",
          },
          omitirPermiso: true,
        },
        component: NewComponent,
      },
      {
        path: "crear/:template",
        data: {
          breadcrumbAnt: {
            label: "Novedades",
            url: "inicio/new/crear",
            params: [],
          },
          breadcrumb: {
            label: "Crear Novedad",
          },
          omitirPermiso: true,
        },
        component: CreateAndEditNewComponent,
      },
      {
        path: ":id",
        data: {
          breadcrumbAnt: {
            label: "Novedades",
            url: "inicio/new",
            params: [],
          },
          breadcrumb: {
            label: "Editar Novedades",
          },
          omitirPermiso: true,
        },
        component: CreateAndEditNewComponent,
      },
    ],
  },
];