import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Material, Warehouse } from "app/interfaces";
import { MaterialsService } from "app/services/materials.service";
import { WarehouseService } from "app/services/warehouse.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-create-and-edit-material",
  templateUrl: "./create-and-edit-material.component.html",
  styleUrls: ["./create-and-edit-material.component.css"],
})
export class CreateAndEditMaterialComponent implements OnInit {
  fg: FormGroup;
  submitted = false;
  warehouses: Warehouse[] = [];
  update = false;
  id = "";
  routeState: any;
  redirectTo = "";

  constructor(
    private materialService: MaterialsService,
    private warehouseService: WarehouseService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.fg = this.fb.group({});
    this.routeState = history.state
  }

  ngOnInit() {
    this.id = this.route.snapshot.params.id;
    this.redirectTo = this.routeState.redirectTo || ""
    this.warehouseService.list().subscribe((data: Warehouse[]) => {
      this.warehouses = [...data];
    });
    this.fg = this.fb.group(
      {
        cod_material: ["", Validators.required],
        serial_material: ["", Validators.required],
        id_warehouse: ["", Validators.required],
        description: ["", Validators.required],
        stock: ["", Validators.required],
        is_active: [true, Validators.required],
      },
      {}
    );
    if (this.id) {
      this.update = true;
      this.getMaterial();
    }
  }

  onSubmit() {
    if (this.fg.invalid) {
      return;
    }
    this.submitted = true;
    console.log('Que pasa?')
    this.update ? this.updateMaterial : this.save();
  }

  onReset() {
    this.submitted = false;
    this.fg.reset();
    this.router.navigate([this.redirectTo || "materials"]);
  }

  save() {
    this.materialService.add(this.fg.value).subscribe(
      (data) => {
        this.toastr.success("Datos del Material creado con éxito");
        this.submitted = false;
        this.fg.reset();
        this.router.navigate([this.redirectTo || "materials"]);
      },
      (error: HttpErrorResponse) => {
        this.submitted = false;
        this.toastr.error(error.error.message || "No se pudo crear los datos");
      }
    );
  }

  getMaterial() {
    this.materialService.get(this.id).subscribe(
      (data: Material) => {
        this.fg.get("cod_material")!.setValue(data.cod_material);
        this.fg.get("serial_material")!.setValue(data.serial_material);
        this.fg.get("description")!.setValue(data.description);
        this.fg.get("is_active")!.setValue(data.is_active);
        this.fg.get("id_warehouse")!.setValue(data.id_warehouse);
        this.fg.get("stock")!.setValue(data.stock);
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
        this.fg.reset();
        this.router.navigate(["materials"]);
      },
      (error: HttpErrorResponse) => {
        this.submitted = false;
        this.toastr.error(
          error.error.message || "No se logro actualizar el material"
        );
      }
    );
  }
}
