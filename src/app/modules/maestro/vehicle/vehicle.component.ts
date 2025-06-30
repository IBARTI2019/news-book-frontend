import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ConfirmDialogService } from "app/componentes/confirm-dialog/confirm-dialog.service";
import { GenericTableComponent } from "app/componentes/generic-table/generic-table.component";
import { DTColumn } from "app/componentes/generic-table/interface";
import { Vehicle } from "app/interfaces";
import { ToastrService } from "ngx-toastr";
import { VehicleService } from "../../../services/vehicle.service";
import { CreateAndEditVehicleComponent } from "./create-and-edit-vehicle/create-and-edit-vehicle.component";

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
    private toastr: ToastrService,
    public dialog: MatDialog
  ) { }

  showCheck = () => true;

  ngOnInit(): void {
    this.columns = [
      {
        dataAttribute: "license_plate",
        header: "Placa Vehiculo",
      },
      {
        dataAttribute: "owner_full_name",
        header: "Propietario",
      },
      {
        header: "Activo",
        dataAttribute: "is_active",
        attribute: "is_active",
        type: "bool"
      },
      {
        attribute: "id",
        header: "Opciones",
        template: "opciones",
      },
    ];
  }

  update(id: string) {
    // this.router.navigate(["vehicle", id]);
    this.showModalVehicle(id);
  }

  delete(usuario: Vehicle) {
    this.dialogService.open({
      message: `Esta seguro de que desea eliminar La Informacion de ${usuario.license_plate}?`,
    });
    this.dialogService.confirmed().subscribe((confirmed) => {
      if (confirmed) {
        this.vehicleService.remove(usuario.id).subscribe(
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

  showModalVehicle(id?: string) {
    const dialogRef = this.dialog.open(CreateAndEditVehicleComponent, {
      data: {
        id: id
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
