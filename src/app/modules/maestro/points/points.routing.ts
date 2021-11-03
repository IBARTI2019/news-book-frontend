import { Routes } from "@angular/router";
import { _MatTabLinkBase } from "@angular/material/tabs";
import { NgxPermissionsGuard } from "ngx-permissions";
import { ADMIN, SUPERVISOR, USER } from "../../../constants";
import { PointsComponent } from "./points.component";
import { CreateAndEditPointComponent } from "./create-and-edit-point/create-and-edit-point.component";

export const PointsRouting: Routes = [
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
            label: "Puntos",
          },
        },
        component: PointsComponent,
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
            label: "Puntos",
            url: "points",
            params: [],
          },
          breadcrumb: {
            label: "Crear Punto",
          },
        },
        component: CreateAndEditPointComponent,
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
            label: "Puntos",
            url: "points",
            params: [],
          },
          breadcrumb: {
            label: "Editar Punto",
          },
        },
        component: CreateAndEditPointComponent,
      },
    ],
  },
];
