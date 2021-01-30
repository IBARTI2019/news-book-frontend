import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from 'app/type-persons/servicios/usuario.service';
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
      description: ['', Validators.required],
      priority: ['', Validators.required],
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
        this.toastr.success('Type persons creado con éxito');
        this.submitted = false;
        this.fg.reset();
        this.router.navigate(['type-persons/maestro']);
      },
      (result: any) => {
        this.errors = result.errors;
        this.toastr.error('No se pudo crear el type persons');
      }
    );
  }
}
