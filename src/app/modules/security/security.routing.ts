import { Routes } from '@angular/router';
import { UserEditComponent } from './user/user-edit/user-edit.component';
import { UserComponent } from './user/user.component';

export const SecurityRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'user',
                children: [
                    {
                        path: '',
                        data: {
                            breadcrumb: {
                                label: "Usuarios",
                            },
                            skipPermission: true,
                        },
                        component: UserComponent
                    },
                    {
                        path: 'crear',
                        data: {
                            breadcrumbAnt: {
                                label: "Usuarios",
                                url: "security/user",
                                params: [],
                            },
                            breadcrumb: {
                                label: "Crear Usuario",
                            },
                            skipPermission: true,
                        },
                        component: UserEditComponent
                    },
                    {
                        path: ':id',
                        data: {
                            breadcrumbAnt: {
                                label: "Usuarios",
                                url: "security/user",
                                params: [],
                            },
                            breadcrumb: {
                                label: "Actualizar Usuario",
                            },
                            skipPermission: true,
                        },
                        component: UserEditComponent
                    }
                ]
            }
        ]
    },
];
