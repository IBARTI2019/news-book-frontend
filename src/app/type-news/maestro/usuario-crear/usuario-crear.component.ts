import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from 'app/type-news/servicios/usuario.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Clasifinews, Usuario } from 'app/type-news/servicios/interface';
import { clasifinewsService } from "app/type-news/servicios/clasifinews.service";


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
  clasifnews: Clasifinews[] = [];
  constructor(
    private usuarioService: UsuarioService,
    private serviceclasificacion:clasifinewsService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.fg = this.fb.group({});
  }


  ngOnInit() {
    this.serviceclasificacion.list().subscribe((data: Clasifinews[]) => {
      this.clasifnews= data;
    });
    this.fg = this.fb.group({
      descripton: ['', Validators.required],
      id_classify: ['', Validators.required],
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
    this.router.navigate(['type-persons/maestro']);
  }

  guardar() {
    this.usuarioService.add(this.fg.value).subscribe(
      data => {
        this.toastr.success('Type News creado con éxito');
        this.submitted = false;
        this.fg.reset();
        this.router.navigate(['type-news/maestro']);
      },
      (result: any) => {
        this.errors = result.errors;
        this.toastr.error('No se pudo crear el Type News');
      }
    );
  }
}
