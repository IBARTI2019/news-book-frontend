import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewComponent } from './new.component';
import { CreateAndEditNewComponent } from './create-and-edit-new/create-and-edit-new.component';
import { SelectNewComponent } from './select-new/select-new.component';
import { RouterModule } from '@angular/router';
import { NewRouting } from "./new.routing"
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CdkTableModule } from '@angular/cdk/table';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ComponentesModule } from 'app/componentes/componentes.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'app/shared/shared.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ViewNewComponent } from './view-new/view-new.component';


@NgModule({
  declarations: [NewComponent, CreateAndEditNewComponent, SelectNewComponent, ViewNewComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(NewRouting),
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    CdkTableModule,
    MatCardModule,
    MatStepperModule,
    MatTabsModule,
    MatListModule,
    MatAutocompleteModule,
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
    MatTooltipModule,
    MatChipsModule,
    DragDropModule
  ]
})
export class NewModule { }
