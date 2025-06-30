import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccessEntriesCalendarComponent } from './components/access-calendar/access-calendar.component';
import { AccessGroupsComponent } from './components/access-group/access-group.component';
import { PersonAccessListComponent } from './components/person-access-list/person-access-list.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: AccessEntriesCalendarComponent,
        data: {
          breadcrumb: {
            label: "Calendario de Accesos",
          },
        }
       },
      {
        path: 'groups', component: AccessGroupsComponent,
        data: {
          breadcrumb: {
            label: "Grupos de Accesos",
          },
        }
       },
      {
        path: 'list', component: PersonAccessListComponent,
        data: {
          breadcrumb: {
            label: "Lista de Accesos",
          },
        }
       },
    ]
   },
  
  // Puedes agregar más rutas según sea necesario
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionAccesosRoutingModule { } 