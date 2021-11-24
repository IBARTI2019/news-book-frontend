import { Component, OnInit, ViewChild } from "@angular/core";
import { GenericTableComponent } from "../../../componentes/generic-table/generic-table.component";
import { DTColumn } from "../../../componentes/generic-table/interface";
import { NewService } from "../../../services/new.service";
import { Router } from "@angular/router";
import { ConfirmDialogService } from "../../../componentes/confirm-dialog/confirm-dialog.service";
import { ToastrService } from "ngx-toastr";
import { New } from "../../../interfaces";
import { HttpErrorResponse } from "@angular/common/http";
import { SessionService } from 'app/services/session.service';

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
    private sessionService: SessionService,
    private router: Router,
    private dialogService: ConfirmDialogService,
    private toastr: ToastrService
  ) { }

  showCheck = () => true;

  ngOnInit() {
    this.columns = [
      {
        header: "#",
        attribute: "number",
      },
      {
        header: "Tipo",
        attribute: "type_news_display.description",
      },
      {
        attribute: "employee",
        header: "Registrado Por",
      },
      {
        attribute: "created",
        header: "Fecha de creación",
        type: "date"
      },
      /*       {
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
