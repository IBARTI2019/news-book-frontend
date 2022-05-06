import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmDialogService } from 'app/componentes/confirm-dialog/confirm-dialog.service';
import { GenericTableComponent } from 'app/componentes/generic-table/generic-table.component';
import { DTColumn } from 'app/componentes/generic-table/interface';
import { Schedule } from 'app/interfaces';
import { ScheduleService } from 'app/services/schedule.service';
import { ToastrService } from 'ngx-toastr';
import { CreateAndEditScheduleComponent } from './create-and-edit-schedule/create-and-edit-schedule.component';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  @ViewChild("table") table!: GenericTableComponent;
  columns: DTColumn[] = [];
  constructor(
    public scheduleService: ScheduleService,
    private router: Router,
    private dialogService: ConfirmDialogService,
    private toastr: ToastrService,
    public dialog: MatDialog
  ) { }

  showCheck = () => true;

  ngOnInit(): void {
    this.columns = [
      {
        header: "Descripción",
        attribute: "description",
      },
      {
        header: "Hora inicial",
        attribute: "start_time",
      },
      {
        header: "Hora final",
        attribute: "final_hour",
      },
      {
        header: "Activo",
        attribute: "is_active",
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
    // this.router.navigate(["person", id]);
    this.showModalSchedule(id);
  }

  showModalSchedule(id?: string) {
    const dialogRef = this.dialog.open(CreateAndEditScheduleComponent, {
      data: { id },
    });
    dialogRef.afterClosed().subscribe(result => {
      this.table.refresh();
      console.log(`Dialog result: ${result}`);
    });
  }

  delete(schedule: Schedule) {
    this.dialogService.open({
      message: `Esta seguro de que desea eliminar La Informacion de ${schedule.description}?`,
    });
    this.dialogService.confirmed().subscribe((confirmed) => {
      if (confirmed) {
        this.scheduleService.remove(schedule.id || '').subscribe(
          (data) => {
            this.toastr.success("Horario eliminado con exito!.");
            this.table.refresh();
          },
          (error: HttpErrorResponse) => {
            this.toastr.error(
              error.error.mesaage ||
              "No se logro eliminar el Horario"
            );
          }
        );
      }
    });
  }
}
