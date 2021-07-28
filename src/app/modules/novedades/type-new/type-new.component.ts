import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from '@angular/router';
import { ConfirmDialogService } from 'app/componentes/confirm-dialog/confirm-dialog.service';
import { GenericTableComponent } from "app/componentes/generic-table/generic-table.component";
import { DTColumn } from "app/componentes/generic-table/interface";
import { TypeNew } from 'app/interfaces';
import { ToastrService } from 'ngx-toastr';
import { TypeNewService } from '../../../services/type-new.service'

@Component({
  selector: "app-type-new",
  templateUrl: "./type-new.component.html",
  styleUrls: ["./type-new.component.css"],
})
export class TypeNewComponent implements OnInit {
  @ViewChild("table") tabla!: GenericTableComponent;
  columns: DTColumn[] = [];
  constructor(
    public typeNewService: TypeNewService,
    private router: Router,
    private dialogService: ConfirmDialogService,
    private toastr: ToastrService,
  ) {}

  showCheck = () => true;

  ngOnInit(): void {
    this.columns = [
      {
        dataAttribute: "description",
        attribute: "Descripcion",
      },
      {
        dataAttribute: "is_active",
        attribute: "is_active",
      },

      {
        attribute: "id",
        header: "Opciones",
        template: "opciones",
      },
    ];
  }

  update(id: string) {
    this.router.navigate(["type-new/", id]);
  }

  delete(typeNew: TypeNew) {
    this.dialogService.open({
      message: `Esta seguro de que desea eliminar el Type News ${typeNew.description}?`,
    });
    this.dialogService.confirmed().subscribe((confirmed) => {
      if (confirmed) {
        this.typeNewService.remove(typeNew.id).subscribe(
          (data) => {
            this.toastr.success("El Tipo de Novedad ha sido eliminado con exito!.");
            this.tabla.refresh();
          },
          (error: HttpErrorResponse) => {
            this.toastr.error(
              error.error.message ||
              "Ocurrio un error al intentar eliminar el Tipo de Novedad"
            );
          }
        );
      }
    });
  }
}
