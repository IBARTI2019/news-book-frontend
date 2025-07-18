import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { MatTableModule } from '@angular/material/table';
import { CardHeaderComponent } from "./card-header/card-header.component";
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CdkTableModule } from '@angular/cdk/table';
import { GenericTableComponent } from './generic-table/generic-table.component';
import { GenericTableComponentf } from './tablefree/generic-table.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatTableResponsiveDirective } from './mat-table-responsive/mat-table-responsive.directive';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { ConfirmDialogService } from './confirm-dialog/confirm-dialog.service';
import { MatDialogModule } from '@angular/material/dialog';
import { PermisoDirective } from './permiso.directive';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NewContainerComponent } from './new-container/new-container.component';
import { ValidateOesvicaTokenComponent } from './validate-oesvica-token/validate-oesvica-token.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfoDialogComponent } from './info-dialog/info-dialog.component';
import { InfoButtonComponent } from './info-button/info-button.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DynamicFormComponent } from './dymamic-form/dymamic-form.component';
import { DynamicControlsComponent } from './dynamic-controls/dynamic-controls.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SharedModule } from '../shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { NewHeaderComponent } from './new-header/new-header.component';
import { DemoMaterialModule } from '../demo-material-module';
import { AttachedFileComponent } from './attached-file/attached-file.component';
import { ErrataComponent } from './errata/errata.component';
import { BlacklistAlertComponent } from './blacklist-alert/blacklist-alert.component';

export const entryComponentes = [
  ConfirmDialogComponent,
  ValidateOesvicaTokenComponent,
  InfoDialogComponent,
];

@NgModule({
  declarations: [
    CardHeaderComponent,
    GenericTableComponent,
    GenericTableComponentf,
    MatTableResponsiveDirective,
    ConfirmDialogComponent,
    PermisoDirective,
    NewContainerComponent,
    ValidateOesvicaTokenComponent,
    InfoDialogComponent,
    InfoButtonComponent,
    DynamicFormComponent,
    DynamicControlsComponent,
    NewHeaderComponent,
    AttachedFileComponent,
    ErrataComponent,
    BlacklistAlertComponent
  ],
  exports: [
    GenericTableComponent,
    CardHeaderComponent,
    NewContainerComponent,
    MatTableResponsiveDirective,
    ConfirmDialogComponent,
    PermisoDirective,
    ValidateOesvicaTokenComponent,
    InfoButtonComponent,
    DynamicFormComponent,
    DynamicControlsComponent,
    NewHeaderComponent,
    AttachedFileComponent,
    ErrataComponent
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
    MatTooltipModule,
    MatSlideToggleModule,
    MatSelectModule,
    SharedModule,
    MatChipsModule,
    DragDropModule,
    FlexLayoutModule,
    MatSelectModule,
    MatDatepickerModule,
    NgxMaterialTimepickerModule,
    DemoMaterialModule
  ],
  entryComponents: entryComponentes,
  providers: [ConfirmDialogService]
})
export class ComponentesModule {
}
