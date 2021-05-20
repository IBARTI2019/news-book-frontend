import { Routes } from '@angular/router';

import { DashboardComponent } from './dashboard.component';

export const DashboardRoutes: Routes = [
  {
    path: '',
    data: { skipPermission: true },
    redirectTo: 'inicio'
  }, {
    path: 'inicio',
    component: DashboardComponent
  }
];
