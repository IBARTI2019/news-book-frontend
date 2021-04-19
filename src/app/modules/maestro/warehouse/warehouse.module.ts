import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WarehouseRoutes } from './warehouse.routing';
import { CdkTableModule } from '@angular/cdk/table';
import { FlexLayoutModule } from '@angular/flex-layout';
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
import { WarehouseComponent } from './warehouse.component';
import { CreateAndEditComponent } from './create-and-edit/create-and-edit.component';

@NgModule({
  declarations: [
    WarehouseComponent,
    CreateAndEditComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(WarehouseRoutes),
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
    MatIconModule,
  ]
})
export class WarehouseModule { }
