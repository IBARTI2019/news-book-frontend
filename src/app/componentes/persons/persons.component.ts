import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Person, PersonsSettings, TypePeople } from "../../interfaces";
import { CreateAndEditPersonComponent } from "../../modules/maestro/person/create-and-edit-person/create-and-edit-person.component";
import { TypePeopleService } from "../../services/type-people.service";
import { ToastrService } from "ngx-toastr";
import { MatDialog } from "@angular/material/dialog";
import { getLocalStorage } from "../../utils/localStorage";
import { API } from "../../utils/api";
import { BlacklistAlertComponent } from "../blacklist-alert/blacklist-alert.component";
import { PersonService } from "../../services/person.service";
import { FacialRecognitionListComponent } from "../facial-recognition-list/facial-recognition-list.component";
import { DatePipe } from "@angular/common";

const MOVEMENT_TYPES = [
  { id: "employee", text: "Entrada" },
  { id: "visitor", text: "Salida" },
];

export const PERSONS_LIST_DEFAULT: PersonsSettings = {
  percentage: 100,
  showTokenField: true,
  showNameField: true,
  showTypePersonField: true,
  showMovementTypeField: true,
  showAccompanyVisitor: true,
  showReasonVisitField: true,
  showHourField: true,
  showEntryField: true,
  showProtocolField: true,
  showPlaceOfReceptionField: true,
  showVaccinationCardNumberField: true,
  showAssignedCardNumberField: true,
};

@Component({
  selector: "app-persons",
  templateUrl: "./persons.component.html",
  styleUrls: ["./persons.component.css"],
})
export class PersonsComponent implements OnInit {
  @Input() id: string = "";
  @Input() value: any = null;
  @Input() settings: PersonsSettings = PERSONS_LIST_DEFAULT;
  @Input() personsArrSelected: Person[] = [];
  @Input() personsArr: Person[] = [];
  @Input() fGRoot!: FormGroup;
  @Input() readOnly: boolean = false;

  @Output() isValid: EventEmitter<boolean> = new EventEmitter<boolean>();

  fPersons: FormArray = new FormArray([]);
  fGPersons = new FormGroup({});
  movementTypes = [...MOVEMENT_TYPES];
  personTypes: TypePeople[] = [];
  defaultValues = { ...PERSONS_LIST_DEFAULT };
  personCurrent: any = { identification_number: "" };
  facialRecognition: boolean = false;
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private typePersonService: TypePeopleService,
    private personService: PersonService,
    public dialog: MatDialog,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.facialRecognition = getLocalStorage(API.FACIAL_RECOGNITION);
    this.loadPersonTypes();
    this.initForms();
  }

  private loadPersonTypes(): void {
    this.typePersonService.list({ not_paginator: true }).subscribe((data) => {
      this.personTypes = data;
    });
  }

  private initForms(): void {
    if (this.fGRoot && this.id && this.fGRoot.get(this.id)) {
      this.fPersons = this.fGRoot.get(this.id) as FormArray;
    }

    this.fPersons.statusChanges.subscribe((status) => {
      this.isValid.emit(status === "VALID");
    });

    this.personsArrSelected.forEach((person) => this.addPersonForm(person));

    this.fGPersons = this.fb.group({
      identification_number: ["", Validators.required],
    });
  }

  createPerson() {
    const dialogRef = this.dialog.open(CreateAndEditPersonComponent, {
      data: {
        modal: true,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("Dialog ojo result:", result);
      if (result?.doc_ident) {
        this.personsArr.push(result);
        this.personCurrent.identification_number = result.doc_ident;
        this.addPerson();
      }
    });
  }

  addPersonForm(
    person: Person,
    movement_type?: string,
    event_time?: string
  ): void {
    if (this.facialRecognition && movement_type) {
      const now = new Date();
      if (event_time) {
        try {
          const eventDate = new Date(event_time);
          if (!isNaN(eventDate.getTime())) {
            person.hour = this.datePipe.transform(eventDate, "HH:mm");
          } else {
            person.hour = this.datePipe.transform(now, "HH:mm");
          }
        } catch (error) {
          person.hour = this.datePipe.transform(now, "HH:mm");
        }
      } else {
        person.hour = this.datePipe.transform(now, "HH:mm");
      }

      person.movement_type = movement_type === "IN" ? "employee" : "visitor";
      person.reason_visit = person.default_visit_reason;
    }
    const formGroup = this.fb.group({
      identification_number: [
        person.identification_number || person.doc_ident || "",
        this.settings.showTokenField ? Validators.required : null,
      ],
      full_name: [
        person.full_name || "",
        this.settings.showNameField ? Validators.required : null,
      ],
      type_person: [
        person.type_person || null,
        this.settings.showTypePersonField ? Validators.required : null,
      ],
      movement_type: [
        person.movement_type || null,
        this.settings.showMovementTypeField ? Validators.required : null,
      ],
      hour: [
        person.hour || "",
        this.settings.showHourField ? Validators.required : null,
      ],
      reason_visit: [
        person.reason_visit || null,
        this.settings.showReasonVisitField ? Validators.required : null,
      ],
      place_of_reception: [
        person.place_of_reception || null,
        this.settings.showPlaceOfReceptionField ? Validators.required : null,
      ],
      entry: [person.entry || false],
      protocol: [
        person.protocol || false,
        this.settings.showProtocolField ? Validators.required : null,
      ],
      vaccination_card_number: [
        person.vaccination_card_number || null,
        this.settings.showVaccinationCardNumberField
          ? Validators.required
          : null,
      ],
      assigned_card_number: [
        person.assigned_card_number || null,
        this.settings.showAssignedCardNumberField ? Validators.required : null,
      ],
      materials: new FormControl({ value: person.materials?.value || [] }),
    });

    this.fPersons.push(formGroup);
  }

  addPerson(
    person?: Person,
    movement_type?: string,
    event_time?: string
  ): void {
    if (person) {
      this.personCurrent.identification_number =
        person.identification_number || person.doc_ident || "";
    } else {
      if (!this.personCurrent.identification_number) {
        this.toastr.error("Debe ingresar un número de cédula");
        return;
      }
    }
    const existingPerson = this.fPersons.value.find(
      (p: any) =>
        p.identification_number === this.personCurrent.identification_number
    );

    if (existingPerson) {
      this.toastr.error(
        `La persona con cédula ${this.personCurrent.identification_number} ya existe`
      );
      return;
    }
    const personFromList = this.personsArr.find(
      (p) =>
        p.identification_number === this.personCurrent.identification_number ||
        p.doc_ident === this.personCurrent.identification_number
    );

    if (personFromList && !person) {
      this.addPersonForm(personFromList);
      this.personCurrent.identification_number = "";
    } else if (person) {
      this.addPersonForm(person, movement_type, event_time);
      this.personCurrent.identification_number = "";
    }
  }

  searchPerson(): void {
    // Implementar búsqueda de persona
    this.toastr.info("Funcionalidad de búsqueda en desarrollo");
  }

  removePerson(index: number): void {
    this.fPersons.removeAt(index);
  }

  openFacialRecognitionModal(): void {
    const dialogRef = this.dialog.open(FacialRecognitionListComponent, {
      width: "800px",
      maxHeight: "90vh",
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((recognition) => {
      console.log("afterClosed:", recognition);
      if (recognition && recognition.user_id) {
        this.personService
          .getPersonByIdentification(recognition.user_id)
          .subscribe((resp: any) => {
            // CASO 1: La persona no existe.
            if (!resp.person) {
              this.toastr.info(
                "La persona no existe. Por favor, complete el registro."
              );
              // Se abre el modal de creación, pasando el ID y el tipo de movimiento.
              this.openCreatePersonModal(
                recognition.user_id,
                recognition.user_name,
                recognition.movement_type,
                recognition.event_time
              );
              return;
            }

            // CASO 2: La persona está en lista negra.
            if (resp.blacklist) {
              this.showBlacklistAlert(resp.person);
              return;
            }

            // CASO 3: La persona no tiene acceso.
            if (!resp.has_access) {
              this.showNoAccessAlert(
                resp.person,
                resp.message || "No tiene acceso permitido en este momento",
                resp.access_list
              );
              return;
            }

            // CASO 4: Todo correcto. Se llena el formulario.
            this.addPerson(
              resp.person,
              recognition.movement_type,
              recognition.event_time
            );
          });
      }
    });
  }

  private showBlacklistAlert(person: Person): void {
    this.dialog.open(BlacklistAlertComponent, {
      width: "450px",
      disableClose: true, // Obliga al usuario a hacer clic en el botón
      autoFocus: false,
      panelClass: "blacklist-dialog",
      data: { person },
    });
  }

  /**
   * Abre el modal para crear una nueva persona, precargando su cédula.
   * @param identification - La cédula de la persona a crear.
   * @param movement_type - El tipo de movimiento original del reconocimiento.
   */
  openCreatePersonModal(
    identification: string,
    user_name: string,
    movement_type: string,
    event_time: string
  ): void {
    const createPersonDialogRef = this.dialog.open(
      CreateAndEditPersonComponent,
      {
        width: "800px",
        maxHeight: "90vh",
        autoFocus: false,
        data: {
          doc_ident: identification, // Pasamos la cédula al modal de creación
          user_name: user_name,
        },
      }
    );

    createPersonDialogRef.afterClosed().subscribe((newPerson) => {
      // Si el usuario guardó la nueva persona
      if (newPerson) {
        // Volvemos a validar la persona recién creada contra las reglas de negocio (blacklist, acceso).
        this.personService
          .getPersonByIdentification(newPerson.doc_ident)
          .subscribe((resp: any) => {
            if (!resp.person) {
              this.toastr.error(
                "Ocurrió un error al verificar la persona recién creada."
              );
              return;
            }
            if (resp.blacklist) {
              this.showBlacklistAlert(resp.person);
              return;
            }
            if (!resp.has_access) {
              this.showNoAccessAlert(
                resp.person,
                resp.message,
                resp.access_list
              );
              return;
            }
            // Si todo está bien, llenamos el formulario principal.
            this.addPerson(resp.person, movement_type, event_time);
          });
      } else {
        this.toastr.warning("Registro de persona cancelado.");
      }
    });
  }

  private showNoAccessAlert(
    person: any,
    message: string,
    access_list: any[]
  ): void {
    this.dialog.open(BlacklistAlertComponent, {
      width: "450px",
      disableClose: true,
      autoFocus: false,
      panelClass: "blacklist-dialog",
      data: { person, message, noAccess: true, access_list },
    });
  }
}
