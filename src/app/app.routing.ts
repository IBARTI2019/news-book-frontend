import { Routes } from '@angular/router';

import { FullComponent } from './layouts/full/full.component';
import { LoginComponent } from './seguridad/login/login.component';
import { NotFountComponent } from './shared/not-fount/not-fount.component';
import { PermisoGuard } from "./utils/permiso.guard";


export const AppRoutes: Routes = [
  {
    path: '',
    canActivateChild: [PermisoGuard],
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: 'login',
        component: LoginComponent,
        data: { omitirPermiso: true },
      },
      {
        path: '',
        component: FullComponent,
        children: [
          {
            path: '',
            loadChildren: () => import('app/dashboard/dashboard.module').then(m => m.DashboardModule)
          },
          {
            path: 'material',
            loadChildren:
              () => import('app/material-component/material.module').then(m => m.MaterialComponentsModule)
          },
          {
            path: 'gestion',
            loadChildren:
              () => import('app/gestion/gestion.module').then(m => m.GestionModule)
          }
        ]
      }
    ]
  },
  {
    path: '**',
    component: NotFountComponent
  }
];
