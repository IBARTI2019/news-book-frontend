import { NgModule } from '@angular/core';

import { MenuItems } from './menu-items/menu-items';
import { AccordionAnchorDirective, AccordionLinkDirective, AccordionDirective } from './accordion';
import { NotFoundComponent } from './not-found/not-found.component';
import { ChangingGuardStaffListComponent } from 'app/componentes/changing-guard-staff-list/changing-guard-staff-list.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { LayoutModule } from '@angular/cdk/layout';
import { DemoMaterialModule } from 'app/demo-material-module';


@NgModule({
  declarations: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
    NotFoundComponent,
    ChangingGuardStaffListComponent,
  ],
  exports: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
    NotFoundComponent,
    ChangingGuardStaffListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    NgxMaterialTimepickerModule,
    LayoutModule,
    DemoMaterialModule,
  ],
  providers: [MenuItems]
})
export class SharedModule { }
