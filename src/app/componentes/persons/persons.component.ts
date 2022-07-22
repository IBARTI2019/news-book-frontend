import { Component, EventEmitter, Input, OnChanges, OnInit, AfterViewChecked, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Scope, ScopeSettings } from 'app/interfaces';
import { Person, PersonsSettings, TypePeople } from 'app/interfaces';
import { MatDialog } from '@angular/material/dialog';
import { CreateAndEditPersonComponent } from 'app/modules/maestro/person/create-and-edit-person/create-and-edit-person.component';
import { TypePeopleService } from 'app/services/type-people.service';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { DTColumn } from '../generic-table/interface';
import { GenericTableComponent } from '../generic-table/generic-table.component';
import {DataSource} from '@angular/cdk/collections';
import {Observable, ReplaySubject} from 'rxjs';

const OWNER_TYPES = [
  {
    id: "employee",
    text: "Trabajador",
  },
  {
    id: "visitor",
    text: "Visitante",
  },
  {
    id: "cargo_vehicle",
    text: "Vehículo de carga",
  },
  {
    id: "Instituccion",
    text: "Instiruccion",
  },
];
const MOVEMENT_TYPES = [
  {
    id: "employee",
    text: "Entrada",
  },
  {
    id: "visitor",
    text: "Salida",
  }
];
const HEALTH_CONDITIONS = [
  {
    id: "good",
    text: "Buena",
  },
  {
    id: "average",
    text: "Regular",
  },
  {
    id: "bad",
    text: "Mala",
  },
];
export interface PeriodicElement {
  description: string;
  mark: string;
  model: string;
  color: string;
  serial: string;
  year: string;
  license_plate:string;
  
}
const ELEMENT_DATA: PeriodicElement[] = [];
class DataSourceV extends DataSource<PeriodicElement> {
  private _dataStream = new ReplaySubject<PeriodicElement[]>();

  constructor(initialData: PeriodicElement[]) {
    super();
    this.setData(initialData);
  }

  connect(): Observable<PeriodicElement[]> {
    return this._dataStream;
  }

  disconnect() {}

  setData(data: PeriodicElement[]) {
    this._dataStream.next(data);
  }
}
const PERSON_ARR_DEAFAULT: Person[] = [];
export const PERSONS_LIST_DEFAULT: PersonsSettings = {
  percentage: 100,
  showTokenField: true,
  showNameField: true,
  showMovementTypeField: true,
  showReasonVisitField: true,
  showHourField: true,
  showEntryField: true,
  showProtocolField: true,
  showTypePersonField:true,
  showVaccinationCardNumberField: true,
  showButtonNew:true
};
export const SCOPE_LIST_DEFAULT: ScopeSettings = {
  percentage: 100,
  showItemField: true,
  showTokenField: true,
  showNameField: true,
  showHealthConditionField: true,
  showObservationField: true,
  showAmountField: true,
};

@Component({
  selector: 'app-persons',
  templateUrl: './persons.component.html',
  styleUrls: ['./persons.component.css']
})
export class PersonsComponent implements OnInit, OnChanges, AfterViewChecked {
  tp: string = '';
  @Input() id: string = '';
  @Input() value: any = null;
  @Input() settings: PersonsSettings  =PERSONS_LIST_DEFAULT;
  @Input() scopeArrSelected:  Person[] = [];
  @Input() personsArr: Person[] = [];
  @Input() scopeArr: Person[] = PERSON_ARR_DEAFAULT;
  @Input() fGRoot!: FormGroup;
  @Input() pos: number = 0;
  @Input() readOnly: boolean = true;
  fPerson!: FormGroup;
  @Output() isValid: EventEmitter<boolean> = new EventEmitter<boolean>();
  columnsScope: DTColumn[] = [];
     
  fScope: FormArray = new FormArray([]);
  healthConditions = [...HEALTH_CONDITIONS];
  fGscope = new FormGroup({});
  movementTypes = [...MOVEMENT_TYPES];
  defaultValues = { ...SCOPE_LIST_DEFAULT }
  scopeCurrent: any = { amount: 0 };
  personTypes: TypePeople[] = [];
  ownerTypes = [...OWNER_TYPES];
  isInstitution: boolean = false;
  router: any;
  listFilter: Scope[] | undefined = [];
  listScope: any[] = [];
  materialCurrent: any = { description: "", mark: "", model: "", color: "", serial: "", year: "", license_plate: "" }
 
  @ViewChild("tableScope") table!: GenericTableComponent;
  displayedColumns: string[] = ['description', 'mark', 'model', 'color','serial','year', 'license_plate','star'];
  dataToDisplay = [...ELEMENT_DATA];
  datadisplayaux=[...ELEMENT_DATA];
  dataSource= Array (new DataSourceV(this.dataToDisplay));
  
  constructor(private toastr: ToastrService,private fB: FormBuilder,public dialog: MatDialog,private typePersonService: TypePeopleService) { }

  ngAfterViewChecked(): void {
    console.log(`POlcia${this.fScope.controls}`);
    this.table.refresh({}, this.fScope.controls);
    if (this.fScope.controls.length>0) {
      this.table.refresh({}, this.fScope.controls);
      if (this.dataSource.length<10){
          this.dataSource.push(new DataSourceV(this.dataToDisplay))
       }
      
    }
  }

  ngOnInit(): void {
    this.columnsScope = [];
    if(this.settings.showTokenField)
      this.columnsScope.push(
        {
          attribute: "identification_number",
          header: "Cedula",
          template: "item" 
        },
      );
    if(this.settings.showTokenField)
      this.columnsScope.push({
          attribute: "full_name",
          header: "Nombres y apellidos",
          template: "code"
        });
    if(this.settings.showTypePersonField)
      this.columnsScope.push({
        attribute: "type_person",
        header: "Tipo persona",
        template: "name"
      },);
    if(this.settings.showMovementTypeField)
      this.columnsScope.push({
        attribute: "movement_type",
        header: "Tipo de movimiento",
        template: "movimiento"
      },);
      if(this.settings.showHourField)
      this.columnsScope.push({
        attribute: "hour",
        header: "Hora",
        template: "thora"
      },);
      if(this.settings.showHourField)
        this.columnsScope.push({
          attribute: "reason_visit",
          header: "Motivo de la Visita",
          template: "tvisita"
        },);
      if(this.settings.showEntryField)
        this.columnsScope.push({
          attribute:"entry",
          header: "Ingreso de herramienta o equipo",
          template: "therramienta"
        },);  
     if(this.settings.showProtocolField)
        this.columnsScope.push({
          attribute:"protocol",
          header: "Cumplió protocolo covid 19",
          template: "tprotocolo"
        },);  
    if(this.settings.showVaccinationCardNumberField)
        this.columnsScope.push({
          attribute:"vaccination_card_number",
          header: "Nro. de tarjeta de vacunación",
          template: "tvacuna"
        },);  
    if(!this.readOnly)
      this.columnsScope.push({
        attribute: "id",
        header: "",
        template: "opciones"
      });
      this.typePersonService.list({ not_paginator: true }).subscribe(data => {
        this.personTypes = data;
        
      });
    if (this.fGRoot && this.id && this.fGRoot.get(this.id)) {
      this.fScope = this.fGRoot.get(this.id) as FormArray;
    }

    this.fScope.statusChanges.subscribe((currentStatus) => {
      this.isValid.emit(currentStatus === "VALID" ? true : false);
    });

    this.scopeArrSelected.forEach((v) => {
      
      this.addFG(v);
    });

    this.fGscope = this.fB.group({
      scope: [this.scopeArrSelected.map((v) => v)],
    });

    this.fGscope.valueChanges.subscribe((values) => {
      this.scopeCurrent = values.scope;
      
    });
   
  }

  ngOnChanges(change: SimpleChanges): void {
    
    if (change.settings && change.settings.firstChange) {
      this.settings = change.settings.currentValue || {
        ...PERSONS_LIST_DEFAULT,
      }
    } else if (change.settings && !change.settings.currentValue) {
      this.settings = {
        ...PERSONS_LIST_DEFAULT,
      }
    }
    
  }

  addFG(v: Person): void {
    const fG = this.fB.group({
      identification_number: [
        v.identification_number || "",
        this.settings.showTokenField && Validators.required,
      ],
      full_name: [
        v.full_name || "",
        this.settings.showNameField && Validators.required,
      ],
      type_person: [
        v.type_person || null,
        this.settings.showTypePersonField && Validators.required,
      ],
      reason_visit: [
        v.reason_visit || null,
        this.settings.showReasonVisitField && Validators.required,
      ],
      movement_type: [
        v.movement_type || null,
        this.settings.showMovementTypeField && Validators.required,
      ],
      entry: [
        v.entry || false,
        this.settings.showEntryField && Validators.required,
      ],
      hour: [
        v.hour || '',
        this.settings.showHourField && Validators.required,
      ],
      protocol: [
        v.protocol || false,
        this.settings.showProtocolField && Validators.required,
      ],
      materials: new FormControl({ value: v.materials?.value || [] }),
      vaccination_card_number: [
        v.vaccination_card_number || "",
        this.settings.showVaccinationCardNumberField && Validators.required,
      ],
    });
    this.fScope.push(fG);
    this.listScope = [...this.fScope.value];
    if(!this.readOnly)
      this.table.refresh({}, this.fScope.controls);
  }
  addMaterial(i: number,j: number) {
    let error: boolean = false;
   
    Object.keys(this.materialCurrent).forEach((key: string = 'description') => {
      if (error)
        return;
      if (!this.materialCurrent[key]) {
        this.toastr.error("Debe llenar todos los campos para registrar una material, herramienta o equipo");
        error = true;
      }
    });
    if (error) return;

    const randomElementIndex = j ;
    ELEMENT_DATA[randomElementIndex]={ ...this.materialCurrent }
    this.pos=this.fScope.controls.length -1;
    this.dataToDisplay = [...this.dataToDisplay, ELEMENT_DATA[randomElementIndex]];
    this.dataSource[this.pos].setData(this.dataToDisplay);
    this.fScope.controls[this.pos].get('materials')?.value.value.push({ ... this.materialCurrent });
    this.materialCurrent = { ...{ description: "", mark: "", model: "", color: "", serial: "", year: "", license_plate: "" } };
    
  }

  removeMaterial(index_form: number,index_material: number): void {
    if (index_material> -1) {
      this.pos=this.fScope.controls.length -1;
      this.datadisplayaux= this.dataToDisplay.splice(index_material,1);
      this.dataSource[this.pos].setData(this.dataToDisplay);
      this.fScope.controls[this.pos].get('materials')?.value.value.splice(index_material,1);
    }
  }
  addSubLine() {
    
    this.addFG(this.scopeCurrent);
    /*     this.fScope.value.forEach((v: any, index: number) => {
          const found = this.fGscope.value.scope.some((s: Scope) => {
            return v.code === s.code;
          });
          if (!found) this.fScope.removeAt(index);
        }); */
  }

  removeSubLine(serial: string) {
    let exist = false;
    console.log(`OJo${serial}`)
    for (var index = 0; index < this.fScope.controls.length; index++) {
      let serialaux = this.fScope.controls[index].value.item;
      if (serial===serialaux) {
         this.pos =index;
      }
    }
   
    this.fScope.removeAt(this.pos);
    
  }
  getPerson(identification_number: string) {
    let index = this.personsArr.findIndex(v => v.identification_number == identification_number);
    if (index > -1) {
      this.fScope.get("full_name")!.setValue(this.personsArr[index].full_name);
    }
  }
  
   

  createPersona() {
    const dialogRef = this.dialog.open(CreateAndEditPersonComponent, {
      data: {
        modal: true
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result?.identification_number) {
        this.scopeCurrent.identification_number= result.identification_number;
        this.personsArr.push(result);
        this.addSubLine();
      }
    });
  }
  check(value:boolean){
    if(value){
     
      this.isInstitution = true;
     
    }else{
      
      this.isInstitution = false;
    }
  }
 
}