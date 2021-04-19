import { Routes } from "@angular/router";
import { CreateAndEditMaterialComponent } from "./create-and-edit-material/create-and-edit-material.component";
import { MaterialsComponent } from "./materials.component";
import { _MatTabLinkBase } from '@angular/material/tabs';

export const MaterialsRouting: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        data: {
          breadcrumb: {
            label: "Materiales y Suministros",
          },
          omitirPermiso: true,
        },
        component: MaterialsComponent,
      },
      {
        path: "crear",
        data: {
          breadcrumbAnt: {
            label: "Materiales y Suministros",
            url: "inicio/materials",
            params: [],
          },
          breadcrumb: {
            label: "Crear Materiales",
          },
          omitirPermiso: true,
        },
        component: CreateAndEditMaterialComponent,
      },
      {
        path: ":id",
        data: {
          breadcrumbAnt: {
            label: "Materiales y Suministros",
            url: "inicio/materials",
            params: [],
          },
          breadcrumb: {
            label: "Editar Materiales",
          },
          omitirPermiso: true,
        },
        component: CreateAndEditMaterialComponent,
      },
    ],
  },
];
