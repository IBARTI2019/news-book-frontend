import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CreateAndEditPersonComponent } from 'app/modules/maestro/person/create-and-edit-person/create-and-edit-person.component';
import { PersonsSettings, Person, TypePeople } from 'app/interfaces';
import { TypePeopleService } from 'app/services/type-people.service';
import { ToastrService } from 'ngx-toastr';
import { BlacklistAlertComponent } from '../blacklist-alert/blacklist-alert.component';
import { PersonService } from '../../services/person.service';
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
  showPlaceOfReceptionField: true,
  showHourField: true,
  showEntryField: true,
  showProtocolField: true,
  showTypePersonField: true,
  showVaccinationCardNumberField: true,
  showAssignedCardNumberField: true,
  showButtonNew: true
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
  fPerson!: any;
  @Input() readOnly: boolean = false;

  @Output() isValid: EventEmitter<boolean> = new EventEmitter<boolean>();
  ownerTypes = [...OWNER_TYPES];
  movementTypes = [...MOVEMENT_TYPES];
  personTypes: TypePeople[] = [];
  isInstitution: boolean = false;
  requiresCompanyData: boolean = false;
  requiresGuideNumber: boolean = false;

  personCurrent: Person = { id: "", identification_number: "" };
  defaultValues = { ...PERSONS_LIST_DEFAULT };
  personCurrentseg: any = { description: "", cedula: "", nombres: "", apellidos: "", observacion: "", year: "", license_plate: "" };
  materialCurrent: any = { description: "", mark: "", model: "", color: "", serial: "", year: "", license_plate: "" }
  checkPersonTimeController: any = null;

  constructor(private toastr: ToastrService, private typePersonService: TypePeopleService, private personService: PersonService, public dialog: MatDialog) { }


  ngOnInit(): void {

    this.typePersonService.list({ not_paginator: true }).subscribe(data => {
      this.personTypes = data;
      if (this.fGRoot && this.id && this.fGRoot.get(this.id)) {
        this.fPerson = this.fGRoot.get(this.id);
        if (this.readOnly) {
          let tpId = this.fPerson.get("type_person").value;
          let typePerson = this.personTypes.find(tp => tp.id == tpId);
          if (typePerson)
            this.check(typePerson);
        }
      }
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
    clearTimeout(this.checkPersonTimeController);
    this.checkPersonTimeController = setTimeout(() => {
      this.personService.getPersonByIdentification(identification_number).subscribe((resp: any) => {
        // Si la persona no existe
        if (!resp.person) {
          this.toastr.error(resp.message || 'La persona no existe');
          this.fPerson.get("identification_number")!.setValue("");
          return;
        }
        // Si está en blacklist
        if (resp.blacklist) {
          this.showBlacklistAlert(resp.person);
          this.fPerson.get("identification_number")!.setValue("");
          return;
        }
        // Si no tiene acceso vigente
        if (!resp.has_access) {
          this.showNoAccessAlert(resp.person, resp.message || 'No tiene acceso permitido en este momento', resp.access_list);
          this.fPerson.get("identification_number")!.setValue("");
          return;
        }
        // Si todo está bien, llenar los datos
        const data = resp.person;
        this.fPerson.get("full_name")!.setValue(data.full_name);
        this.tp = String(data.type_person);
        this.fPerson.get("type_person")!.setValue(this.tp);
        this.fPerson.get("company_name")!.setValue(data.company);
        this.fPerson.get("rif")!.setValue(data.rif);
        this.fPerson.get("reason_visit").setValue(data.default_visit_reason);
        this.fPerson.get("place_of_reception").setValue(data.default_visit_location);

        let typePerson = this.personTypes.find(tp => tp.id == this.tp);
        if (typePerson)
          this.check(typePerson);
      });
    }, 1100);
  }

  private showBlacklistAlert(person: Person): void {
    this.dialog.open(BlacklistAlertComponent, {
      width: '450px',
      disableClose: true, // Obliga al usuario a hacer clic en el botón
      autoFocus: false,
      panelClass: 'blacklist-dialog',
      data: { person }
    });
  }

  private showNoAccessAlert(person: any, message: string, access_list: any[]): void {
    this.dialog.open(BlacklistAlertComponent, {
      width: '450px',
      disableClose: true,
      autoFocus: false,
      panelClass: 'blacklist-dialog',
      data: { person, message, noAccess: true, access_list }
    });
  }

  createPersona() {
    const dialogRef = this.dialog.open(CreateAndEditPersonComponent, {
      data: {
        modal: true
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog ojo result:', result);
      if (result?.doc_ident) {
        this.personsArr.push(result);
        this.fPerson.get("identification_number")!.setValue(result.doc_ident);
        this.getPerson(result.doc_ident);
      }
    });
  }

  check(value: any) {
    if (!this.readOnly) {
      this.fPerson.controls["instituccion"].setValue('-');
      this.fPerson.controls["observacion"].setValue('-');
      this.fPerson.controls["name_recibe"].setValue('-');
      this.fPerson.controls["ident_recibe"].setValue('-');
      this.fPerson.controls["cargo_recibe"].setValue('-');
      // this.fPerson.controls["company_name"].setValue('-');
      // this.fPerson.controls["rif"].setValue('-');
      this.fPerson.controls["guide_number"].setValue('-');
    }

    if (value.is_institution) {
      if (!this.readOnly) {
        this.fPerson.controls["instituccion"].setValue('');
        this.fPerson.controls["observacion"].setValue('');
        this.fPerson.controls["name_recibe"].setValue('');
        this.fPerson.controls["ident_recibe"].setValue('');
        this.fPerson.controls["cargo_recibe"].setValue('');
      }
      this.isInstitution = true;
    } else {
      this.isInstitution = false;
    }

    if (value.requires_company_data) {
      // if (!this.readOnly) {
      //   this.fPerson.controls["company_name"].setValue('');
      //   this.fPerson.controls["rif"].setValue('');
      // }
      this.requiresCompanyData = true;
    } else {
      this.requiresCompanyData = false;
    }

    if (value.requires_guide_number) {
      if (!this.readOnly) {
        this.fPerson.controls["guide_number"].setValue('');
      }
      this.requiresGuideNumber = true;
    } else {
      this.requiresGuideNumber = false;
    }
  }
}
