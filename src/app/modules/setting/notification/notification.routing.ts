import { Routes } from "@angular/router";
import { ADMIN } from 'app/constants';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { NotificationComponent } from "../notification/notification.component";
import { CreateAndEditNotificationComponent } from "./create-and-edit-notification/create-and-edit-notification.component";

export const NotificationRoutes: Routes = [
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
            label: "Notificaciones",
          },
        },
        component: NotificationComponent,
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
            label: "Notificaiones",
            url: "notification",
            params: [],
          },
          breadcrumb: {
            label: "Crear Notificación",
          },
        },
        component: CreateAndEditNotificationComponent,
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
            label: "Notificaciones",
            url: "notification",
            params: [],
          },
          breadcrumb: {
            label: "Editar Notificación",
          },
        },
        component: CreateAndEditNotificationComponent,
      },
    ],
  },
];
