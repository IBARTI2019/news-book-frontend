import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from 'app/personas/servicios/usuario.service';
import { TipopersonaService } from 'app/personas/servicios/tipopersonas.service';
import { Tipopersona } from 'app/personas/servicios/interface';
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
  listap: Tipopersona[] = [];
  constructor(
    private usuarioService: UsuarioService,
    private servicepersonat:TipopersonaService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.fg = this.fb.group({});
  }


  ngOnInit() {
   this.servicepersonat.list().subscribe((data: Tipopersona[]) => {
      this.listap= data;
    });
    this.fg = this.fb.group({
      cod_person: ['', Validators.required],
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      doc_ident: ['', Validators.required],
      addres: ['', Validators.required],
      phono: ['', Validators.required],
      movil: ['', Validators.required],
      id_type_person:['', Validators.required],
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
    this.router.navigate(['personas/maestro']);
  }

  guardar() {
    this.usuarioService.add(this.fg.value).subscribe(
      data => {
        this.toastr.success('Datos de la Persona creado con éxito');
        this.submitted = false;
        this.fg.reset();
        this.router.navigate(['personas/maestro']);
      },
      (result: any) => {
        this.errors = result.errors;
        this.toastr.error('No se pudo crear los datos de la persona');
      }
    );
  }
}
