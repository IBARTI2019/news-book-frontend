import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ConfirmDialogService } from "app/componentes/confirm-dialog/confirm-dialog.service";
import { GenericTableComponent } from "app/componentes/generic-table/generic-table.component";
import { DTColumn } from "app/componentes/generic-table/interface";
import { ToastrService } from "ngx-toastr";
import { Material } from "../../../interfaces/index";
import { MaterialsService } from "../../../services/materials.service";
import { CreateAndEditMaterialComponent } from "./create-and-edit-material/create-and-edit-material.component";
import { head } from "lodash";

@Component({
  selector: "app-materials",
  templateUrl: "./materials.component.html",
  styleUrls: ["./materials.component.css"],
})
export class MaterialsComponent implements OnInit {
  @ViewChild("table") table!: GenericTableComponent;
  columns: DTColumn[] = [];
  constructor(
    public materialsService: MaterialsService,
    private router: Router,
    private dialogService: ConfirmDialogService,
    private toastr: ToastrService,
    public dialog: MatDialog
  ) { }

  showCheck = () => true;

  ngOnInit(): void {
    this.columns = [
      {
        dataAttribute: "code",
        header: "Cod Material",
      },
      {
        dataAttribute: "serial",
        header: "Serial Material",
      },
      {
        dataAttribute: "description",
        header: "Descripción",
      },
      {
        dataAttribute: "is_active",
        header: "Activo",
        type: "bool"
      },
      {
        attribute: "id",
        header: "Opciones",
        template: "opciones",
        default: 'false'
      },
    ];
  }

  update(id: string) {
    // this.router.navigate(["materials", id]);
    this.showModalMaterial(id);
  }

  delete(material: Material) {
    this.dialogService.open({
      message: `Esta seguro de que desea eliminar La Informacion de ${material.description}?`,
    });
    this.dialogService.confirmed().subscribe((confirmed) => {
      if (confirmed) {
        this.materialsService.remove(material.id || '').subscribe(
          (data) => {
            this.toastr.success("Material eliminado con exito!.");
            this.table.refresh();
          },
          (error: HttpErrorResponse) => {
            this.toastr.error(
              error.error.mesaage ||
              "No se logro eliminar el Material"
            );
          }
        );
      }
    });
  }

  showModalMaterial(id?: string) {
    const dialogRef = this.dialog.open(CreateAndEditMaterialComponent, {
      data: { id },
    });
    dialogRef.afterClosed().subscribe(result => {
      this.table.refresh();
      console.log(`Dialog result: ${result}`);
    });
  }
}
