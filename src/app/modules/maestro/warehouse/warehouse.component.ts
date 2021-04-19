import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmDialogService } from 'app/componentes/confirm-dialog/confirm-dialog.service';
import { GenericTableComponent } from 'app/componentes/generic-table/generic-table.component';
import { DTColumn } from 'app/componentes/generic-table/interface';
import { User, Warehouse } from 'app/interfaces';
import { ToastrService } from 'ngx-toastr';
import { WarehouseService } from '../../../services/warehouse.service'

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.css']
})
export class WarehouseComponent implements OnInit {
  @ViewChild('table') table!: GenericTableComponent;
  columns: DTColumn[] = [];

  constructor(
    public warehouseService: WarehouseService,
    private router: Router,
    private dialogService: ConfirmDialogService,
    private toastr: ToastrService,
  ) { }

  showCheck = () => true

  ngOnInit(): void {
    this.columns = [
      {
        dataAttribute: 'descripcion',
        attribute: "Descripcion",
      },
      {
        dataAttribute: 'status',
        attribute: 'Status'
      },
      {
        attribute: "id_warehouse",
        header: "Opciones",
        template: "opciones"
      },
    ]
  }

  edit(id_warehouse: string) {
    console.log('Warehouse id: ', id_warehouse)
    this.router.navigate(['inicio/warehouse', id_warehouse]);
  }

  delete(warehouse: Warehouse) {
    this.dialogService.open({ message: `Esta seguro de que desea eliminar el almacen ${warehouse.descripcion}?`, });
    this.dialogService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        this.warehouseService.remove(warehouse.id_warehouse).subscribe(data => {
          this.toastr.success("Almacen eliminado con exito!.");
          this.table.refresh();
          
        }, (error: HttpErrorResponse) => {
          this.toastr.error(error.error.message || 'No se pudo eliminar el almacen');
          this.table.refresh();
        });
      }
    });
  }
}
