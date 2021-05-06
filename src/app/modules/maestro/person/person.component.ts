import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { ConfirmDialogService } from "../../../componentes/confirm-dialog/confirm-dialog.service";
import { GenericTableComponent } from "../../../componentes/generic-table/generic-table.component";
import { DTColumn } from "../../../componentes/generic-table/interface";
import { PersonService } from "../../../services/person.service";
import { Person } from "../../../interfaces";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "app-person",
  templateUrl: "./person.component.html",
  styleUrls: ["./person.component.css"],
})
export class PersonComponent implements OnInit {
  @ViewChild("table") table!: GenericTableComponent;
  columns: DTColumn[] = [];
  constructor(
    public personService: PersonService,
    private router: Router,
    private dialogService: ConfirmDialogService,
    private toastr: ToastrService
  ) {}

  showCheck = () => true

  ngOnInit(): void {
    this.columns = [
      {
        dataAttribute: "cod_person",
        attribute: "Cod Persona",
      },
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
        dataAttribute: "addres",
        attribute: "Direccion",
      },
      {
        dataAttribute: "phono",
        attribute: "Telefono Hab.",
      },
      {
        dataAttribute: "movil",
        attribute: "Celular",
      },
      {
        dataAttribute: "type_person.description",
        attribute: "Tipo de Persona",
      },
      {
        dataAttribute: "status",
        attribute: "Status",
      },
      {
        attribute: "id_person",
        header: "Opciones",
        template: "opciones",
      },
    ];
  }

  update(id: string) {
    this.router.navigate(["inicio/person", id]);
  }

  delete(person: Person) {
    this.dialogService.open({
      message: `Esta seguro de que desea eliminar La Informacion de ${person.name}?`,
    });
    this.dialogService.confirmed().subscribe((confirmed) => {
      if (confirmed) {
        this.personService.remove(person.id_person || '').subscribe(
          (data) => {
            this.toastr.success("Datos eliminado con exito!.");
            this.table.refresh();
          },
          (error: HttpErrorResponse) => {
            this.toastr.error(
              error.error.message ||
                "Ocurrio un error al intentar eliminar los datos de la Persona"
            );
          }
        );
      }
    });
  }
}