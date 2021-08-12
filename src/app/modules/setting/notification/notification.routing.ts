import { Routes } from '@angular/router';
import { NotificationComponent } from "../notification/notification.component";
import { CreateAndEditNotificationComponent } from './create-and-edit-notification/create-and-edit-notification.component';

export const NotificationRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: "",
                data: {
                    breadcrumb: {
                        label: "Notificaciones",
                    },
                    skipPermission: true,
                },
                component: NotificationComponent,
            },
            {
                path: "crear",
                data: {
                    breadcrumbAnt: {
                        label: "Notificaiones",
                        url: "notification",
                        params: [],
                    },
                    breadcrumb: {
                        label: "Crear Notificación",
                    },
                    skipPermission: true,
                },
                component: CreateAndEditNotificationComponent,
            },
            {
                path: ":id",
                data: {
                    breadcrumbAnt: {
                        label: "Notificaciones",
                        url: "notification",
                        params: [],
                    },
                    breadcrumb: {
                        label: "Editar Notificación",
                    },
                    skipPermission: true,
                },
                component: CreateAndEditNotificationComponent,
            },
        ]
    },
];
