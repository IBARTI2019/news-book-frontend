import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { ConfirmDialogService } from "app/componentes/confirm-dialog/confirm-dialog.service";
import { GenericTableComponent } from "app/componentes/generic-table/generic-table.component";
import { DTColumn } from "app/componentes/generic-table/interface";
import { Vehicle } from "app/interfaces";
import { ToastrService } from "ngx-toastr";
import { VehicleService } from "../../../services/vehicle.service";

@Component({
  selector: "app-vehicle",
  templateUrl: "./vehicle.component.html",
  styleUrls: ["./vehicle.component.css"],
})
export class VehicleComponent implements OnInit {
  @ViewChild("table") table!: GenericTableComponent;
  columns: DTColumn[] = [];
  constructor(
    public vehicleService: VehicleService,
    private router: Router,
    private dialogService: ConfirmDialogService,
    private toastr: ToastrService
  ) {}

  showCheck = () => true;

  ngOnInit(): void {
    this.columns = [
      {
        dataAttribute: "name",
        attribute: "Nombres",
      },
      {
        dataAttribute: "lastname",
        attribute: "Apellidos",
      },
      {
        dataAttribute: "doc_ident",
        attribute: "Cedula",
      },
      {
        dataAttribute: "placa_vehiculo",
        attribute: "Placa Vehiculo",
      },
      {
        dataAttribute: "status",
        attribute: "Status",
      },
      {
        attribute: "id_vehiculo",
        header: "Opciones",
        template: "opciones",
      },
    ];
  }

  update(id: string) {
    this.router.navigate(["inicio/vehiculos/maestro/", id]);
  }

  delete(usuario: Vehicle) {
    this.dialogService.open({
      message: `Esta seguro de que desea eliminar La Informacion de ${usuario.placa_vehiculo}?`,
    });
    this.dialogService.confirmed().subscribe((confirmed) => {
      if (confirmed) {
        this.vehicleService.remove(usuario.id_vehiculo || "").subscribe(
          (data) => {
            this.toastr.success("Vehiculo eliminado con exito!.");
            this.table.refresh();
          },
          (error: HttpErrorResponse) => {
            this.toastr.error(
              error.error.message ||
                "Ocurrio un error al eliminar el Vehiculo."
            );
          }
        );
      }
    });
  }
}
