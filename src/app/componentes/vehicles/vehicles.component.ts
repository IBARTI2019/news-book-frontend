import { Component, EventEmitter, Input, OnInit, Output, OnChanges, AfterViewChecked,SimpleChanges,ViewChild } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Vehicle, VehiclesSettings } from 'app/interfaces';
import { CreateAndEditVehicleComponent } from 'app/modules/maestro/vehicle/create-and-edit-vehicle/create-and-edit-vehicle.component';
import { creatematherComponent } from  'app/componentes/vehicles/vehiclesmaterialesherramientas/vehiclesmaterialesherramientas.component'
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from "@angular/router";
import { DTColumn } from '../generic-table/interface';
import { GenericTableComponent } from '../generic-table/generic-table.component';
import {DataSource} from '@angular/cdk/collections';
import {Observable, ReplaySubject} from 'rxjs';




export interface PeriodicCarga {
  cargado: string;
    
}
export interface PeriodicElement {
  description: string;
  mark: string;
  model: string;
  color: string;
  serial: string;
  year: string;
  license_plate:string;
  
}
const ELEMENT_CARGA: PeriodicCarga[] = [];
class DataSourceCarga extends DataSource<PeriodicCarga> {
  private _dataStream = new ReplaySubject<PeriodicCarga[]>();

  constructor(initialDatacarga: PeriodicCarga[]) {
    super();
    this.setData(initialDatacarga);
  }

  connect(): Observable<PeriodicCarga[]> {
    return this._dataStream;
  }

  disconnect() {}

  setData(data: PeriodicCarga[]) {
    this._dataStream.next(data);
  }
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




export class VehiclesComponent implements OnInit,OnChanges,AfterViewChecked {
  @Input() id: string = '';
  @Input() value: any = null;
  @Input() settings: VehiclesSettings = VEHICLES_LIST_DEFAULT;
  @Input() vehiclesArrSelected: Vehicle[] = [];
  @Input() vehiclesArr: Vehicle[] = [];
  @Input() fGRoot!: FormGroup;
  @Input() readOnly: boolean = false;
  @Input() materialCurrentaux: any = [...ELEMENT_DATA];
  materialo: any = [...ELEMENT_DATA];
  @Output() isValid: EventEmitter<boolean> = new EventEmitter<boolean>();
  columnsVehiculos: DTColumn[] = [];
  fVehicles: FormArray = new FormArray([]);
  fGVehicles = new FormGroup({});
  ownerTypes = [...OWNER_TYPES];
  movementTypes = [...MOVEMENT_TYPES];
  defaultValues = { ...VEHICLES_LIST_DEFAULT }
  vehiclesCurrent: Vehicle = { id: "", license_plate: "" };
  materialCurrent: any = { description: "", mark: "", model: "", color: "", serial: "", year: "", license_plate: "" }
  listVehiculos: any[] = [];
  materiaprueba:any[] = [];
  redirectTo="";
  @ViewChild("tableVehiculos") table!: GenericTableComponent;
  displayedColumns: string[] = ['description', 'mark', 'model', 'color','serial','year', 'license_plate','star'];
  dataToDisplay = [...ELEMENT_DATA];
  displayedColumnsC: string[] = ['cargado'];
  dataToDisplayC = [...ELEMENT_CARGA];
  datadisplayaux=[...ELEMENT_DATA];
  dataSourceC = new DataSourceCarga(this.dataToDisplayC);
  dataSource=  Array (new DataSourceV(this.dataToDisplay)) ;
  
  constructor(private fB: FormBuilder, 
    private toastr: ToastrService, public dialog: MatDialog, private router: Router,
    private route: ActivatedRoute) {
  }
  
  ngAfterViewChecked(): void {
    this.table.refresh({}, this.fVehicles.controls);
    for (var index = 0; index < this.fVehicles.controls.length; index++) {
      this.dataSource[index].setData(this.fVehicles.controls[index].get('materials')?.value.value);
      
     }
    
  }
  ngOnInit(): void {
    this.columnsVehiculos = [];
    if(this.settings.showTokenField)
      this.columnsVehiculos.push(
        {
          attribute:"license_plate",
          header: "Placa",
          template: "idplaca" 
        },
      );
    if(this.settings.showNameField)
      this.columnsVehiculos.push({
          attribute: "owner_full_name",
          header:"Nombres y apellidos",
          template: "idnombre"
        });
    if(this.settings.showNameField)
      this.columnsVehiculos.push({
        attribute:"owner_type",
        header: "Tipo propietario",
        template: "idtipop"
      },);
    if(this.settings.showMovementTypeField)
      this.columnsVehiculos.push({
        attribute:"movement_type",
        header: " Tipo de movimiento",
        template: "idtipom"
      });

    if(this.settings.showHourField)
      this.columnsVehiculos.push({
        attribute: "hour",
        header: "Hora",
        template: "idhora"
      });

    if(this.settings.showEntryField)
      this.columnsVehiculos.push({
        attribute: "entry",
        header: "Ingreso de herramienta o equipo",
        template: "idheq"
      });
      if(this.settings.showProtocolField)
      this.columnsVehiculos.push({
        attribute: "protocol",
        header: "Cumplio protocolo",
        template: "idprotocolo"
      });


    if(!this.readOnly)
      this.columnsVehiculos.push({
        attribute: "id",
        header: "",
        template: "opciones"
      });
   


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
      materials: new FormControl({ value: v.materials?.value || [] }),
      cargo_vehicle: [
        v.cargo_vehicle || { trailer_plate: "", loaded: false, seal_number: "", document_number: "", sealed: false, loading_review: false }
      ],
    });
    this.fVehicles.push(fG);
    this.vehiclesCurrent = { ...{ id: "", license_plate: "" } };
    
    this.listVehiculos = [...this.fVehicles.value];

    if(!this.readOnly){
      this.table.refresh({}, this.fVehicles.controls);
      
    
    }
      
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
    this.dataToDisplay = [...this.dataToDisplay, ELEMENT_DATA[randomElementIndex]];
   
    this.dataSource[i].setData(this.dataToDisplay);
    this.fVehicles.controls[i].get('materials')?.value.value.push({ ... this.materialCurrent });
   this.materialCurrent = { ...{ description: "", mark: "", model: "", color: "", serial: "", year: "", license_plate: "" } };
   i= i+ 1;
   this.dataSource=Array(i)
   this.dataSource= Array (new DataSourceV(this.materialCurrent))
  }

  removeMaterial(index_form: number,index_material: number): void {
    if (index_material> -1) {
      this.datadisplayaux= this.dataToDisplay.splice(index_material,1);
      this.dataSource[index_form].setData(this.dataToDisplay);
      this.fVehicles.controls[index_form].get('materials')?.value.value.splice(index_material,1);
    }
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

  createVehicle() {
    const dialogRef = this.dialog.open(CreateAndEditVehicleComponent, {
      data: {
        modal: true
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result?.license_plate) {
        this.vehiclesCurrent.license_plate = result.license_plate;
        this.vehiclesArr.push(result);
        this.addVehicle();
      }
    });
  }
  createmather() {
    const dialogRef = this.dialog.open(creatematherComponent, {
      data: { materialCurrenAux: this.materiaprueba}
      
    });
    
    dialogRef.afterClosed().subscribe(data => {
      console.log(`Dialog Policia: ${data}`);
      if (data) {
         this.materiaprueba=data;
         this.materialo=data;
         this.materialCurrent=data;
         console.log(this.materialCurrent)
            
      }
    });
    
  }
  removeVehicle(index: number) {
    this.fVehicles.removeAt(index);
  }
  retornarAleatorio(mat:any) {
    return mat;
  }
}
