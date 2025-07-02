import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { FlexLayoutModule } from '@angular/flex-layout';
import { GestionAccesosRoutingModule } from './gestion-accesos.routing';
import { AccessEntriesCalendarComponent, ConfirmDialogComponent } from './components/access-calendar/access-calendar.component';
import { AccessEntryFormComponent } from './components/access-form/access-form.component';
import { AccessGroupsComponent } from './components/access-group/access-group.component';
import { PersonAccessListComponent } from './components/person-access-list/person-access-list.component';
import { GroupFormComponent } from './components/group-form/group-form.component';
import { ComponentesModule } from '../../componentes/componentes.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
  
@NgModule({
  declarations: [
    AccessEntriesCalendarComponent,
    AccessEntryFormComponent,
    AccessGroupsComponent,
    PersonAccessListComponent,
    GroupFormComponent,
    ConfirmDialogComponent,
    PersonAccessListComponent 
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatCardModule,
    MatTableModule,
    MatListModule,
    MatTooltipModule,
    MatMenuModule,
    MatTabsModule,
    FlexLayoutModule,
    MatSlideToggleModule,
    ComponentesModule,
    MatAutocompleteModule,
    MatChipsModule,
    GestionAccesosRoutingModule
  ]
})
export class GestionAccesosModule { } 