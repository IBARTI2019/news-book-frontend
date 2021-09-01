import { Routes } from "@angular/router";
import { UserEditComponent } from "./user/user-edit/user-edit.component";
import { UserComponent } from "./user/user.component";
import { GroupUserComponent } from "./group-user/group-user.component";
import { GroupUserEditComponent } from "./group-user/group-user-edit/group-user-edit.component";
import { NgxPermissionsGuard } from 'ngx-permissions';
import { ADMIN } from 'app/constants';
export const SecurityRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "user",
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: [ADMIN],
            redirectTo: "/",
          },
        },
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
                label: "Usuarios",
              },
            },
            component: UserComponent,
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
                label: "Usuarios",
                url: "security/user",
                params: [],
              },
              breadcrumb: {
                label: "Crear Usuario",
              },
            },
            component: UserEditComponent,
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
                label: "Usuarios",
                url: "security/user",
                params: [],
              },
              breadcrumb: {
                label: "Actualizar Usuario",
              },
            },
            component: UserEditComponent,
          },
        ],
      },
      {
        path: "group",
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: [ADMIN],
            redirectTo: "/",
          },
        },
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
                label: "Grupos",
              },
            },
            component: GroupUserComponent,
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
                label: "Grupos",
                url: "security/group",
                params: [],
              },
              breadcrumb: {
                label: "Crear Grupos",
              },
            },
            component: GroupUserEditComponent,
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
                label: "Grupos",
                url: "security/group",
                params: [],
              },
              breadcrumb: {
                label: "Actualizar Grupos",
              },
            },
            component: GroupUserEditComponent,
          },
        ],
      },
    ],
  },
];
