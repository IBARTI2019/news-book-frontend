import { Component, OnInit, ViewChild } from '@angular/core';
import { AccessEntryService } from '../../../../services/access-entry.service';
import { DTColumn, DTFilters } from '../../../../componentes/generic-table/interface';
import { GenericTableComponent } from '../../../../componentes/generic-table/generic-table.component';
import { MatDialog } from '@angular/material/dialog';
import { AccessEntryFormComponent } from '../access-form/access-form.component';
import { AccessEntryModel } from '../../../../interfaces';
import { ConfirmDialogComponent } from '../../../../componentes/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-person-access-list',
  templateUrl: './person-access-list.component.html',
  styleUrls: ['./person-access-list.component.scss']
})
export class PersonAccessListComponent implements OnInit {
  @ViewChild('table') table!: GenericTableComponent;

  columns: DTColumn[] = [
    { attribute: 'title', header: 'Título' },
    { attribute: 'description', header: 'Empresa' },
    { dataAttribute: 'access_type', attribute: 'access_type_display', header: 'Tipo', type: 'text' },
    { dataAttribute: 'group__name', attribute: 'group_display.name', header: 'Grupo' },
    { attribute: 'date', header: 'Fechas', template: 'date_range' },
    { attribute: 'time', header: 'Horas', template: 'time_range', hideFilter: true },
    { attribute: 'actions', header: 'Acciones', template: 'opciones', hideFilter: true }
  ];

  filters: DTFilters = {
    2: {
      type: 'select',
      options: [
      { value: AccessEntryService.SINGLE, description: 'Simple' },
      { value: AccessEntryService.RECURRING, description: 'Recurrente' },  
      ],
      optionValueAttribute: 'value',
      optionDisplayAttribute: 'description' 
    },
    4: {
      type: 'range',
      dataType: 'date'
    }
  };

  constructor(
    public accessEntryService: AccessEntryService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void { }

  openNewAccess() {
    const dialogRef = this.dialog.open(AccessEntryFormComponent, {
      width: '500px',
      data: { }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.table.refresh();
      }
    });
  }

  editAccess(access: AccessEntryModel) {
    const dialogRef = this.dialog.open(AccessEntryFormComponent, {
      width: '500px',
      data: { ...access }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.table.refresh();
      }
    });
  }

  deleteAccess(access: AccessEntryModel) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {data: {title: 'Eliminar acceso', message: '¿Estás seguro de querer eliminar este acceso?', confirmText: 'Eliminar', cancelText: 'Cancelar'}});
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.accessEntryService.deleteAccessEntry(access.id).subscribe(() => this.table.refresh());
      }
    });
  }

} 