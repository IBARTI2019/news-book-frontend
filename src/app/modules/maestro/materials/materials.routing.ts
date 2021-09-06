import { Routes } from "@angular/router";
import { CreateAndEditMaterialComponent } from "./create-and-edit-material/create-and-edit-material.component";
import { MaterialsComponent } from "./materials.component";
import { _MatTabLinkBase } from "@angular/material/tabs";
import { NgxPermissionsGuard } from "ngx-permissions";
import { ADMIN, SUPERVISOR, USER } from "app/constants";

export const MaterialsRouting: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: [ADMIN, USER, SUPERVISOR],
            redirectTo: "/",
          },
          breadcrumb: {
            label: "Materiales y Suministros",
          },
        },
        component: MaterialsComponent,
      },
      {
        path: "crear",
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: [ADMIN, USER, SUPERVISOR],
            redirectTo: "/",
          },
          breadcrumbAnt: {
            label: "Materiales y Suministros",
            url: "materials",
            params: [],
          },
          breadcrumb: {
            label: "Crear Materiales",
          },
        },
        component: CreateAndEditMaterialComponent,
      },
      {
        path: ":id",
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: [ADMIN, USER, SUPERVISOR],
            redirectTo: "/",
          },
          breadcrumbAnt: {
            label: "Materiales y Suministros",
            url: "materials",
            params: [],
          },
          breadcrumb: {
            label: "Editar Materiales",
          },
        },
        component: CreateAndEditMaterialComponent,
      },
    ],
  },
];
