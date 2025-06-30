import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccessEntriesCalendarComponent } from './components/access-calendar/access-calendar.component';
import { AccessGroupsComponent } from './components/access-group/access-group.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: AccessEntriesCalendarComponent },
      { path: 'groups', component: AccessGroupsComponent },
    ]
   },
  
  // Puedes agregar más rutas según sea necesario
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionAccesosRoutingModule { } 