import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from 'app/news/servicios/usuario.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Almacen, Usuario } from 'app/news/servicios/interface';
import { almacennService } from "app/news/servicios/almacenn.service";
import {ThemePalette} from '@angular/material/core';
import {FormControl} from '@angular/forms';


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
  isLinear = false;
  almacennews: Almacen[] = [];
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  TercerFormGroup:FormGroup;
  isEditable = false;
  typesOfShoes: string[] = [];
  tabs = [] ;
  selected = new FormControl(0);

  constructor(
    private usuarioService: UsuarioService,
    private almacennewservice:almacennService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    
  ) {
    this.fg = this.fb.group({});
    this.firstFormGroup = this.fb.group({});
    this.secondFormGroup = this.fb.group({});
    this.TercerFormGroup = this.fb.group({});
    
  }


  ngOnInit() {
  
   this.almacennewservice.list().subscribe((data: Almacen[]) => {
      this.almacennews= data;
      
    });
    
    this.firstFormGroup = this.fb.group({
      ced_notifica: ['', Validators.required],
      nombres_apellidos: ['', Validators.required],
      notice: ['', Validators.required],
      id_type_news:['', Validators.required],
       
    }, {});
   this.secondFormGroup = this.fb.group({
     secondCtrl: ['', Validators.required],
       
    }, {});
    this.TercerFormGroup = this.fb.group({
     TercerCtrl: ['', Validators.required],
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
agregarlist() {
    this.submitted = true;
    if (this.fg.invalid) {
      this.submitted = false;
      return;
    }
   
    this.typesOfShoes.push(this.secondFormGroup.get('serial')?.value);
  }
  onReset() {
    this.submitted = false;
    this.fg.reset();
    this.router.navigate(['news/maestro']);
  }

  guardar() {
    this.usuarioService.add(this.firstFormGroup.value).subscribe(
      data => {
        this.toastr.success('Datos de la Novedad creada con éxito');
        this.submitted = false;
        this.firstFormGroup.reset();
        this.router.navigate(['news/maestro']);
      },
      (result: any) => {
        this.errors = result.errors;
        this.toastr.error('No se pudo crear los datos');
      }
    );
  }
}
