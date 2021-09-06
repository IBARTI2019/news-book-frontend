import { _MatTabLinkBase } from "@angular/material/tabs";
import { Routes } from "@angular/router";
import { ADMIN, SUPERVISOR, USER } from 'app/constants';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { CreateAndEditComponent } from "./create-and-edit/create-and-edit.component";
import { WarehouseComponent } from "./warehouse.component";

export const WarehouseRoutes: Routes = [
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
            label: "Almacen",
          },
        },
        component: WarehouseComponent,
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
            label: "Almacen",
            url: "warehouse",
            params: [],
          },
          breadcrumb: {
            label: "Crear Almacen",
          },
        },
        component: CreateAndEditComponent,
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
            label: "Almacen",
            url: "warehouse",
            params: [],
          },
          breadcrumb: {
            label: "Editar Almacen",
          },
        },
        component: CreateAndEditComponent,
      },
    ],
  },
];
