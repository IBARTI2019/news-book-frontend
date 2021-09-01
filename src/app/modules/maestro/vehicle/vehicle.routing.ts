import { _MatTabLinkBase } from "@angular/material/tabs";
import { Routes } from "@angular/router";
import { ADMIN, SUPERVISOR, USER } from 'app/constants';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { CreateAndEditVehicleComponent } from './create-and-edit-vehicle/create-and-edit-vehicle.component';
import { VehicleComponent } from "./vehicle.component";

export const VehicleRouting: Routes = [
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
            label: "Vehiculos",
          },
        },
        component: VehicleComponent,
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
            label: "Vehiculos",
            url: "vehicle",
            params: [],
          },
          breadcrumb: {
            label: "Crear Vehiculos",
          },
        },
        component: CreateAndEditVehicleComponent,
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
            label: "Vehiculos",
            url: "vehicle",
            params: [],
          },
          breadcrumb: {
            label: "Editar Vehiculos",
          },
        },
        component: CreateAndEditVehicleComponent,
      },
    ],
  },
];
