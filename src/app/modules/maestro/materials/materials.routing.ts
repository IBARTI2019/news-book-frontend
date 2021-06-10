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
          skipPermission: true,
        },
        component: MaterialsComponent,
      },
      {
        path: "crear",
        data: {
          breadcrumbAnt: {
            label: "Materiales y Suministros",
            url: "materials",
            params: [],
          },
          breadcrumb: {
            label: "Crear Materiales",
          },
          skipPermission: true,
        },
        component: CreateAndEditMaterialComponent,
      },
      {
        path: ":id",
        data: {
          breadcrumbAnt: {
            label: "Materiales y Suministros",
            url: "materials",
            params: [],
          },
          breadcrumb: {
            label: "Editar Materiales",
          },
          skipPermission: true,
        },
        component: CreateAndEditMaterialComponent,
      },
    ],
  },
];
