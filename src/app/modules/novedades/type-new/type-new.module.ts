import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypeNewComponent } from './type-new.component';
import { CreateAndEditTypeNewComponent } from './create-and-edit-type-new/create-and-edit-type-new.component'
import { RouterModule } from '@angular/router';
import { TypeNewsRouting } from './type-new.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CdkTableModule } from '@angular/cdk/table';
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
import { SharedModule } from 'app/shared/shared.module';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
  declarations: [
    TypeNewComponent,
    CreateAndEditTypeNewComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(TypeNewsRouting),
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
    SharedModule,
    MatListModule,
    MatToolbarModule
  ]
})
export class TypeNewModule { }
