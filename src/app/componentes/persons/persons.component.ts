import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Person, PersonsSettings, TypePeople } from '../../interfaces';
import { TypePeopleService } from 'app/services/type-people.service';
import { ToastrService } from 'ngx-toastr';

const MOVEMENT_TYPES = [
  { id: "employee", text: "Entrada" },
  { id: "visitor", text: "Salida" }
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
  showVaccinationCardNumberField: true,
  showAssignedCardNumberField: true
};

@Component({
  selector: 'app-persons',
  templateUrl: './persons.component.html',
  styleUrls: ['./persons.component.css']
})
export class PersonsComponent implements OnInit {
  @Input() id: string = '';
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
  personCurrent: any = { identification_number: '' };

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private typePersonService: TypePeopleService
  ) { }

  ngOnInit(): void {
    this.loadPersonTypes();
    this.initForms();
  }

  private loadPersonTypes(): void {
    this.typePersonService.list({ not_paginator: true }).subscribe(data => {
      this.personTypes = data;
    });
  }

  private initForms(): void {
    if (this.fGRoot && this.id && this.fGRoot.get(this.id)) {
      this.fPersons = this.fGRoot.get(this.id) as FormArray;
    }

    this.fPersons.statusChanges.subscribe(status => {
      this.isValid.emit(status === 'VALID');
    });

    this.personsArrSelected.forEach(person => this.addPersonForm(person));

    this.fGPersons = this.fb.group({
      identification_number: ['', Validators.required]
    });
  }

  addPersonForm(person: Person): void {
    const formGroup = this.fb.group({
      identification_number: [
        person.identification_number || person.doc_ident || '',
        this.settings.showTokenField ? Validators.required : null
      ],
      full_name: [
        person.full_name || '',
        this.settings.showNameField ? Validators.required : null
      ],
      type_person: [
        person.type_person || null,
        this.settings.showTypePersonField ? Validators.required : null
      ],
      movement_type: [
        person.movement_type || null,
        this.settings.showMovementTypeField ? Validators.required : null
      ],
      hour: [
        person.hour || '',
        this.settings.showHourField ? Validators.required : null
      ],
      reason_visit: [
        person.reason_visit || null,
        this.settings.showReasonVisitField ? Validators.required : null
      ],
      entry: [person.entry || false],
      protocol: [person.protocol || false],
      materials: new FormControl({ value: person.materials?.value || [] })
    });

    this.fPersons.push(formGroup);
  }

  addPerson(): void {
    if (!this.personCurrent.identification_number) {
      this.toastr.error('Debe ingresar un número de cédula');
      return;
    }

    const existingPerson = this.fPersons.value.find((p: any) =>
      p.identification_number === this.personCurrent.identification_number);

    if (existingPerson) {
      this.toastr.error(`La persona con cédula ${this.personCurrent.identification_number} ya existe`);
      return;
    }
    const personFromList = this.personsArr.find(p =>
      p.identification_number === this.personCurrent.identification_number || p.doc_ident === this.personCurrent.identification_number);

    if (personFromList) {
      this.addPersonForm(personFromList);
      this.personCurrent.identification_number = '';
    }
  }

  searchPerson(): void {
    // Implementar búsqueda de persona
    this.toastr.info('Funcionalidad de búsqueda en desarrollo');
  }

  removePerson(index: number): void {
    this.fPersons.removeAt(index);
  }
}