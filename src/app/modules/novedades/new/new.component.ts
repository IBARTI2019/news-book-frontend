import { Component, OnInit, ViewChild } from "@angular/core";
import { GenericTableComponent } from "../../../componentes/generic-table/generic-table.component";
import { DTColumn, DTFilters } from "../../../componentes/generic-table/interface";
import { NewService } from "../../../services/new.service";
import { Router } from "@angular/router";
import { ConfirmDialogService } from "../../../componentes/confirm-dialog/confirm-dialog.service";
import { ToastrService } from "ngx-toastr";
import { New, TypeNew } from "../../../interfaces";
import { HttpErrorResponse } from "@angular/common/http";
import { SessionService } from 'app/services/session.service';
import { TypeNewService } from "app/services/type-new.service";

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
      type: 'callable',
    },
  };
  constructor(
    public newService: NewService,
    private sessionService: SessionService,
    private typeNewService: TypeNewService,
    private router: Router,
    private dialogService: ConfirmDialogService,
    private toastr: ToastrService
  ) { }

  showCheck = () => true;

  ngOnInit() {
    this.typeNewService.list({ not_paginator: true, query: `{id, description}` }).subscribe((data: TypeNew[]) => {
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
        attribute: "type_news_display.description",
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
          /*   {
              attribute: "info",
              header: "Data",
              template: 'info'
            }, */
      {
        attribute: "id",
        header: "Opciones",
        template: "opciones",
      },
    ];
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
