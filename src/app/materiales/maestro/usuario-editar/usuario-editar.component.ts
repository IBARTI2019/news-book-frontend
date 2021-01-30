import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from 'app/materiales/servicios/usuario.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { Almacen, Usuario } from 'app/materiales/servicios/interface';
import { almacennService } from "app/materiales/servicios/almacenn.service";

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
  almacennews: Almacen[] = [];
  //roles: Roll[] = [];
  //sucursales: Sucursal[] = [];

  constructor(
    private usuarioService: UsuarioService,
    private almacennewservice: almacennService,
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
    this.almacennewservice.list().subscribe((data: Almacen[]) => {
      this.almacennews = data;
    });
    this.fg = this.fb.group({
      cod_material: ['', Validators.required],
      serial_material: ['', Validators.required],
      id_warehouse: ['', Validators.required],
      description: ['', Validators.required],
      stock: ['', Validators.required],
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
    this.router.navigate(['personas/maestro']);
  }

  getUsuario() {
    this.usuarioService.get(this.id).subscribe(
      (data: Usuario) => {
        this.fg.get('cod_material').setValue(data.cod_material);
        this.fg.get('serial_material').setValue(data.serial_material);
        this.fg.get('description').setValue(data.description);
        this.fg.get('status').setValue(data.status);
        this.fg.get('id_warehouse').setValue(data.id_warehouse);
        this.fg.get('stock').setValue(data.stock);
      });
  }

  actualizar() {
    this.usuarioService.update(this.id, this.fg.value).subscribe(
      data => {
        this.toastr.success('Datos Material  actualizado');
        this.submitted = false;
        this.fg.reset();
        this.router.navigate(['materiales/maestro']);
      },
      (result: any) => {
        this.errors = result.errors;
        this.toastr.error('No se pudo actualizar los Datos');
      }
    );
  }
}
