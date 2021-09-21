import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DynamicFormsRouting } from "./dynamic-forms.routing";
import { TestComponent } from './test/test.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ControlService } from './services/control.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ComponentesModule } from 'app/componentes/componentes.module';
import { FormatGeneratorComponent, ParamsControlDialogComponent } from './format-generator/format-generator.component';
import { MatChipsModule } from '@angular/material/chips';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [TestComponent, FormatGeneratorComponent, ParamsControlDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(DynamicFormsRouting),
    ReactiveFormsModule,
    MatCardModule,
    ComponentesModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatSelectModule,
    MatInputModule,
    MatTooltipModule,
    MatChipsModule,
    DragDropModule,
    MatDialogModule,
  ],
  entryComponents: [ParamsControlDialogComponent],
  providers: [ControlService]
})
export class DynamicFormsModule { }
