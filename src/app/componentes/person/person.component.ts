import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CreateAndEditPersonComponent } from 'app/modules/maestro/person/create-and-edit-person/create-and-edit-person.component';
import { PersonsSettings, Person, TypePeople } from 'app/interfaces';
import { TypePeopleService } from 'app/services/type-people.service';
import { ToastrService } from 'ngx-toastr';
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
};


@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent implements OnInit {
  tp: string = '';
  @Input() id: string = '';
  @Input() value: any = null;
  @Input() settings: PersonsSettings = PERSONS_LIST_DEFAULT;
  @Input() personsArr: Person[] = [];
  @Input() fGRoot!: FormGroup;
  fPerson!: FormGroup;
  @Input() readOnly: boolean = false;

  @Output() isValid: EventEmitter<boolean> = new EventEmitter<boolean>();
  ownerTypes = [...OWNER_TYPES];
  movementTypes = [...MOVEMENT_TYPES];
  personTypes: TypePeople[] = [];
  isInstitution: boolean = false;
 
  personCurrent: Person = { id: "", identification_number: "" };
  defaultValues = { ...PERSONS_LIST_DEFAULT };
  personCurrentseg: any = { description:"" ,cedula: "", nombres:"",apellidos:"", observacion:"",year: "", license_plate: "" };
  materialCurrent: any = { description: "", mark: "", model: "", color: "", serial: "", year: "", license_plate: "" }
 
  constructor(private toastr: ToastrService, private typePersonService: TypePeopleService,public dialog: MatDialog) { }
  

  ngOnInit(): void {
    this.typePersonService.list({ not_paginator: true }).subscribe(data => {
      this.personTypes = data;
    });
    if (this.fGRoot && this.id && this.fGRoot.get(this.id)) {
      this.fPerson = this.fGRoot.get(this.id) as FormGroup;
    }
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


  addMaterial(i: number) {
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
    this.fPerson.get('materials')?.value.value.push({ ...this.materialCurrent });
    this.materialCurrent = { ...{ description: "", mark: "", model: "", color: "", serial: "", year: "", license_plate: "" } };
  }
  // addpersonaseg(i: number) {
  //   let error: boolean = false;
  //   Object.keys(this.personCurrentseg).forEach((key: string = 'description') => {
  //     if (error)
  //       return;
  //     if (!this.personCurrentseg[key]) {
  //       this.toastr.error("Debe llenar todos los campos para registrar una Persona de Instituccion");
  //       error = true;
  //     }
  //   });
  //   if (error) return;
  //   this.fPerson.get('institucciones')?.value.value.push({ ...this.personCurrentseg });
  //   this.personCurrentseg = { ...{ description: "", cedula: "", nombres: "", apellidos: "", observacion: "",year: "", license_plate: "" } };
  // }
  removerpersonasI(index_persona: number): void {
    this.fPerson.get('institucciones')?.value.value.splice(index_persona, 1);
  }
  removeMaterial(index_material: number): void {
    this.fPerson.get('materials')?.value.value.splice(index_material, 1);
  }

  getPerson(identification_number: string) {
    console.log('PERSONA', identification_number, 'array',this.personsArr);
    let index = this.personsArr.findIndex(v => v.doc_ident == identification_number);
    if (index > -1) {
      this.fPerson.get("full_name")!.setValue(this.personsArr[index].full_name);
      this.tp =  String(this.personsArr[index].type_person);
    console.log(this.tp);
    }
  }

  createPersona() {
    const dialogRef = this.dialog.open(CreateAndEditPersonComponent, {
      data: {
        modal: true
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog result:', result );
      if (result?.doc_ident) {
        this.personsArr.push(result);
        this.fPerson.get("identification_number")!.setValue(result.doc_ident);
        this.getPerson(result.doc_ident);
      }
    });
  }
  
  check(value:boolean){
    if(value){
      this.fPerson.controls["instituccion"].setValue('');
      this.fPerson.controls["observacion"].setValue('');
      this.fPerson.controls["name_recibe"].setValue('');
      this.fPerson.controls["ident_recibe"].setValue('');
      this.fPerson.controls["cargo_recibe"].setValue('');
      this.isInstitution = true;
     
    }else{
      this.fPerson.controls["instituccion"].setValue('-');
      this.fPerson.controls["observacion"].setValue('-');
      this.fPerson.controls["name_recibe"].setValue('-');
      this.fPerson.controls["ident_recibe"].setValue('-');
      this.fPerson.controls["cargo_recibe"].setValue('-');
      this.isInstitution = false;
    }
  }

  getTypePerson(){
    return this.tp;
  }




}
