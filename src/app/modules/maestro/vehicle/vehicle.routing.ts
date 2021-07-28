import { _MatTabLinkBase } from "@angular/material/tabs";
import { Routes } from "@angular/router";
import { CreateAndEditVehicleComponent } from './create-and-edit-vehicle/create-and-edit-vehicle.component';
import { VehicleComponent } from "./vehicle.component";

export const VehicleRouting: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        data: {
          breadcrumb: {
            label: "Vehiculos",
          },
          skipPermission: true,
        },
        component: VehicleComponent,
      },
      {
        path: "crear",
        data: {
          breadcrumbAnt: {
            label: "Vehiculos",
            url: "vehicle",
            params: [],
          },
          breadcrumb: {
            label: "Crear Vehiculos",
          },
          skipPermission: true,
        },
        component: CreateAndEditVehicleComponent,
      },
      {
        path: ":id",
        data: {
          breadcrumbAnt: {
            label: "Vehiculos",
            url: "vehicle",
            params: [],
          },
          breadcrumb: {
            label: "Editar Vehiculos",
          },
          skipPermission: true,
        },
        component: CreateAndEditVehicleComponent,
      },
    ],
  },
];
