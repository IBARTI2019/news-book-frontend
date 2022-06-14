import { HttpErrorResponse } from "@angular/common/http";
import { Component, Inject, Input, OnInit, } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { Material } from "app/interfaces";
import { MaterialsService } from "app/services/materials.service";
import { ToastrService } from "ngx-toastr";
import { DTColumn } from 'app/componentes/generic-table/interface';
import { GenericTableComponent } from 'app/componentes/generic-table/generic-table.component';
import {DataSource} from '@angular/cdk/collections';
import {Observable, ReplaySubject} from 'rxjs';

export interface PeriodicElement {
  description: string;
  mark: string;
  model: string;
  color: string;
  serial: string;
  year: string;
  license_plate:string;
  
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

@Component({
  selector: "app-vehiclesmaterialesherramientas",
  templateUrl: "./vehiclesmaterialesherramientas.component.html",
  styleUrls: ["./vehiclesmaterialesherramientas.component.css"],
})
export class creatematherComponent implements OnInit {
  fg: FormGroup;
  submitted = false;
  update = false;
  id = "";
  i:number=1;
  routeState: any;
  redirectTo = "";
  @Input() modal = false;
  materialCurrent: any = { description: "", mark: "", model: "", color: "", serial: "", year: "", license_plate: "" }
  displayedColumns: string[] = ['description', 'mark', 'model', 'color','serial','year', 'license_plate','star'];
  dataToDisplay = [...ELEMENT_DATA];
  displayedColumnsC: string[] = ['cargado'];
  
  datadisplayaux=[...ELEMENT_DATA];
  
  dataSource = new DataSourceV(this.dataToDisplay);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      modal: boolean,
      id: string,
    },
    private mdDialogRef: MatDialogRef<creatematherComponent>,
    private materialService: MaterialsService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.fg = this.fb.group({});
    this.routeState = history.state
  }

  ngOnInit() {
    this.id = this.route.snapshot.params.id ? this.route.snapshot.params.id : this.data.id;
    this.redirectTo = this.routeState.redirectTo || ""
     
    this.fg = this.fb.group(
      {
        description: ["",],
        mark: ["", ],
        model: ["", ],
        color: ["", ],
        serial: ["",],
        year: ["", ],
        licence_plate: ["", ],
        
      },
      {}
    );
    this.materialCurrent[this.i]= this.fg.value;
    
    if (this.id) {
      this.update = true;
      this.materialCurrent=this.fg.value
      this.dataSource = new DataSourceV(this.fg.value);
      
    }
  }

  onSubmit() { 
    this.submitted = true;
    this.update ? this.updateMaterial() : this.save();
  }

  onReset() {
    this.submitted = false;
    this.fg.reset();
    
  }

  save() {
    this.submitted = true;
    this.fg.reset();
  }
  addMaterial(i: number) {
    let error: boolean = false;
    this.materialCurrent= this.fg.value;
    
    Object.keys(this.materialCurrent).forEach((key: string = 'description') => {
      if (error)
        return;
      if (!this.materialCurrent[key]) {
        this.toastr.error("Debe llenar todos los campos para registrar una material, herramienta o equipo");
        error = true;
      }
    });
    if (error) return;
    //this.fVehicles.controls[i].get('materials')?.value.value.push({ ...this.materialCurrent });
    const randomElementIndex = i ;
    ELEMENT_DATA[randomElementIndex]={ ...this.materialCurrent }
    
    this.dataToDisplay = [...this.dataToDisplay, ELEMENT_DATA[randomElementIndex]];
    this.dataSource.setData(this.dataToDisplay);
    
     this.i=this.i + 1;
     
    this.materialCurrent = { ...{ description: "", mark: "", model: "", color: "", serial: "", year: "", license_plate: "" } };
    this.fg.reset;
    
  }
  getMaterial() {
    this.materialService.get(this.id).subscribe(
      (data: Material) => {
        this.fg.get("code")!.setValue(data.code);
        this.fg.get("serial")!.setValue(data.serial);
        this.fg.get("description")!.setValue(data.description);
        this.fg.get("is_active")!.setValue(data.is_active);
      },
      (error: HttpErrorResponse) => {
        this.toastr.error( error.error.message || 'Error al obtener el material');
      }
    );
  }

  updateMaterial() {
    this.materialService.update(this.id, this.fg.value).subscribe(
      (data) => {
        this.toastr.success("Datos Material  actualizado");
        this.submitted = false;
        //this.fg.reset();
        //this.router.navigate(["materials"]);
      },
      (error: HttpErrorResponse) => {
        this.submitted = false;
        this.toastr.error(
          error.error.message || "No se logro actualizar el material"
        );
      }
    );
  }
  removeMaterial(index_material: number): void {
    if (index_material> -1) {
      this.datadisplayaux= this.dataToDisplay.splice(index_material,1);
      this.dataSource.setData(this.dataToDisplay);
    }
  }
}
