import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { ConfirmDialogService } from "../../../componentes/confirm-dialog/confirm-dialog.service";
import { GenericTableComponent } from "../../../componentes/generic-table/generic-table.component";
import { DTColumn } from "../../../componentes/generic-table/interface";
import { PersonService } from "../../../services/person.service";
import { Person } from "../../../interfaces";
import { HttpErrorResponse } from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import { CreateAndEditPersonComponent } from "./create-and-edit-person/create-and-edit-person.component";

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
    private toastr: ToastrService,
    public dialog: MatDialog
  ) { }

  showCheck = () => true

  ngOnInit(): void {
    this.columns = [
      {
        dataAttribute: "code",
        header: "Cod Persona",
      },
      {
        dataAttribute: "name",
        header: "Nombres",
      },
      {
        dataAttribute: "last_name",
        header: "Apellidos",
      },
      {
        dataAttribute: "doc_ident",
        header: "Cedula",
      },
      {
        dataAttribute: "address",
        header: "Direccion",
      },
      {
        dataAttribute: "phone",
        header: "Telefono Hab.",
      },
      {
        dataAttribute: "mobile",
        header: "Celular",
      },
      {
        dataAttribute: "type_person_display.description",
        header: "Tipo de Persona",
      },
      {
        header: "Activo",
        dataAttribute: "is_active",
        attribute: "is_active",
        type: "bool"
      },
      {
        header: "Lista Negra",
        dataAttribute: "blacklist",
        attribute: "blacklist",
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
    // this.router.navigate(["person", id]);
    this.showModalPerson(id);
  }

  delete(person: Person) {
    this.dialogService.open({
      message: `Esta seguro de que desea eliminar La Informacion de ${person.name}?`,
    });
    this.dialogService.confirmed().subscribe((confirmed) => {
      if (confirmed) {
        this.personService.remove(person.id).subscribe(
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

  showModalPerson(id?: string) {
    const dialogRef = this.dialog.open(CreateAndEditPersonComponent, {
      minWidth: '400px',
      width: '650px',
      data: {
        id: id
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result) {
        this.table.refresh();
      }
    });
  }
}
