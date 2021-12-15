import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PersonsSettings, Person } from 'app/interfaces';
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
  showReasonVisitField: true,
  showHourField: true,
  showEntryField: true,
  showProtocolField: true
};


@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent implements OnInit {
  @Input() id: string = '';
  @Input() value: any = null;
  @Input() settings: PersonsSettings = PERSONS_LIST_DEFAULT;
  @Input() personsArr: Person[] = [];
  @Input() fGRoot!: FormGroup;
  fPerson!: FormGroup;
  @Input() readOnly: boolean = false;

  @Output() isValid: EventEmitter<boolean> = new EventEmitter<boolean>();

  movementTypes = [...MOVEMENT_TYPES];
  defaultValues = { ...PERSONS_LIST_DEFAULT }
  PersonsCurrent: Person = { id: "", identification_number: "" };
  materialCurrent: any = { description: "", mark: "", model: "", color: "", serial: "", year: "", license_plate: "" }
  constructor(private toastr: ToastrService) { }

  ngOnInit(): void {
    let v: any = {};
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

  removeMaterial(index_material: number): void {
    this.fPerson.get('materials')?.value.value.splice(index_material, 1);
  }

  getPerson(identification_number: string) {
    let index = this.personsArr.findIndex(v => v.identification_number == identification_number);
    if (index > -1) {
      this.fPerson.get("full_name")!.setValue(this.personsArr[index].full_name);
    }
  }
}
