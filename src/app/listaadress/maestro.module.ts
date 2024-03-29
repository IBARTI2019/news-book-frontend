import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioComponent } from './maestro/usuario.component';
import { RouterModule } from '@angular/router';
import { GestionRoutes } from './maestro.routing';
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
import { ComponentesModule } from 'app/componentes/componentes.module';
import { UsuarioCrearComponent } from './maestro/usuario-crear/usuario-crear.component';
import { UsuarioEditarComponent } from './maestro/usuario-editar/usuario-editar.component';


@NgModule({
  declarations: [UsuarioComponent, UsuarioCrearComponent,UsuarioEditarComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(GestionRoutes),
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
    MatIconModule
  ]
})
export class MaestroModule { }
