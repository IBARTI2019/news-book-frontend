import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialsRouting } from './materials.routing';
import { MaterialsComponent } from './materials.component';
import { RouterModule } from '@angular/router';
import { CreateAndEditMaterialComponent } from './create-and-edit-material/create-and-edit-material.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CdkTableModule } from '@angular/cdk/table';
import { MatCardModule } from '@angular/material/card';
import { ComponentesModule } from 'app/componentes/componentes.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    MaterialsComponent,
    CreateAndEditMaterialComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(MaterialsRouting),
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
export class MaterialsModule { }
