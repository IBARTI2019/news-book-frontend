import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Vehicle } from "../../../../interfaces/index";
import { VehicleService } from "../../../../services/vehicle.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-create-and-edit-vehicle",
  templateUrl: "./create-and-edit-vehicle.component.html",
  styleUrls: ["./create-and-edit-vehicle.component.css"],
})
export class CreateAndEditVehicleComponent implements OnInit {
  fg: FormGroup;
  submitted = false;
  update: boolean = false;
  id: string = "";
  routeState: any;
  redirectTo = "";

  constructor(
    private vehicleService: VehicleService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.fg = this.fb.group({});
    this.routeState = history.state
  }

  ngOnInit() {
    this.id = this.route.snapshot.params.id;
    this.redirectTo = this.routeState.redirectTo || ""
    this.fg = this.fb.group(
      {
        name: ["", Validators.required],
        lastname: ["", Validators.required],
        doc_ident: ["", Validators.required],
        placa_vehiculo: ["", Validators.required],
        status: [true, Validators.required],
      },
      {}
    );

    if (this.id) {
      this.update = true;
      this.getVehicle();
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.fg.invalid) {
      this.submitted = false;
      return;
    }
    this.update ? this.updateVehicle : this.save();
  }

  onReset() {
    this.submitted = false;
    this.fg.reset();
    this.router.navigate([this.redirectTo || "vehicle"]);
  }

  save() {
    this.vehicleService.add(this.fg.value).subscribe(
      (data) => {
        this.toastr.success("Vehiculo creado con éxito");
        this.submitted = false;
        this.fg.reset();
        this.router.navigate([this.redirectTo || "vehicle"]);
      },
      (error: HttpErrorResponse) => {
        this.toastr.error(
          error.error.message || "No se logro guardar el vehiculo."
        );
      }
    );
  }

  getVehicle() {
    this.vehicleService.get(this.id).subscribe((data: Vehicle) => {
      this.fg.get("name")!.setValue(data.name);
      this.fg.get("lastname")!.setValue(data.lastname);
      this.fg.get("status")!.setValue(data.status);
      this.fg.get("doc_ident")!.setValue(data.doc_ident);
      this.fg.get("placa_vehiculo")!.setValue(data.placa_vehiculo);
    });
  }

  updateVehicle() {
    this.vehicleService.update(this.id, this.fg.value).subscribe(
      (data) => {
        this.toastr.success(
          "El vehiculo se ha actualizado satisfactoriamente!."
        );
        this.submitted = false;
        this.fg.reset();
        this.router.navigate(["vehicle"]);
      },
      (error: HttpErrorResponse) => {
        this.toastr.error(
          error.error.message || "No se pudo actualizar el vehiculo."
        );
      }
    );
  }
}
