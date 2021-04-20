import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PersonRouting } from "./person.routing";
import { CdkTableModule } from "@angular/cdk/table";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { ComponentesModule } from "../../../componentes/componentes.module";
import { RouterModule } from "@angular/router";
import { PersonComponent } from "./person.component";
import { CreateAndEditPersonComponent } from "./create-and-edit-person/create-and-edit-person.component";

@NgModule({
  declarations: [PersonComponent, CreateAndEditPersonComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(PersonRouting),
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
  ],
})
export class PersonModule {}
