import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Person, PersonsSettings, TypePeople } from '../../interfaces';
import { TypePeopleService } from 'app/services/type-people.service';
import { ToastrService } from 'ngx-toastr';

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
  showAccompanyVisitor: true,
  showReasonVisitField: true,
  showHourField: true,
  showEntryField: true,
  showProtocolField: true
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
  defaultValues = { ...PERSONS_LIST_DEFAULT }
  personCurrent: Person = { id: "", identification_number: "" };
  materialCurrent: any = { description: "", mark: "", model: "", color: "", serial: "", year: "", license_plate: "" }
  constructor(private fB: FormBuilder, private toastr: ToastrService, private typePersonService: TypePeopleService) { }

  ngOnInit(): void {
    this.typePersonService.list({ not_paginator: true }).subscribe(data => {
      this.personTypes = data;
    });
    if (this.fGRoot && this.id && this.fGRoot.get(this.id)) {
      this.fPersons = this.fGRoot.get(this.id) as FormArray;
    }

    this.fPersons.statusChanges.subscribe((currentStatus) => {
      this.isValid.emit(currentStatus === "VALID" ? true : false);
    });
    this.personsArrSelected.forEach((v) => {
      this.addFG(v);
    });

    this.fGPersons = this.fB.group({
      Persons: [this.personsArrSelected.map((v) => v)],
    });
    this.fGPersons.valueChanges.subscribe((values) => {
      values.Persons.forEach((s: Person) => {
        let found = null;
        if (this.fPersons.value) {
          found = this.fPersons.value.some((v: any) => {
            return v.identification_number === s.identification_number;
          });
        }
        if (!found) this.addFG(s);
      });
      this.fPersons.value.forEach((v: any, index: number) => {
        const found = values.Persons.some((s: Person) => {
          return v.identification_number === s.identification_number;
        });
        if (!found) this.fPersons.removeAt(index);
      });
      this.personCurrent = values.person;
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
      accompany_visitor: [
        v.accompany_visitor || null,
        this.settings.showAccompanyVisitor && Validators.required,
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
      assigned_card_number: [
        v.assigned_card_number || "",
        this.settings.showAssignedCardNumberField && Validators.required,
      ],
    });
    this.fPersons.push(fG);
    this.personCurrent = { ...{ id: "", identification_number: "" } };
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
    this.fPersons.controls[i].get('materials')?.value.value.push({ ...this.materialCurrent });
    this.materialCurrent = { ...{ description: "", mark: "", model: "", color: "", serial: "", year: "", license_plate: "" } };
    /*     let _materials_currents = this.fPersons.controls[i].get('materials')?.value.value || []
        let _materials = _materials_currents.push(this.materialCurrent);
        let f = this.fPersons.controls[i].patchValue({
          materials: _materials
        }); */
  }

  removeMaterial(index_form: number, index_material: number): void {
    this.fPersons.controls[index_form].get('materials')?.value.value.splice(index_material, 1);
  }

  addPerson() {
    let exist = false;
    let index = this.personsArr.findIndex(v => v.identification_number == this.personCurrent.identification_number);
    if (index > -1)
      this.personCurrent = { ...this.personsArr[index] };
    exist = this.fPersons.value.find((v: any) => {
      return v.identification_number === this.personCurrent.identification_number;
    });
    if (exist) {
      this.toastr.error(`La persona con número de identificación ${this.personCurrent.identification_number} ya fue registrada`);
      return;
    } else {
      this.addFG(this.personCurrent);
    }
  }

  removePerson(index: number) {
    this.fPersons.removeAt(index);
  }
}
