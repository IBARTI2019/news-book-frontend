import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { CdkTableModule } from '@angular/cdk/table';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SecurityRoutes } from './security.routing';
import { UserComponent } from './user/user.component';
import { UserEditComponent } from './user/user-edit/user-edit.component';
import { MatCardModule } from '@angular/material/card';
import { ComponentesModule } from '../../componentes/componentes.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { GroupUserComponent } from './group-user/group-user.component';
import { GroupUserEditComponent } from './group-user/group-user-edit/group-user-edit.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';



@NgModule({
  declarations: [
    UserComponent,
    UserEditComponent,
    GroupUserComponent,
    GroupUserEditComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CdkTableModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(SecurityRoutes),
    MatCardModule,
    ComponentesModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatSelectModule,
    MatInputModule,
    MatTooltipModule,
    MatToolbarModule
  ]
})
export class SecurityModule { }
