import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CreateAndEditPersonComponent } from '../../modules/maestro/person/create-and-edit-person/create-and-edit-person.component';
import { PersonsSettings, Person, TypePeople } from '../../interfaces';
import { TypePeopleService } from '../../services/type-people.service';
import { ToastrService } from 'ngx-toastr';
import { BlacklistAlertComponent } from '../blacklist-alert/blacklist-alert.component';
import { PersonService } from '../../services/person.service';
import { getLocalStorage } from '../../utils/localStorage';
import { API } from '../../utils/api';
import { FacialRecognitionListComponent } from '../facial-recognition-list/facial-recognition-list.component';
import { DatePipe } from '@angular/common';
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
  facialRecognition = false;
  constructor(private toastr: ToastrService, private typePersonService: TypePeopleService,
    private personService: PersonService, public dialog: MatDialog, private datePipe: DatePipe) { }


  ngOnInit(): void {
    this.facialRecognition = getLocalStorage(API.FACIAL_RECOGNITION);
    this.typePersonService.list({ not_paginator: true }).subscribe(data => {
      this.personTypes = data;
      if (this.fGRoot && this.id && this.fGRoot.get(this.id)) {
        this.fPerson = this.fGRoot.get(this.id);
        if (this.readOnly) {
          const now = new Date();
          const currentTime = this.datePipe.transform(now, 'HH:mm');
          this.fPerson.get("hour")!.setValue(currentTime);
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
    // Verificar primero si el formulario existe
    if (!this.fPerson) return;

    // Usar el operador de navegación segura para todos los controles
    if (!this.readOnly) {
      this.fPerson.get("instituccion")?.setValue('-');
      this.fPerson.get("observacion")?.setValue('-');
      this.fPerson.get("name_recibe")?.setValue('-');
      this.fPerson.get("ident_recibe")?.setValue('-');
      this.fPerson.get("cargo_recibe")?.setValue('-');
      this.fPerson.get("guide_number")?.setValue('-');
    }

    if (value.is_institution) {
      if (!this.readOnly) {
        this.fPerson.get("instituccion")?.setValue('');
        this.fPerson.get("observacion")?.setValue('');
        this.fPerson.get("name_recibe")?.setValue('');
        this.fPerson.get("ident_recibe")?.setValue('');
        this.fPerson.get("cargo_recibe")?.setValue('');
      }
      this.isInstitution = true;
    } else {
      this.isInstitution = false;
    }

    if (value.requires_company_data) {
      this.requiresCompanyData = true;
    } else {
      this.requiresCompanyData = false;
    }

    if (value.requires_guide_number) {
      if (!this.readOnly) {
        this.fPerson.get("guide_number")?.setValue('');
      }
      this.requiresGuideNumber = true;
    } else {
      this.requiresGuideNumber = false;
    }
  }

  /**
    * Abre el modal de reconocimiento facial y maneja el resultado.
    */
  openFacialRecognitionModal(): void {
    const dialogRef = this.dialog.open(FacialRecognitionListComponent, {
      width: '800px',
      maxHeight: '90vh',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(recognition => {
      console.log('afterClosed:', recognition);
      if (recognition && recognition.user_id) {
        this.personService.getPersonByIdentification(recognition.user_id).subscribe((resp: any) => {

          // CASO 1: La persona no existe.
          if (!resp.person) {
            this.toastr.info('La persona no existe. Por favor, complete el registro.');
            // Se abre el modal de creación, pasando el ID y el tipo de movimiento.
            this.openCreatePersonModal(recognition.user_id, recognition.movement_type, recognition.event_time);
            return;
          }

          // CASO 2: La persona está en lista negra.
          if (resp.blacklist) {
            this.showBlacklistAlert(resp.person);
            return;
          }

          // CASO 3: La persona no tiene acceso.
          if (!resp.has_access) {
            this.showNoAccessAlert(resp.person, resp.message || 'No tiene acceso permitido en este momento', resp.access_list);
            return;
          }

          // CASO 4: Todo correcto. Se llena el formulario.
          this.populateMainForm(resp.person, recognition.movement_type, recognition.event_time);
        });
      }
    });
  }


  /**
 * Abre el modal para crear una nueva persona, precargando su cédula.
 * @param identification - La cédula de la persona a crear.
 * @param movement_type - El tipo de movimiento original del reconocimiento.
 */
  openCreatePersonModal(identification: string, movement_type: string, event_time: string): void {
    const createPersonDialogRef = this.dialog.open(CreateAndEditPersonComponent, {
      width: '800px',
      maxHeight: '90vh',
      autoFocus: false,
      data: {
        doc_ident: identification // Pasamos la cédula al modal de creación
      }
    });

    createPersonDialogRef.afterClosed().subscribe(newPerson => {
      // Si el usuario guardó la nueva persona
      if (newPerson) {
        // Volvemos a validar la persona recién creada contra las reglas de negocio (blacklist, acceso).
        this.personService.getPersonByIdentification(newPerson.doc_ident).subscribe((resp: any) => {
          if (!resp.person) {
            this.toastr.error('Ocurrió un error al verificar la persona recién creada.');
            return;
          }
          if (resp.blacklist) {
            this.showBlacklistAlert(resp.person);
            return;
          }
          if (!resp.has_access) {
            this.showNoAccessAlert(resp.person, resp.message, resp.access_list);
            return;
          }
          // Si todo está bien, llenamos el formulario principal.
          this.populateMainForm(resp.person, movement_type, event_time);
        });
      } else {
        this.toastr.warning('Registro de persona cancelado.');
      }
    });
  }

  private populateMainForm(personData: any, movement_type: string, event_time: string): void {
    // 1. Primero establece todos los valores básicos
    const fullName = personData.full_name || `${personData.name || ''} ${personData.last_name || ''}`.trim();
    this.fPerson.get("identification_number")?.setValue(personData.doc_ident);
    this.fPerson.get("full_name")?.setValue(fullName);
    this.tp = String(personData.type_person);
    this.fPerson.get("type_person")?.setValue(this.tp);
    this.fPerson.get("movement_type")?.setValue(movement_type === "IN" ? "employee" : "visitor");

    // Cambia aquí: usa company_name si existe, si no company
    this.fPerson.get("company_name")?.setValue(personData.company_name ?? personData.company ?? '');
    this.fPerson.get("rif")?.setValue(personData.rif ?? personData.rif ?? '');

    this.fPerson.get("reason_visit")?.setValue(personData.default_visit_reason);
    this.fPerson.get("place_of_reception")?.setValue(personData.default_visit_location);

    // 2. Manejo de la hora
    if (event_time) {
      try {
        const eventDate = new Date(event_time);
        if (!isNaN(eventDate.getTime())) {
          const formattedTime = this.datePipe.transform(eventDate, 'HH:mm');
          this.fPerson.get("hour")?.setValue(formattedTime);
        } else {
          this.setCurrentTime();
        }
      } catch (error) {
        this.setCurrentTime();
      }
    } else {
      this.setCurrentTime();
    }

    const typePerson = this.personTypes.find(tp => tp.id == this.tp);
    if (typePerson) {
      this.check(typePerson);
    }
  }

  private setCurrentTime(): void {
    const now = new Date();
    const currentTime = this.datePipe.transform(now, 'HH:mm');
    this.fPerson.get("hour")?.setValue(currentTime);
  }
}
