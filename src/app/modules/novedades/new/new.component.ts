import { Component, OnInit, ViewChild } from "@angular/core";
import { GenericTableComponent } from "../../../componentes/generic-table/generic-table.component";
import { DTColumn } from "../../../componentes/generic-table/interface";
import { NewService } from "../../../services/new.service";
import { Router } from "@angular/router";
import { ConfirmDialogService } from "../../../componentes/confirm-dialog/confirm-dialog.service";
import { ToastrService } from 'ngx-toastr';
import { New } from '../../../interfaces';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: "app-new",
  templateUrl: "./new.component.html",
  styleUrls: ["./new.component.css"],
})
export class NewComponent implements OnInit {
  @ViewChild("table") table!: GenericTableComponent;
  columns: DTColumn[] = [];

  constructor(
    public newService: NewService,
    private router: Router,
    private dialogService: ConfirmDialogService,
    private toastr: ToastrService,
  ) {}

  showCheck = () => true;

  ngOnInit(): void {
    this.columns = [
      {
        dataAttribute: "notice",
        attribute: "Noticia",
      },
      {
        dataAttribute: "ced_notifica",
        attribute: "Cedula",
      },
      {
        dataAttribute: "nombres_apellidos",
        attribute: "Quien Notifica?",
      },
      {
        dataAttribute: "createdAt",
        attribute: "Fecha y Hora",
      },
      {
        attribute: "id_news",
        header: "Opciones",
        template: "opciones",
      },
    ];
  }

  update(id: string) {
    this.router.navigate(["inicio/new", id]);
  }

  delete(localNew: New) {
    this.dialogService.open({
      message: `Esta seguro de que desea eliminar La Informacion de ${localNew.id_news}?`,
    });
    this.dialogService.confirmed().subscribe((confirmed) => {
      if (confirmed) {
        this.newService.remove(localNew.id_news).subscribe(
          (data) => {
            this.toastr.success("Se elimino correctamente.");
            this.table.refresh();
          },
          (error: HttpErrorResponse) => {
            this.toastr.error(
              error.error.message ||
              "No se pudo eliminar la novedad"
            );
          }
        );
      }
    });
  }
}
