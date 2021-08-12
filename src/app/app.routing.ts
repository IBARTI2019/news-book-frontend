import { Routes } from "@angular/router";

import { FullComponent } from "./layouts/full/full.component";
import { LoginComponent } from "./seguridad/login/login.component";
import { NotFoundComponent } from "./shared/not-found/not-found.component";
import { PermisoGuard } from "./utils/permiso.guard";
import { ADMIN, VIEW } from "./constants";

export const AppRoutes: Routes = [
  {
    path: "",
    canActivateChild: [PermisoGuard],
    runGuardsAndResolvers: "always",
    children: [
      {
        path: "",
        component: LoginComponent,
        data: { skipPermission: true },
      },
      {
        path: "",
        component: FullComponent,
        data: { skipPermission: true, giveAccess: [ADMIN, VIEW] },
        canActivateChild: [PermisoGuard],
        children: [
          {
            path: "",
            loadChildren: () =>
              import("app/dashboard/dashboard.module").then(
                (m) => m.DashboardModule
              ),
          },
          {
            path: "materials",
            loadChildren: () =>
              import("app/modules/maestro/materials/materials.module").then(
                (m) => m.MaterialsModule
              ),
          },
          {
            path: "vehicle",
            loadChildren: () =>
              import("app/modules/maestro/vehicle/vehicle.module").then(
                (m) => m.VehicleModule
              ),
          },
          {
            path: "new",
            loadChildren: () =>
              import("app/modules/novedades/new/new.module").then(
                (m) => m.NewModule
              ),
          },
          {
            path: "warehouse",
            loadChildren: () =>
              import("app/modules/maestro/warehouse/warehouse.module").then(
                (m) => m.WarehouseModule
              ),
          },
          {
            path: "type-people",
            loadChildren: () =>
              import("app/modules/maestro/type-people/type-people.module").then(
                (m) => m.TypePeopleModule
              ),
          },
          {
            path: "type-new",
            loadChildren: () =>
              import("app/modules/novedades/type-new/type-new.module").then(
                (m) => m.TypeNewModule
              ),
          },
          {
            path: "person",
            loadChildren: () =>
              import("app/modules/maestro/person/person.module").then(
                (m) => m.PersonModule
              ),
          },
          {
            path: "listemail",
            loadChildren: () =>
              import("app/listemail/maestro.module").then(
                (m) => m.MaestroModule
              ),
          },
          {
            path: "listaadress",
            loadChildren: () =>
              import("app/listaadress/maestro.module").then(
                (m) => m.MaestroModule
              ),
          },
          {
            path: "schedule",
            loadChildren: () =>
              import("app/modules/maestro/schedule/schedule.module").then(
                (m) => m.ScheduleModule
              ),
          }, {
            path: 'security',
            loadChildren: () =>
              import("app/modules/security/security.module").then(
                (m) => m.SecurityModule
              )
          }
          , {
            path: 'notification',
            loadChildren: () =>
              import("app/modules/setting/notification/notification.module").then(
                (m) => m.NotificationModule
              )
          }
        ],
      },
    ],
  },
  {
    path: "**",
    component: NotFoundComponent,
  },
];
