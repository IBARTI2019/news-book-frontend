import { Component, OnInit, ViewChild } from "@angular/core";
import { GenericTableComponent } from "../../../componentes/generic-table/generic-table.component";
import { DTColumn, DTFilters } from "../../../componentes/generic-table/interface";
import { NewService } from "../../../services/new.service";
import { Router } from "@angular/router";
import { ConfirmDialogService } from "../../../componentes/confirm-dialog/confirm-dialog.service";
import { ToastrService } from "ngx-toastr";
import { New, TypeNew, TypePeople } from "../../../interfaces";
import { HttpErrorResponse } from "@angular/common/http";
import { SessionService } from '../../../services/session.service';
import { TypeNewService } from "../../../services/type-new.service";
import { TypePeopleService } from '../../../services/type-people.service';

@Component({
  selector: "app-new",
  templateUrl: "./new.component.html",
  styleUrls: ["./new.component.css"],
})
export class NewComponent implements OnInit {
  @ViewChild("table") table!: GenericTableComponent;
  columns: DTColumn[] = [];
  filters: DTFilters = {
    0: {
      type: 'range',
      dataType: 'number'
    },
    1: {
      type: 'select',
      optionValueAttribute: 'id',
      optionDisplayAttribute: 'description',
      multiple: true,
    },
    3: {
      type: 'range',
      dataType: 'date'
    },
    4: {
      type: 'select',
      optionValueAttribute: 'id',
      optionDisplayAttribute: 'description',
    },
    5: {
      type: 'callable',
    }
  };
  params = { query: "{id, number, type_news_display {id, code, description}, employee, created, contains_attached_files, person_types_details}" }
  typesPerson: TypePeople[] = [];

  constructor(
    public newService: NewService,
    private sessionService: SessionService,
    private typeNewService: TypeNewService,
    private typePersonService: TypePeopleService,
    private router: Router,
    private dialogService: ConfirmDialogService,
    private toastr: ToastrService
  ) { }

  showCheck = () => true;

  ngOnInit() {
    this.getTypesPerson();
    this.typeNewService.list({ not_paginator: true, query: `{id, description}`, filtered: true }).subscribe((data: TypeNew[]) => {
      this.filters[1] = {
        ...{
          type: 'select',
          optionValueAttribute: 'id',
          optionDisplayAttribute: 'description',
          multiple: true,
          options: data,
        }
      }
    });
    this.columns = [
      {
        header: "Número",
        attribute: "number",
      },
      {
        header: "Tipo",
        template: "type",
        dataAttribute: "type_news_id",
      },
      {
        attribute: "employee",
        header: "Registrado Por",
      },
      {
        dataAttribute: "created",
        attribute: "created",
        header: "Fecha de Creación",
        type: "date"
      },
      {
        dataAttribute: "person_type",
        attribute: "person_types_details",
        header: "Tipos de persona",
        template: "personTypes"
      },
      {
        attribute: "contains_attached_files",
        header: "Contiene adjuntos",
        type: "bool"
      },
      {
        attribute: "id",
        header: "Opciones",
        template: "opciones",
        hideFilter: true
      },
    ];
  }

  getTypesPerson() {
    this.typePersonService.list({ not_paginator: true }).subscribe(data => {
      this.typesPerson = data;
      this.filters[4]!.options = data;
    })
  }

  view(id: string) {
    this.router.navigate(["new/view", id]);
  }

  delete(localNew: New) {
    this.dialogService.open({
      message: `Esta seguro de que desea eliminar La Informacion de ${localNew.id}?`,
    });
    this.dialogService.confirmed().subscribe((confirmed) => {
      if (confirmed) {
        this.newService.remove(localNew.id).subscribe(
          (data) => {
            this.toastr.success("Se elimino correctamente.");
            this.table.refresh();
          },
          (error: HttpErrorResponse) => {
            this.toastr.error(
              error.error.message || "No se pudo eliminar la novedad"
            );
          }
        );
      }
    });
  }
}
