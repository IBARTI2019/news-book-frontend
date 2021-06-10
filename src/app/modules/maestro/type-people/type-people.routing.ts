import { _MatTabLinkBase } from "@angular/material/tabs";
import { Routes } from "@angular/router";
import { CreateAndEditVehicleComponent } from "../vehicle/create-and-edit-vehicle/create-and-edit-vehicle.component";
import { CreateAndEditTypePeopleComponent } from "./create-and-edit-type-people/create-and-edit-type-people.component";
import { TypePeopleComponent } from "./type-people.component";

export const TypePeopleRouting: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        data: {
          breadcrumb: {
            label: "Tipoe de Personas",
          },
          skipPermission: true,
        },
        component: TypePeopleComponent,
      },
      {
        path: "crear",
        data: {
          breadcrumbAnt: {
            label: "Tipo de Personas",
            url: "type-people",
            params: [],
          },
          breadcrumb: {
            label: "Crear Tipo",
          },
          skipPermission: true,
        },
        component: CreateAndEditTypePeopleComponent,
      },
      {
        path: ":id",
        data: {
          breadcrumbAnt: {
            label: "Tipo de Personas",
            url: "type-people",
            params: [],
          },
          breadcrumb: {
            label: "Editar Tipo",
          },
          skipPermission: true,
        },
        component: CreateAndEditTypePeopleComponent,
      },
    ],
  },
];
