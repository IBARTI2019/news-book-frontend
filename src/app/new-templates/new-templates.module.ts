import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CdkTableModule } from '@angular/cdk/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TemplateOneComponent } from './template-one/template-one.component';
import { TemplateTwoComponent } from './template-two/template-two.component';
import { TemplateThreeComponent } from './template-three/template-three.component';
import { TemplateFourComponent } from './template-four/template-four.component';
import { TemplateFiveComponent } from './template-five/template-five.component';
import { TemplateSixComponent } from './template-six/template-six.component';
import { TemplateSevenComponent } from './template-seven/template-seven.component';
import { TemplateEightComponent } from './template-eight/template-eight.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';

@NgModule({
  declarations: [
    TemplateOneComponent,
    TemplateTwoComponent,
    TemplateThreeComponent,
    TemplateFourComponent,
    TemplateFiveComponent,
    TemplateSixComponent,
    TemplateSevenComponent,
    TemplateEightComponent,
  ],
  exports: [
    TemplateOneComponent,
    TemplateTwoComponent,
    TemplateThreeComponent,
    TemplateFourComponent,
    TemplateFiveComponent,
    TemplateSixComponent,
    TemplateSevenComponent,
    TemplateEightComponent,
  ],
  imports: [
    CommonModule,
    DataTablesModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    CdkTableModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatGridListModule,
    MatInputModule,
    MatSortModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatListModule,
  ],
  entryComponents: [],
  providers: []
})

export class NewTemplatesModule { }
