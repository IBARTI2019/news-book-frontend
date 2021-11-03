import { Routes } from "@angular/router";

import { FullComponent } from "./layouts/full/full.component";
import { LoginComponent } from "./seguridad/login/login.component";
import { NotFoundComponent } from "./shared/not-found/not-found.component";
import { AuthGuard } from "./utils/permiso.guard";
import { ADMIN, AUDITOR, SUPERVISOR, USER } from "./constants";
import { NgxPermissionsGuard } from 'ngx-permissions';
import { TestsComponent } from './tests/tests.component';

export const AppRoutes: Routes = [
  {
    path: "test",
    component: TestsComponent,
  },
  {
    path: "",
    canActivate: [AuthGuard],
    runGuardsAndResolvers: "always",
    children: [
      {
        path: "",
        component: FullComponent,
        data: {
          permissions: {
            only: [ADMIN]
          }
        },
        children: [
          {
            path: "",
            data: {
              permissions: {
                only: [ADMIN],
              }
            },
            loadChildren: () =>
              import("app/dashboard/dashboard.module").then(
                (m) => m.DashboardModule
              ),
          },
          {
            path: "materials",
            canLoad: [NgxPermissionsGuard],
            data: {
              permissions: {
                only: [ADMIN, USER, SUPERVISOR],
              }
            },
            loadChildren: () =>
              import("app/modules/maestro/materials/materials.module").then(
                (m) => m.MaterialsModule
              ),
          },
          {
            path: "vehicle",
            canLoad: [NgxPermissionsGuard],
            data: {
              permissions: {
                only: [ADMIN, USER, SUPERVISOR],
              }
            },
            loadChildren: () =>
              import("app/modules/maestro/vehicle/vehicle.module").then(
                (m) => m.VehicleModule
              ),
          },
          {
            path: "new",
            canLoad: [NgxPermissionsGuard],
            data: {
              permissions: {
                only: [ADMIN, AUDITOR, USER, SUPERVISOR],
              }
            },
            loadChildren: () =>
              import("app/modules/novedades/new/new.module").then(
                (m) => m.NewModule
              ),
          },
          {
            path: "warehouse",
            canLoad: [NgxPermissionsGuard],
            data: {
              permissions: {
                only: [ADMIN, SUPERVISOR],
              }
            },
            loadChildren: () =>
              import("app/modules/maestro/warehouse/warehouse.module").then(
                (m) => m.WarehouseModule
              ),
          },
          {
            path: "type-people",
            canLoad: [NgxPermissionsGuard],
            data: {
              permissions: {
                only: [ADMIN, SUPERVISOR],
              }
            },
            loadChildren: () =>
              import("app/modules/maestro/type-people/type-people.module").then(
                (m) => m.TypePeopleModule
              ),
          },
          {
            path: "type-new",
            canLoad: [NgxPermissionsGuard],
            data: {
              permissions: {
                only: [ADMIN],
              }
            },
            loadChildren: () =>
              import("app/modules/novedades/type-new/type-new.module").then(
                (m) => m.TypeNewModule
              ),
          },
          {
            path: "person",
            canLoad: [NgxPermissionsGuard],
            data: {
              permissions: {
                only: [ADMIN, USER, SUPERVISOR],
              }
            },
            loadChildren: () =>
              import("app/modules/maestro/person/person.module").then(
                (m) => m.PersonModule
              ),
          },
          {
            path: "listemail",
            canLoad: [NgxPermissionsGuard],
            data: {
              permissions: {
                only: [ADMIN],
              }
            },
            loadChildren: () =>
              import("app/listemail/maestro.module").then(
                (m) => m.MaestroModule
              ),
          },
          {
            path: "listaadress",
            canLoad: [NgxPermissionsGuard],
            data: {
              permissions: {
                only: [ADMIN],
              }
            },
            loadChildren: () =>
              import("app/listaadress/maestro.module").then(
                (m) => m.MaestroModule
              ),
          },
          {
            path: "schedule",
            canLoad: [NgxPermissionsGuard],
            data: {
              permissions: {
                only: [ADMIN],
              }
            },
            loadChildren: () =>
              import("app/modules/maestro/schedule/schedule.module").then(
                (m) => m.ScheduleModule
              ),
          }, {
            path: 'security',
            canLoad: [NgxPermissionsGuard],
            data: {
              permissions: {
                only: [ADMIN],
              }
            },
            loadChildren: () =>
              import("app/modules/security/security.module").then(
                (m) => m.SecurityModule
              )
          }
          , {
            path: 'notification',
            canLoad: [NgxPermissionsGuard],
            data: {
              permissions: {
                only: [ADMIN],
              }
            },
            loadChildren: () =>
              import("app/modules/setting/notification/notification.module").then(
                (m) => m.NotificationModule
              )
          },
          {
            path: "dynamic-forms",
            canLoad: [NgxPermissionsGuard],
            data: {
              permissions: {
                only: [ADMIN, USER, SUPERVISOR],
              }
            },
            loadChildren: () =>
              import("app/dynamic-forms/dynamic-forms.module").then(
                (m) => m.DynamicFormsModule
              ),
          },
          {
            path: "locations",
            canLoad: [NgxPermissionsGuard],
            data: {
              permissions: {
                only: [ADMIN, USER, SUPERVISOR],
              }
            },
            loadChildren: () =>
              import("app/modules/maestro/books/books.module").then(
                (m) => m.BooksModule
              ),
          },
          {
            path: "points",
            canLoad: [NgxPermissionsGuard],
            data: {
              permissions: {
                only: [ADMIN, USER, SUPERVISOR],
              }
            },
            loadChildren: () =>
              import("app/modules/maestro/points/points.module").then(
                (m) => m.PointsModule
              ),
          },
        ],
      },
    ],
  },
  {
    path: "sign-in",
    component: LoginComponent,
  },
  {
    path: "**",
    component: NotFoundComponent,
  },
];
