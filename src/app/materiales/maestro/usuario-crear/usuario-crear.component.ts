import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from 'app/materiales/servicios/usuario.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Almacen, Usuario } from 'app/materiales/servicios/interface';
import { almacennService } from "app/materiales/servicios/almacenn.service";

@Component({
  selector: 'app-usuario-crear',
  templateUrl: './usuario-crear.component.html',
  styleUrls: ['./usuario-crear.component.css']
})
export class UsuarioCrearComponent implements OnInit {
  fg: any | FormGroup;
  // modal variables
  submitted = false;
  errors: any;
  hide = true;
  hide2 = true;
  almacennews: Almacen[] = [];
  constructor(
    private usuarioService: UsuarioService,
    private almacennewservice: almacennService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.fg = this.fb.group({});
  }


  ngOnInit() {
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

  }

  onSubmit() {
    this.submitted = true;
    if (this.fg.invalid) {
      this.submitted = false;
      return;
    }
    this.guardar();
  }

  onReset() {
    this.submitted = false;
    this.fg.reset();
    this.router.navigate(['materiales/maestro']);
  }

  guardar() {
    this.usuarioService.add(this.fg.value).subscribe(
      data => {
        this.toastr.success('Datos del Material creado con éxito');
        this.submitted = false;
        this.fg.reset();
        this.router.navigate(['materiales/maestro']);
      },
      (result: any) => {
        this.errors = result.errors;
        this.toastr.error('No se pudo crear los datos');
      }
    );
  }
}
