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
          skipPermission: true,
        },
        component: SelectNewComponent,
      },
      {
        path: "view",
        data: {
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
