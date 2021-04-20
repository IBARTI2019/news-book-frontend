import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypePeopleComponent } from './type-people.component';
import { CreateAndEditTypePeopleComponent } from './create-and-edit-type-people/create-and-edit-type-people.component'
import { TypePeopleRouting } from './type-people.routing';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ComponentesModule } from '../../../componentes/componentes.module';
import { CdkTableModule } from '@angular/cdk/table';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [
    TypePeopleComponent,
    CreateAndEditTypePeopleComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(TypePeopleRouting),
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    CdkTableModule,
    MatCardModule,
    ComponentesModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatCheckboxModule,
    MatSelectModule,
    MatIconModule
  ]
})
export class TypePeopleModule { }
