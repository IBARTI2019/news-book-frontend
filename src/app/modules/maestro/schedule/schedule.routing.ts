import { Routes } from "@angular/router";
import { ADMIN } from 'app/constants';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { CreateAndEditScheduleComponent } from "./create-and-edit-schedule/create-and-edit-schedule.component";
import { ScheduleComponent } from "./schedule.component";

export const ScheduleRouting: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: [ADMIN],
            redirectTo: "/",
          },
          breadcrumb: {
            label: "Horarios",
          },
        },
        component: ScheduleComponent,
      },
      {
        path: "crear",
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: [ADMIN],
            redirectTo: "/",
          },
          breadcrumbAnt: {
            label: "Horarios",
            url: "schedule",
            params: [],
          },
          breadcrumb: {
            label: "Crear Horario",
          },
        },
        component: CreateAndEditScheduleComponent,
      },
      {
        path: ":id",
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: [ADMIN],
            redirectTo: "/",
          },
          breadcrumbAnt: {
            label: "Horarios",
            url: "schedule",
            params: [],
          },
          breadcrumb: {
            label: "Editar Horario",
          },
        },
        component: CreateAndEditScheduleComponent,
      },
    ],
  },
];
