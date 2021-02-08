import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from 'app/news/servicios/usuario.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Almacen, Usuario } from 'app/news/servicios/interface';
import { almacennService } from "app/news/servicios/almacenn.service";
import {ThemePalette} from '@angular/material/core';
import {FormControl} from '@angular/forms';
import { values } from 'lodash';
import { Table2SheetOpts } from 'xlsx/types';
import { MatListModule} from '@angular/material/list';
import {map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';

export interface State {
  flag: string;
  name: string;
  population: string;
}
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
  tabs = ['First', 'Second', 'Third'];
  firstFormGroup: FormGroup;
  SecondFormGroup: FormGroup;
  TercerFormGroup:FormGroup;
  CuartoFormGroup:FormGroup;
  QuintoFormGroup:FormGroup;
  isEditable = false;
  typesOfShoes: string[] = [];
  selected = new FormControl(0);
  links: string[] = [];
  listapersonas: string[] = [];
  listavehiculos: string[] = [];
  lista4=[];
  lista3=[];
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  list2 = [ //right

        {id: 6, name: "Obj 6"},

        {id: 7, name: "Obj 7"},

        {id: 8, name: "Obj 8"},

        {id: 9, name: "Obj 9"},

        {id: 10, name: "Obj 10"},

      ]
      
  stateCtrl = new FormControl();
  filteredStates: Observable<State[]>;

  states: State[] = [
    {
      name: 'Carlos Blanco',
      population: 'carlosblanco@oesvica.com.ve',
      // https://commons.wikimedia.org/wiki/File:Flag_of_Arkansas.svg
      flag: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Flag_of_Arkansas.svg'
    },
    {
      name: 'Cirilo LInares',
      population: 'rakode33@gmail.com',
      // https://commons.wikimedia.org/wiki/File:Flag_of_California.svg
      flag: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Flag_of_California.svg'
    },
    {
      name: 'Alfredo Bracho',
      population: 'alfredobracho@oesvica.com.ve',
      // https://commons.wikimedia.org/wiki/File:Flag_of_Florida.svg
      flag: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Florida.svg'
    }
  ];    
  constructor(
    private usuarioService: UsuarioService,
    private almacennewservice:almacennService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    
    ) {
    this.fg = this.fb.group({});
    this.firstFormGroup = this.fb.group({});
    this.SecondFormGroup = this.fb.group({});
    this.TercerFormGroup = this.fb.group({});
    this.CuartoFormGroup = this.fb.group({});
    this.QuintoFormGroup = this.fb.group({});
    this.filteredStates = this.stateCtrl.valueChanges
      .pipe(
        startWith(''),
        map(state => state ? this._filterStates(state) : this.states.slice())
      );
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
   this.SecondFormGroup = this.fb.group({
     identificador: [''],
     descripcion: ['', ],
          
    }, {});
    this.TercerFormGroup = this.fb.group({
     doc_ident: ['', ],
     nombres_apellidos: ['', ],
    }, {});
    this.CuartoFormGroup = this.fb.group({
     placa_vehiculo: [''],
     cedulachofer: [''],
     nombrechofer: [''],
     
    }, {});
   this.QuintoFormGroup = this.fb.group({
     placa_vehiculo: ['', Validators.required],
     
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
  private _filterStates(value: string): State[] {
    const filterValue = value.toLowerCase();

    return this.states.filter(state => state.name.toLowerCase().indexOf(filterValue) === 0);
  }
 agregarlist() {
    var valor:string;
    valor =this.SecondFormGroup.get('identificador')?.value + "       " + this.SecondFormGroup.get('descripcion')?.value;
    this.links.push(valor);
    this.toastr.success( 'Agregado a la lista:' + this.SecondFormGroup.get('identificador')?.value); 
    valor= "";
    this.SecondFormGroup.get('identificador')?.setValue(valor);
    this.SecondFormGroup.get('descripcion')?.setValue(valor);
  }
 agregarpersonas() {
    var valor:string;
    valor =this.TercerFormGroup.get('doc_ident')?.value + "       " + this.TercerFormGroup.get('nombres_apellidos')?.value;
    this.listapersonas.push(valor);
    this.toastr.success( 'Agregado a la lista:' + this.TercerFormGroup.get('doc_ident')?.value); 
    valor= "";
    this.TercerFormGroup.get('doc_ident')?.setValue(valor);
    this.TercerFormGroup.get('nombres_apellidos')?.setValue(valor);
  }
  
agregarvehiculos() {
    var valor:string;
    valor =this.CuartoFormGroup.get('placa_vehiculo')?.value + "       " + this.CuartoFormGroup.get('cedulachofer')?.value + " " + this.CuartoFormGroup.get('nombrechofer')?.value;
    this.listavehiculos.push(valor);
    this.toastr.success( 'Agregado a la lista:'); 
    valor= "";
    this.CuartoFormGroup.get('placa_vehiculo')?.setValue(valor);
  }


 eliminarpersonas(leftList:any){
 
   const newLocal = leftList.selectedOptions.selected.map((e: any) => e.value);
       let elem = newLocal;
       var pos = this.listapersonas.indexOf(elem);
       this.listapersonas.splice(pos,1);
       this.toastr.success('Registro Eliminado de la Lista' + elem);
       this.listapersonas;
      }
      
  eliminarvehiculos(leftList:any){
 
   const newLocal = leftList.selectedOptions.selected.map((e: any) => e.value);
       let elem = newLocal;
       var pos = this.listavehiculos.indexOf(elem);
       this.listavehiculos.splice(pos,1);
       this.toastr.success('Registro Eliminado de la Lista' + elem);
       this.listavehiculos;
      }      
BorrarLista(leftList:any){
 
        const newLocal = leftList.selectedOptions.selected.map((e: any) => e.value);
            let elem = newLocal
            
            this.toastr.success('Registro Eliminado de la Lista' + elem);
            this.lista4 = this.lista4.concat(elem);
            this.listavehiculos= this.listavehiculos.filter(
             function(e:any) {
               return (e) < 0;
             },
             this.lista4)
}
   

 moveRight(leftList:any){
 
   const newLocal = leftList.selectedOptions.selected.map((e: any) => e.value);
       let elem = newLocal;
       var pos = this.links.indexOf(elem);
       this.links.splice(pos,1);
       this.toastr.success('Registro Eliminado de la Lista' + elem);
       this.links;
      }



  onReset() {
    this.submitted = false;
    this.fg.reset();
    this.router.navigate(['news/maestro']);
  }
  
  guardarpersonas() {
    for (let suc of this.listapersonas) {
        
      this.usuarioService.add(this.TercerFormGroup.value).subscribe(
         data => {
           this.toastr.success('Datos Registrados');
           this.submitted = false;
           this.TercerFormGroup.reset();
           this.router.navigate(['news/maestro']);
         },
         (result: any) => {
            this.errors = result.errors;
            this.toastr.error('No se pudo crear los datos');
          }
         );
     }    
  }
  guardarvehiculos() {
    for (let suc of this.listavehiculos) {
        
      this.usuarioService.add(this.TercerFormGroup.value).subscribe(
         data => {
           this.toastr.success('Datos Registrados');
           this.submitted = false;
           this.TercerFormGroup.reset();
           this.router.navigate(['news/maestro']);
         },
         (result: any) => {
            this.errors = result.errors;
            this.toastr.error('No se pudo crear los datos');
          }
         );
     }    
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
