import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Warehouse } from "app/interfaces";
import { WarehouseService } from "app/services/warehouse.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-create-and-edit",
  templateUrl: "./create-and-edit.component.html",
  styleUrls: ["./create-and-edit.component.css"],
})
export class CreateAndEditComponent implements OnInit {
  fg: FormGroup;
  submitted = false;
  update = false;
  id = '';
  showForm = true;

  constructor(
    private warehouseService: WarehouseService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.fg = this.fb.group({});
  }

  ngOnInit() {
    this.id = this.route.snapshot.params.id;
    console.log("Parametro id en url: ", this.route.snapshot.params.id);
    this.fg = this.fb.group(
      {
        descripcion: ['', Validators.required],
        status: [true, Validators.required],
      },
      {}
    );
    if (this.id) {
      this.update = true;
      this.showForm = false;
      this.getWarehouse();
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.fg.invalid) {
      this.submitted = false;
      return;
    }
    this.update ? this.updateWarehouse() : this.save();
  }

  onReset() {
    this.submitted = false;
    this.fg.reset();
    this.router.navigate(["inicio/warehouse"]);
  }

  save() {
    this.warehouseService.add(this.fg.value).subscribe(
      (data) => {
        this.toastr.success("Almacen creado con éxito!.");
        this.submitted = false;
        this.fg.reset();
        this.router.navigate(["inicio/warehouse"]);
      },
      (error: HttpErrorResponse) => {
        this.submitted = false;
        this.toastr.error(error.error.message || "No se pudo crear el almacen");
      }
    );
  }

  getWarehouse() {
    this.warehouseService.get(this.id).subscribe(
      (data: Warehouse) => {
        this.fg.get('descripcion')!.setValue(data.descripcion || '');
        this.fg.get('status')!.setValue(data.status || false);
        this.showForm = true;
      },
      (error: HttpErrorResponse) => {
        this.showForm = true;
        this.toastr.error( error.error.message || 'No se obtener el almacen');
      }
    );
  }

  updateWarehouse() {
    this.warehouseService.update(this.id, this.fg.value).subscribe(
      data => {
        this.toastr.success('El almacen se ha actualizado satisfactoriamente!');
        this.submitted = false;
        this.fg.reset();
        this.router.navigate(['inicio/warehouse']);
      },
      (error: HttpErrorResponse) => {
        this.submitted = false;
        this.toastr.error( error.error.message || 'No se pudo actualizar el almacen');
      }
    );
  }
}
