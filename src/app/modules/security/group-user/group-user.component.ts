import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmDialogService } from '../../../componentes/confirm-dialog/confirm-dialog.service';
import { GroupUser } from '../../../interfaces';
import { GenericTableComponent } from '../../../componentes/generic-table/generic-table.component';
import { DTColumn } from '../../../componentes/generic-table/interface';
import { UserGroupService } from '../../../services/user-group.service'
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-group-user',
  templateUrl: './group-user.component.html',
  styleUrls: ['./group-user.component.css']
})
export class GroupUserComponent implements OnInit {
  @ViewChild("table") table!: GenericTableComponent;
  columns: DTColumn[] = [];

  constructor(public groupService: UserGroupService, private router: Router, private dialogService: ConfirmDialogService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.columns = [
      {
        dataAttribute: "id",
        attribute: "Identificador",
      },
      {
        dataAttribute: "name",
        attribute: "Descripcion",
      },
      {
        attribute: "_id",
        header: "Opciones",
        template: "opciones",
        default: 'false'
      },
    ];
  }

  update(id: string) {
    this.router.navigate(["security", 'group', id]);
  }

  delete(group: GroupUser) {
    this.dialogService.open({
      message: `Esta seguro de que desea eliminar La Informacion de ${group.name}?`,
    });
    this.dialogService.confirmed().subscribe((confirmed) => {
      if (confirmed) {
        this.groupService.remove(group.id || '').subscribe(
          (data) => {
            this.toastr.success("Grupo eliminado con exito!.");
            this.table.refresh();
          },
          (error: HttpErrorResponse) => {
            this.toastr.error(
              error.error.mesaage ||
              "No se logro eliminar el Grupo"
            );
          }
        );
      }
    });
  }

}
