import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Vehicle, VehiclesSettings } from 'app/interfaces';
import { CreateAndEditVehicleComponent } from 'app/modules/maestro/vehicle/create-and-edit-vehicle/create-and-edit-vehicle.component';
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
    text: "Vehículo de cargao",
  },
  {
    id: "Instituccion",
    text: "Instituccion",
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
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.css']
})
export class VehicleComponent implements OnInit {
  @Input() id: string = '';
  @Input() value: any = null;
  @Input() settings: VehiclesSettings = VEHICLES_LIST_DEFAULT;
  @Input() vehiclesArr: Vehicle[] = [];
  @Input() fGRoot!: FormGroup;
  fVehicle!: FormGroup;
  @Input() readOnly: boolean = false;

  @Output() isValid: EventEmitter<boolean> = new EventEmitter<boolean>();

  ownerTypes = [...OWNER_TYPES];
  movementTypes = [...MOVEMENT_TYPES];
  defaultValues = { ...VEHICLES_LIST_DEFAULT }
  vehiclesCurrent: Vehicle = { id: "", license_plate: "" };
  materialCurrent: any = { description: "", mark: "", model: "", color: "", serial: "", year: "", license_plate: "" }

  constructor(private toastr: ToastrService, public dialog: MatDialog) { }

  ngOnInit(): void {
    let v: any = {};
    if (this.fGRoot && this.id && this.fGRoot.get(this.id)) {
      this.fVehicle = this.fGRoot.get(this.id) as FormGroup;
    }
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
    this.fVehicle.get('materials')?.value.value.push({ ...this.materialCurrent });
    this.materialCurrent = { ...{ description: "", mark: "", model: "", color: "", serial: "", year: "", license_plate: "" } };
  }

  removeMaterial(index_material: number): void {
    this.fVehicle.get('materials')?.value.value.splice(index_material, 1);
  }

  getVehicle(license_plate: string) {
    let index = this.vehiclesArr.findIndex(v => v.license_plate == license_plate);
    if (index > -1) {
      this.fVehicle.get("owner_full_name")!.setValue(this.vehiclesArr[index].owner_full_name);
    } else {
      this.fVehicle.get("owner_full_name")!.setValue('');
    }
  }


  createVehicle() {
    const dialogRef = this.dialog.open(CreateAndEditVehicleComponent, {
      data: {
        modal: true
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result?.license_plate) {
        this.vehiclesArr.push(result);
        this.fVehicle.get("license_plate")!.setValue(result.license_plate);
        this.getVehicle(result.license_plate);
      }
    });
  }

}
