import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Vehicle, VehiclesSettings } from 'app/interfaces';
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
    id: "supplier",
    text: "Proveedor",
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

export const VEHICLES_LIST_DEFAULT: VehiclesSettings = {
  percentage: 100,
  showTokenField: true,
  showNameField: true,
  showOwnerTypeField: true,
  showMovementTypeField: true,
  showHourField: true,
  showEntryField: true,
  showProtocolField: true
};

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.css']
})
export class VehiclesComponent implements OnInit {
  @Input() id: string = '';
  @Input() value: any = null;
  @Input() settings: VehiclesSettings = VEHICLES_LIST_DEFAULT;
  @Input() vehiclesArrSelected: Vehicle[] = [];
  @Input() vehiclesArr: Vehicle[] = [];
  @Input() fGRoot!: FormGroup;
  @Input() readOnly: boolean = false;

  @Output() isValid: EventEmitter<boolean> = new EventEmitter<boolean>();

  fVehicles: FormArray = new FormArray([]);
  fGVehicles = new FormGroup({});
  ownerTypes = [...OWNER_TYPES];
  movementTypes = [...MOVEMENT_TYPES];
  defaultValues = { ...VEHICLES_LIST_DEFAULT }
  vehiclesCurrent: Vehicle = { id: "", license_plate: "" };
  materialCurrent: any = { description: "", mark: "", model: "", color: "", serial: "", year: "", license_plate: "" }
  constructor(private fB: FormBuilder, private toastr: ToastrService) { }

  ngOnInit(): void {

    if (this.fGRoot && this.id && this.fGRoot.get(this.id)) {
      this.fVehicles = this.fGRoot.get(this.id) as FormArray;
    }

    this.fVehicles.statusChanges.subscribe((currentStatus) => {
      this.isValid.emit(currentStatus === "VALID" ? true : false);
    });
    this.vehiclesArrSelected.forEach((v) => {
      this.addFG(v);
    });

    this.fGVehicles = this.fB.group({
      vehicles: [this.vehiclesArrSelected.map((v) => v)],
    });
    this.fGVehicles.valueChanges.subscribe((values) => {
      values.vehicles.forEach((s: Vehicle) => {
        let found = null;
        if (this.fVehicles.value) {
          found = this.fVehicles.value.some((v: any) => {
            return v.license_plate === s.license_plate;
          });
        }
        if (!found) this.addFG(s);
      });
      this.fVehicles.value.forEach((v: any, index: number) => {
        const found = values.vehicles.some((s: Vehicle) => {
          return v.license_plate === s.license_plate;
        });
        if (!found) this.fVehicles.removeAt(index);
      });
      this.vehiclesCurrent = values.vehicles;
    });
  }

  ngOnChanges(change: SimpleChanges): void {
    if (change.settings && change.settings.firstChange) {
      this.settings = change.settings.currentValue || {
        ...VEHICLES_LIST_DEFAULT,
      }
    } else if (change.settings && !change.settings.currentValue) {
      this.settings = {
        ...VEHICLES_LIST_DEFAULT,
      }
    }
  }


  addFG(v: Vehicle): void {
    const fG = this.fB.group({
      license_plate: [
        v.license_plate || "",
        this.settings.showTokenField && Validators.required,
      ],
      owner_full_name: [
        v.owner_full_name || "",
        this.settings.showNameField && Validators.required,
      ],
      owner_type: [
        v.owner_type || null,
        this.settings.showOwnerTypeField && Validators.required,
      ],
      movement_type: [
        v.movement_type || null,
        this.settings.showMovementTypeField && Validators.required,
      ],
      hour: [
        v.hour || '',
        this.settings.showHourField && Validators.required,
      ],
      entry: [
        v.entry || false,
        this.settings.showEntryField && Validators.required,
      ],
      protocol: [
        v.protocol || false,
        this.settings.showProtocolField && Validators.required,
      ],
      materials: new FormControl({ value: v.materials || [] }),
      cargo_vehicle: [
        v.cargo_vehicle || { trailer_plate: "", loaded: false, seal_number: "", document_number: "", sealed: false, loading_review: false }
      ],
    });
    this.fVehicles.push(fG);
    this.vehiclesCurrent = { ...{ id: "", license_plate: "" } };
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
    this.fVehicles.controls[i].get('materials')?.value.value.push({ ...this.materialCurrent });
    this.materialCurrent = { ...{ description: "", mark: "", model: "", color: "", serial: "", year: "", license_plate: "" } };
    /*     let _materials_currents = this.fVehicles.controls[i].get('materials')?.value.value || []
        let _materials = _materials_currents.push(this.materialCurrent);
        let f = this.fVehicles.controls[i].patchValue({
          materials: _materials
        }); */
  }

  removeMaterial(index_form: number, index_material: number): void {
    this.fVehicles.controls[index_form].get('materials')?.value.value.splice(index_material, 0)
  }

  addVehicle() {
    let exist = false;
    let index = this.vehiclesArr.findIndex(v => v.license_plate == this.vehiclesCurrent.license_plate);
    if (index > -1)
      this.vehiclesCurrent = { ...this.vehiclesArr[index] };
    exist = this.fVehicles.value.find((v: any) => {
      return v.license_plate === this.vehiclesCurrent.license_plate;
    });
    if (exist) {
      this.toastr.error(`La placa ${this.vehiclesCurrent.license_plate} ya fue registrada`);
      return;
    } else {
      this.addFG(this.vehiclesCurrent);
    }
    /*     this.fVehicles.value.forEach((v: any, index: number) => {
          const found = this.fGVehicles.value.Vehicles.some((s: Vehicles) => {
            return v.code === s.code;
          });
          if (!found) this.fVehicles.removeAt(index);
        }); */
  }

  removeVehicle(index: number) {
    this.fVehicles.removeAt(index);
  }
}
