import { _MatTabLinkBase } from "@angular/material/tabs";
import { Routes } from "@angular/router";
import { CreateAndEditTypeNewComponent } from "./create-and-edit-type-new/create-and-edit-type-new.component";
import { TypeNewComponent } from "./type-new.component";

export const TypeNewsRouting: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        data: {
          breadcrumb: {
            label: "Tipos de Novedades",
          },
          skipPermission: true,
        },
        component: TypeNewComponent,
      },
      {
        path: "crear",
        data: {
          breadcrumbAnt: {
            label: "Tipos de Novedades",
            url: "inicio/type-new",
            params: [],
          },
          breadcrumb: {
            label: "Crear Tipo de Novedad",
          },
          skipPermission: true,
        },
        component: CreateAndEditTypeNewComponent,
      },
      {
        path: ":id",
        data: {
          breadcrumbAnt: {
            label: "Tipos de Novedades",
            url: "inicio/type-new",
            params: [],
          },
          breadcrumb: {
            label: "Editar Tipo de Novedad",
          },
          skipPermission: true,
        },
        component: CreateAndEditTypeNewComponent,
      },
    ],
  },
];
