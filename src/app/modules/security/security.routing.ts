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
                        data: {
                            breadcrumb: {
                                label: "Grupos",
                            },
                            skipPermission: true,
                        },
                        component: GroupUserComponent
                    },
                    {
                        path: 'crear',
                        data: {
                            breadcrumbAnt: {
                                label: "Grupos",
                                url: "security/group",
                                params: [],
                            },
                            breadcrumb: {
                                label: "Crear Grupos",
                            },
                            skipPermission: true,
                        },
                        component: GroupUserEditComponent
                    },
                    {
                        path: ':id',
                        data: {
                            breadcrumbAnt: {
                                label: "Grupos",
                                url: "security/group",
                                params: [],
                            },
                            breadcrumb: {
                                label: "Actualizar Grupos",
                            },
                            skipPermission: true,
                        },
                        component: GroupUserEditComponent
                    }
                ]
            }
        ]
    },
];
