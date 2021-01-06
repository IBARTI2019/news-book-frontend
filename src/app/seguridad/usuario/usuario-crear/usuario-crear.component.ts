import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from 'app/seguridad/servicios/usuario.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';


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
  constructor(
    private usuarioService: UsuarioService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.fg = this.fb.group({});
  }


  ngOnInit() {
    this.fg = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      usuario: ['', Validators.required],
      status: [true, Validators.required],
      clave: ['', null],
      clave2: ['', null]
    }, {});
   
  }

  onSubmit() {
    this.submitted = true;
    if (this.fg.get('clave').value !== this.fg.get('clave2').value) {
      this.toastr.error("Las claves son diferentes");
      this.submitted = false;
      return;
    }
    if (this.fg.invalid) {
      this.submitted = false;
      return;
    }
    this.guardar();
  }

  onReset() {
    this.submitted = false;
    this.fg.reset();
    this.router.navigate(['seguridad/usuario']);
  }

  guardar() {
    this.usuarioService.add(this.fg.value).subscribe(
      data => {
        this.toastr.success('Usuario creado con éxito');
        this.submitted = false;
        this.fg.reset();
        this.router.navigate(['seguridad/usuario']);
      },
      (result: any) => {
        this.errors = result.errors;
        this.toastr.error('No se pudo crear el usuario');
      }
    );
  }
}
