import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmDialogService } from 'app/componentes/confirm-dialog/confirm-dialog.service';
import { GenericTableComponent } from 'app/componentes/generic-table/generic-table.component';
import { DTColumn } from 'app/componentes/generic-table/interface';
import { NotificationSetting } from 'app/interfaces';
import { ToastrService } from 'ngx-toastr';
import { SettingNotificationService } from "../../../services/setting-notification.service";

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  @ViewChild("table") table!: GenericTableComponent;
  columns: DTColumn[] = [];
  constructor(
    public settingNotificationService: SettingNotificationService,
    private router: Router,
    private dialogService: ConfirmDialogService,
    private toastr: ToastrService
  ) { }

  showCheck = () => true;

  ngOnInit(): void {
    this.columns = [
      {
        header: "Descripción",
        attribute: "description",
      },
      {
        header: "Tipo",
        attribute: "type_display",
      },
      {
        header: "Grupos",
        attribute: "groups"
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
    this.router.navigate(["notification", id]);
  }

  delete(notification: NotificationSetting) {
    this.dialogService.open({
      message: `Esta seguro de que desea eliminar La Informacion de ${notification.description}?`,
    });
    this.dialogService.confirmed().subscribe((confirmed) => {
      if (confirmed) {
        this.settingNotificationService.remove(notification.id || '').subscribe(
          (data) => {
            this.toastr.success("Eliminado con exito!.");
            this.table.refresh();
          },
          (error: HttpErrorResponse) => {
            this.toastr.error(
              error.error.mesaage ||
              "No se logro eliminar"
            );
          }
        );
      }
    });
  }
}
