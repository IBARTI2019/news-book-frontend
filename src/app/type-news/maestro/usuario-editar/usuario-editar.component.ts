import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from 'app/type-news/servicios/usuario.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { Clasifinews, Usuario } from 'app/type-news/servicios/interface';
import { clasifinewsService } from "app/type-news/servicios/clasifinews.service";



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
  clasifnews: Clasifinews[] = [];
  
  constructor(
    private usuarioService: UsuarioService,
    private serviceclasificacion:clasifinewsService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.fg = this.fb.group({});
  }


  ngOnInit() {
    this.id = this.route.snapshot.params.id;
    this.serviceclasificacion.list().subscribe((data: Clasifinews[]) => {
      this.clasifnews= data;
    });
    this.fg = this.fb.group({
      descripton: ['', Validators.required],
      id_classify: ['', Validators.required],
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
    this.router.navigate(['type-news/maestro']);
  }

  getUsuario() {
    this.usuarioService.get(this.id).subscribe(
      (data: Usuario) => {
        this.fg.get('descripton').setValue(data.descripton);
        this.fg.get('id_classify').setValue(data.id_classify);
        this.fg.get('status').setValue(data.status);     
      });
  }

  actualizar() {
    this.usuarioService.update(this.id, this.fg.value).subscribe(
      data => {
        this.toastr.success('Datos del Tipo de Novedad actualizado');
        this.submitted = false;
        this.fg.reset();
        this.router.navigate(['type-news/maestro']);
      },
      (result: any) => {
        this.errors = result.errors;
        this.toastr.error('No se pudo actualizar la informacion');
      }
    );
  }
}
