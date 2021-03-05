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
        path: '',
        component: LoginComponent,
        data: { omitirPermiso: true },
      },
      {
        path: 'inicio',
        component: FullComponent,
        children: [
          {
            path: '',
            loadChildren: () => import('app/dashboard/dashboard.module').then(m => m.DashboardModule)
          },
          {
            path: 'materiales',
            loadChildren:
              () => import('app/materiales/maestro.module').then(m => m.MaestroModule)
          },
          {
            path: 'vehiculos',
            loadChildren:
              () => import('app/vehiculos/maestro.module').then(m => m.MaestroModule)
          },
           {
            path: 'news',
            loadChildren:
              () => import('app/news/maestro.module').then(m => m.MaestroModule)
          },
          {
            path: 'wharehouses',
            loadChildren:
              () => import('app/wharehouses/maestro.module').then(m => m.MaestroModule)
          },
          {
            path: 'classify-news',
            loadChildren:
              () => import('app/classify-news/maestro.module').then(m => m.MaestroModule)
          },
          {
            path: 'type-persons',
            loadChildren:
              () => import('app/type-persons/maestro.module').then(m => m.MaestroModule)
          },
          {
            path: 'type-news',
            loadChildren:
              () => import('app/type-news/maestro.module').then(m => m.MaestroModule)
          },
          {
            path: 'personas',
            loadChildren:
              () => import('app/personas/maestro.module').then(m => m.MaestroModule)
          },
          {
            path: 'plantillas',
            loadChildren:
              () => import('app/plantillas/maestro.module').then(m => m.MaestroModule)
          },
           {
            path: 'listemail',
            loadChildren:
              () => import('app/listemail/maestro.module').then(m => m.MaestroModule)
          },
          {
            path: 'listaadress',
            loadChildren:
              () => import('app/listaadress/maestro.module').then(m => m.MaestroModule)
          },
          {
            path: 'seguridad',
            loadChildren:
              () => import('app/seguridad/seguridad.module').then(m => m.SeguridadModule)
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
