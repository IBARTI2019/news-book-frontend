import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from 'app/vehiculos/servicios/usuario.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { Usuario } from 'app/vehiculos/servicios/interface';
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
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      doc_ident: ['', Validators.required],
      placa_vehiculo: ['', Validators.required],
      status: [true, Validators.required],

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
    this.router.navigate(['vehiuclos/maestro']);
  }

  getUsuario() {
    this.usuarioService.get(this.id).subscribe(
      (data: Usuario) => {
        this.fg.get('name').setValue(data.name);
        this.fg.get('lastname').setValue(data.lastname);
        this.fg.get('status').setValue(data.status);
        this.fg.get('doc_ident').setValue(data.doc_ident);
        this.fg.get('placa_vehiculo').setValue(data.placa_vehiculo);
      });
  }

  actualizar() {
    this.usuarioService.update(this.id, this.fg.value).subscribe(
      data => {
        this.toastr.success('Datos Vehiculos actualizado');
        this.submitted = false;
        this.fg.reset();
        this.router.navigate(['vehiculos/maestro']);
      },
      (result: any) => {
        this.errors = result.errors;
        this.toastr.error('No se pudo actualizar los Datos');
      }
    );
  }
}
