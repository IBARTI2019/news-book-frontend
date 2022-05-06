import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmDialogService } from '../../../componentes/confirm-dialog/confirm-dialog.service';
import { GenericTableComponent } from '../../../componentes/generic-table/generic-table.component';
import { DTColumn } from '../../../componentes/generic-table/interface';
import { ToastrService } from 'ngx-toastr';
import { ClientsService } from "../../../services/clients.service";
import { Client } from '../../../interfaces';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
  @ViewChild("table") table!: GenericTableComponent;
  columns: DTColumn[] = [];
  constructor(
    public clientesService: ClientsService,
    private router: Router,
    private dialogService: ConfirmDialogService,
    private toastr: ToastrService
  ) { }
  
  showCheck = () => true;

  ngOnInit(): void {
    this.columns = [
      {
        dataAttribute: "name",
        header: "Nommbre del Cliente",
      },
      {
        dataAttribute: "schema_name",
        header: "Base de Datos",
      },
      {
        dataAttribute: "paid_until",
        header: "Fecha",
      },
      {
        dataAttribute: "on_trial",
        header: "En Juicio",
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
    this.router.navigate(["clientes", id]);
  }

  delete(cliente: Client) {
    this.dialogService.open({
      message: `Esta seguro de que desea eliminar la información de ${cliente.name}?`,
    });
    this.dialogService.confirmed().subscribe((confirmed) => {
      if (confirmed) {
        this.clientesService.remove(cliente.id || '').subscribe(
          (data) => {
            this.toastr.success("Cliente eliminado con exito!.");
            this.table.refresh();
          },
          (error: HttpErrorResponse) => {
            this.toastr.error(
              error.error.mesaage ||
              "No se logro eliminar el Cliente"
            );
          }
        );
      }
    });
  }
}
