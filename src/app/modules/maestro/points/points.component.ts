import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Point } from '../../../interfaces';
import { PointsService } from '../../../services/points.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogService } from '../../../componentes/confirm-dialog/confirm-dialog.service';
import { GenericTableComponent } from "../../../componentes/generic-table/generic-table.component";
import { DTColumn } from "../../../componentes/generic-table/interface";

@Component({
  selector: 'app-points',
  templateUrl: './points.component.html',
  styleUrls: ['./points.component.css']
})
export class PointsComponent implements OnInit {
  @ViewChild("table") table!: GenericTableComponent;
  columns: DTColumn[] = [];
  constructor(
    public pointsService: PointsService,
    private router: Router,
    private dialogService: ConfirmDialogService,
    private toastr: ToastrService
  ) { }

  showCheck = () => true;

  ngOnInit(): void {
    this.columns = [
      {
        dataAttribute: "code",
        attribute: "Código",
      },
      {
        dataAttribute: "name",
        attribute: "Nombre",
      },
      {
        dataAttribute: "is_active",
        attribute: "Activo",
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
    this.router.navigate(["pints", id]);
  }

  delete(book: Point) {
    this.dialogService.open({
      message: `Esta seguro de que desea eliminar La Informacion de ${book.name}?`,
    });
    this.dialogService.confirmed().subscribe((confirmed) => {
      if (confirmed) {
        this.pointsService.remove(book.id || '').subscribe(
          (data) => {
            this.toastr.success("punto eliminado con exito!.");
            this.table.refresh();
          },
          (error: HttpErrorResponse) => {
            this.toastr.error(
              error.error.mesaage ||
              "No se logro eliminar el punto"
            );
          }
        );
      }
    });
  }
}
