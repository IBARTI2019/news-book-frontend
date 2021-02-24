import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from 'app/seguridad/servicios/usuario.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { Usuario } from 'app/seguridad/servicios/interface';
//import { RolService } from "app/seguridad/servicios/rol.service";
//import { SucursalService } from 'app/maestro/servicios/sucursal.service';
//import { Sucursal } from 'app/maestro/servicios/interface';

@Component({
  selector: 'app-usuario-editar',
  templateUrl: './usuario-editar.component.html',
  styleUrls: ['./usuario-editar.component.css']
})
export class UsuarioEditarComponent implements OnInit {
  fg: any | FormGroup;
  // modal variables
  submitted = false;
  errors: any;
  id: string = '';
  //roles: Roll[] = [];
  //sucursales: Sucursal[] = [];

  constructor(
    private usuarioService: UsuarioService,
    //private sucursalService: SucursalService,
    //private rolService: RolService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.fg = this.fb.group({});
  }


  ngOnInit() {
    this.id = this.route.snapshot.params.id;
    this.fg = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      user: [{ value: '', disabled: true }, Validators.required],
      status: [false, Validators.required],
      }, {});
    this.getUsuario();
  }

  onSubmit() {
    this.submitted = true;
    if (this.fg.invalid) {
      return;
    }
    this.actualizar();
  }

  onReset() {
    this.submitted = false;
    this.fg.reset();
    this.router.navigate(['inicio/seguridad/usuario']);
  }

  getUsuario() {
    this.usuarioService.get(this.id).subscribe(
      (data: Usuario) => {
        this.fg.get('firstName').setValue(data.firstName);
        this.fg.get('lastName').setValue(data.lastName);
        this.fg.get('status').setValue(data.status);
        this.fg.get('user').setValue(data.user);
        
      });
  }

  actualizar() {
    this.usuarioService.update(this.id, this.fg.value).subscribe(
      data => {
        this.toastr.success('Usuario actualizado');
        this.submitted = false;
        this.fg.reset();
        this.router.navigate(['inicio/seguridad/usuario']);
      },
      (result: any) => {
        this.errors = result.errors;
        this.toastr.error('No se pudo actualizar el usuario');
      }
    );
  }
}
