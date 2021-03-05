import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from 'app/news/servicios/usuario.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { Almacen, Usuario } from 'app/news/servicios/interface';
import { materialesentrance } from 'app/news/servicios/interface';
import { personasentrance } from 'app/news/servicios/interface';
import { vehiculosentrance } from 'app/news/servicios/interface';
import { MatService} from 'app/news/servicios/materiales.service';
import { PerService} from 'app/news/servicios/personas.service';
import { VehService} from 'app/news/servicios/vehiculosnews.service';
import { almacennService } from "app/news/servicios/almacenn.service";
import {ThemePalette} from '@angular/material/core';
import {FormControl} from '@angular/forms';
import { values } from 'lodash';
import { Table2SheetOpts } from 'xlsx/types';
import { MatListModule} from '@angular/material/list';
import {MatExpansionModule} from '@angular/material/expansion'; 
import {map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';
import { data } from 'jquery';
export interface State {
  flag: string;
  name: string;
  population: string;
}

interface listacondicion {
  value: string;
  viewValue: string;
}

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
  hide = true;
  hide2 = true;
  id: string = '';
  public idcodigo:string="";
  isLinear = false;
  almacennews: Almacen[] = [];
  listanews:Usuario[] = [];
  listamateriales:materialesentrance[] = [];
  listaper:personasentrance[] = [];
  listaveh:vehiculosentrance[] = [];
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
  selectedValue:string="Bueno";
  tipocondicion:any;
  default: string = 'Bueno';
  condicion: listacondicion[] = [
    {value: 'Bueno', viewValue: 'Bueno'},
    {value: 'Dañado', viewValue: 'Dañado'},
    {value: 'Extraviado', viewValue: 'Extraviado'},
    {value: 'Excelente', viewValue: 'Excelente'}
  ];
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
  matentrance: any;
  opcionSeleccionado: string  = '0';
  verSeleccion: string        = '';
  
  constructor(
    private usuarioService: UsuarioService,
    private matservicio:MatService,
    private perservicio:PerService,
    private vehservicio:VehService,
    private almacennewservice:almacennService,
    
    //private sucursalService: SucursalService,
    //private rolService: RolService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
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
    this.id = this.route.snapshot.params.id;
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
     quantity: ['', ],
     foods:['', ],
    }, {});
    this.SecondFormGroup.get('foods')?.value;
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
    stateCtrl: ['', Validators.required],
     
    }, {});
    this.getnews();
  }

  onSubmit() {
    this.submitted = true;
    if (this.firstFormGroup.invalid) {
      return;
    }
    this.actualizar();
  }

  onReset() {
    this.submitted = false;
    this.firstFormGroup.reset();
    this.router.navigate(['inicio/materiales/maestro']);
  }

  getnews() {
    this.usuarioService.get(this.id).subscribe(
      (data: Usuario) => {
       this.firstFormGroup.get("ced_notifica")?.setValue(data.ced_notifica);
       this.firstFormGroup.get("nombres_apellidos")?.setValue(data.nombres_apellidos);
       this.firstFormGroup.get("id_type_news")?.setValue(data.id_type_news);
       this.firstFormGroup.get("notice")?.setValue(data.notice);

      });
  }
agregarlist() {
    var valor:string;
    valor =this.SecondFormGroup.get('identificador')?.value + " " + this.SecondFormGroup.get('descripcion')?.value +" " + this.SecondFormGroup.get('quantity')?.value + " "+ this.SecondFormGroup.get('foods')?.value
    this.links.push(valor);
    this.toastr.success( 'Agregado a la lista:' + this.SecondFormGroup.get('identificador')?.value) ; 
    valor= "";
    this.SecondFormGroup.get('identificador')?.setValue(valor);
    this.SecondFormGroup.get('descripcion')?.setValue(valor);
    this.SecondFormGroup.get('quantity')?.setValue(valor);
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



    
getNumbersInString(string:string) {
  var tmp = string.split("");
  var map = tmp.map(function(current) {
    if (!isNaN(parseInt(current))) {
      return current;
    }
  });

  var numbers = map.filter(function(value) {
    return value != undefined;
  });

  return numbers.join("");
}
  guardarmateriales(tiranews:any) {
    for(var i=0; i< this.links.length; i++){
      let aux= this.links[i].split(' ',4);
      let serial =aux[0];
      var longitud=0;
      var l2=0;
      longitud = serial.length;
      l2= this.links[i].length;
      let descripcionaux= this.links[i].substr(longitud,l2)
      var cantidad:number;
      let auxdescripcion=descripcionaux.trim();
      let descripcionfinal= auxdescripcion.split(' ',5);
      var l3=0;  
      let idnews = tiranews;  
      let descripcion=descripcionfinal[0] + " " + descripcionfinal[1] + " " + descripcionfinal[2] + " " + descripcionfinal[3] + " " + descripcionfinal[4];
      cantidad= Number(this.getNumbersInString(descripcionaux));
      let tira= descripcion;
      var l7=0;
      l7=tira.length;
      let condicion = descripcionaux.substr(l7,l2)
      
      this.listamateriales.push({
        id_news:idnews,serial:serial, description:descripcion,quantity:cantidad,condiction:condicion
          });
    
   }
    for (let suc of this.listamateriales) {
        
      this.matservicio.add(suc).subscribe(
         data => {
           this.toastr.success('Datos Registrados');
           this.submitted = false;
           this.TercerFormGroup.reset();
           this.router.navigate(['inicio/news/maestro']);
         },
         (result: any) => {
            this.errors = result.errors;
            this.toastr.error('No se pudo crear los datos');
          }
         );
     }    
  }

  guardarpersonas(tiranews:any) {
    for(var i=0; i< this.listapersonas.length; i++){
      let aux= this.listapersonas[i].split(' ',4);
      let serial =aux[0];
      var longitud=0;
      var l2=0;
      longitud = serial.length;
      l2= this.listapersonas[i].length;
      let descripcionaux= this.listapersonas[i].substr(longitud,l2)
      var cantidad:number;
      let auxdescripcion=descripcionaux.trim();
      let descripcionfinal= auxdescripcion.split(' ',5);
      var l3=0;  
      let idnews = tiranews;    
      let descripcion=descripcionfinal[0] + " " + descripcionfinal[1] + " " + descripcionfinal[2] + " " + descripcionfinal[3] + " " + descripcionfinal[4];
      cantidad= Number(this.getNumbersInString(descripcionaux));
      let tira= descripcion;
      var l7=0;
      l7=tira.length;
      let condicion = descripcionaux.substr(l7,l2)
      
      this.listaper.push({
        id_news:this.idcodigo, id_person:serial,nombres_apellidos:descripcion
          });
    
   }
    for (let suc of this.listaper) {
        
      this.perservicio.add(suc).subscribe(
         data => {
           this.toastr.success('Datos Registrados');
           this.submitted = false;
           this.TercerFormGroup.reset();
           this.router.navigate(['inicio/news/maestro']);
         },
         (result: any) => {
            this.errors = result.errors;
            this.toastr.error('No se pudo crear los datos');
          }
         );
     }    
  }

   guardarvehiculos(tiranews:any) {
    for(var i=0; i< this.listavehiculos.length; i++){
      let aux= this.listavehiculos[i].split(' ',4);
      let serial =aux[0];
      var longitud=0;
      var l2=0;
      longitud = serial.length;
      l2= this.listavehiculos[i].length;
      let descripcionaux= this.listavehiculos[i].substr(longitud,l2)
      var cantidad:number;
      let auxdescripcion=descripcionaux.trim();
      let descripcionfinal= auxdescripcion.split(' ',5);
      var l3=0;  
      let idnews = tiranews;  
      let descripcion=descripcionfinal[0] + " " + descripcionfinal[1] + " " + descripcionfinal[2] + " " + descripcionfinal[3] + " " + descripcionfinal[4];
      cantidad= Number(this.getNumbersInString(descripcionaux));
      let tira= descripcion;
      var l7=0;
      l7=tira.length;
      let condicion = descripcionaux.substr(l7,l2)
      this.listaveh.push({
        id_news:this.idcodigo, placa_vehiculo:serial,ced_chof:tira,nombresapellidos:descripcion
          });
    
   }
    for (let suc of this.listaveh) {
        
      this.vehservicio.add(suc).subscribe(
         data => {
           this.toastr.success('Datos Registrados');
           this.submitted = false;
           this.TercerFormGroup.reset();
           this.router.navigate(['inicio/news/maestro']);
         },
         (result: any) => {
            this.errors = result.errors;
            this.toastr.error('No se pudo crear los datos');
          }
         );
     }    
  }

  actualizar() {
    this.usuarioService.update(this.id, this.firstFormGroup.value).subscribe(
      data => {
        this.toastr.success('Datos News actualizado');
        this.submitted = false;
        this.firstFormGroup.reset();
        this.router.navigate(['inicio/materiales/maestro']);
      },
      (result: any) => {
        this.errors = result.errors;
        this.toastr.error('No se pudo actualizar los Datos');
      }
    );
  }
  private _filterStates(value: string): State[] {
    const filterValue = value.toLowerCase();

    return this.states.filter(state => state.name.toLowerCase().indexOf(filterValue) === 0);
  }
capturar() {
    // Pasamos el valor seleccionado a la variable verSeleccion
    this.verSeleccion =this.selectedValue;
    
}
}
