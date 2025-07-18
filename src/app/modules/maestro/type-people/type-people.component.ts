import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { ConfirmDialogService } from "../../../componentes/confirm-dialog/confirm-dialog.service";
import { GenericTableComponent } from "../../../componentes/generic-table/generic-table.component";
import { DTColumn } from "../../../componentes/generic-table/interface";
import { TypePeople } from "../../../interfaces";
import { TypePeopleService } from "../../../services/type-people.service";

@Component({
  selector: "app-type-people",
  templateUrl: "./type-people.component.html",
  styleUrls: ["./type-people.component.css"],
})
export class TypePeopleComponent implements OnInit {
  @ViewChild("table") table!: GenericTableComponent;
  columns: DTColumn[] = [];
  constructor(
    public typePeopleService: TypePeopleService,
    private router: Router,
    private dialogService: ConfirmDialogService,
    private toastr: ToastrService
  ) { }

  showCheck = () => true;

  ngOnInit(): void {
    this.columns = [
      {
        dataAttribute: "description",
        header: "Descripción",
      },
      {
        dataAttribute: "priority",
        header: "Prioridad",
      },
      {
        dataAttribute: "is_institution",
        header: "Institución",
        type: "bool",
      },
      {
        dataAttribute: "requires_company_data",
        header: "Requiere datos de empresa",
        type: "bool",
      },
      {
        dataAttribute: "requires_guide_number",
        header: "Requiere numero de guía o factura",
        type: "bool",
      },
      {
        dataAttribute: "requires_access_verification",
        header: "Requiere verificación de acceso",
        type: "bool",
      },
      {
        dataAttribute: "is_active",
        header: "Activo",
        type: "bool",
      },

      {
        attribute: "id",
        header: "Opciones",
        template: "opciones",
      },
    ];
  }

  update(id: string) {
    this.router.navigate(["type-people", id]);
  }

  delete(typePeople: TypePeople) {
    this.dialogService.open({
      message: `Esta seguro de que desea eliminar el Tipo de Persona ${typePeople.description}?`,
    });
    this.dialogService.confirmed().subscribe((confirmed) => {
      if (confirmed) {
        this.typePeopleService.remove(typePeople.id).subscribe(
          (data) => {
            this.toastr.success("Tipo de Persona eliminado con exito!.");
            this.table.refresh();
          },
          (error: HttpErrorResponse) => {
            this.toastr.error(
              error.error.message ||
              "Ocurrio un error al intentar eliminar el Tipo de Persona."
            );
          }
        );
      }
    });
  }
}
