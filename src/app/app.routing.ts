import { Routes } from "@angular/router";

import { FullComponent } from "./layouts/full/full.component";
import { LoginComponent } from "./seguridad/login/login.component";
import { NotFountComponent } from "./shared/not-fount/not-fount.component";
import { PermisoGuard } from "./utils/permiso.guard";

export const AppRoutes: Routes = [
  {
    path: "",
    canActivateChild: [PermisoGuard],
    runGuardsAndResolvers: "always",
    children: [
      {
        path: "",
        component: LoginComponent,
        data: { omitirPermiso: true },
      },
      {
        path: "inicio",
        component: FullComponent,
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
            path: "seguridad",
            loadChildren: () =>
              import("app/seguridad/seguridad.module").then(
                (m) => m.SeguridadModule
              ),
          },
        ],
      },
    ],
  },
  {
    path: "**",
    component: NotFountComponent,
  },
];
