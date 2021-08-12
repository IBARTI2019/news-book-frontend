import { Routes } from '@angular/router';
import { UserEditComponent } from './user/user-edit/user-edit.component';
import { UserComponent } from './user/user.component';
import { GroupUserComponent } from './group-user/group-user.component';
import { GroupUserEditComponent } from './group-user/group-user-edit/group-user-edit.component';
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
            },
            {
                path: 'group',
                children: [
                    {
                        path: '',
                        component: GroupUserComponent
                    },
                    {
                        path: 'crear',
                        component: GroupUserEditComponent
                    },
                    {
                        path: ':id',
                        component: GroupUserEditComponent
                    }
                ]
            }
        ]
    },
];
