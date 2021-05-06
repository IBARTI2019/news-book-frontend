import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { ConfirmDialogService } from "app/componentes/confirm-dialog/confirm-dialog.service";
import { GenericTableComponent } from "app/componentes/generic-table/generic-table.component";
import { DTColumn } from "app/componentes/generic-table/interface";
import { ToastrService } from "ngx-toastr";
import { Material } from "../../../interfaces/index";
import { MaterialsService } from "../../../services/materials.service";

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
    private toastr: ToastrService
  ) {}

  showCheck = () => true;

  ngOnInit(): void {
    this.columns = [
      {
        dataAttribute: "cod_material",
        attribute: "Cod Material",
      },
      {
        dataAttribute: "serial_material",
        attribute: "Serial Material",
      },
      {
        dataAttribute: "description",
        attribute: "Descripcion",
      },
      {
        dataAttribute: "id_warehouse",
        attribute: "Almacen",
      },

      {
        dataAttribute: "status",
        attribute: "Status",
      },
      {
        attribute: "id_material",
        header: "Opciones",
        template: "opciones",
      },
    ];
  }

  update(id: string) {
    this.router.navigate(["inicio/materials", id]);
  }

  delete(material: Material) {
    this.dialogService.open({
      message: `Esta seguro de que desea eliminar La Informacion de ${material.description}?`,
    });
    this.dialogService.confirmed().subscribe((confirmed) => {
      if (confirmed) {
        this.materialsService.remove(material.id_material || '').subscribe(
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
}