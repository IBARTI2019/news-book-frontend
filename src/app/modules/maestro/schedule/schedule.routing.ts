import { Routes } from "@angular/router";
import { CreateAndEditScheduleComponent } from "./create-and-edit-schedule/create-and-edit-schedule.component";
import { ScheduleComponent } from "./schedule.component";

export const ScheduleRouting: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        data: {
          breadcrumb: {
            label: "Horarios",
          },
          skipPermission: true,
        },
        component: ScheduleComponent,
      },
      {
        path: "crear",
        data: {
          breadcrumbAnt: {
            label: "Horarios",
            url: "schedule",
            params: [],
          },
          breadcrumb: {
            label: "Crear Horario",
          },
          skipPermission: true,
        },
        component: CreateAndEditScheduleComponent,
      },
      {
        path: ":id",
        data: {
          breadcrumbAnt: {
            label: "Horarios",
            url: "schedule",
            params: [],
          },
          breadcrumb: {
            label: "Editar Horario",
          },
          skipPermission: true,
        },
        component: CreateAndEditScheduleComponent,
      },
    ],
  },
];
