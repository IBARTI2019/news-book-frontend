import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmDialogService } from '../../../componentes/confirm-dialog/confirm-dialog.service';
import { User } from 'app/interfaces';
import { GenericTableComponent } from '../../../componentes/generic-table/generic-table.component';
import { DTColumn } from '../../../componentes/generic-table/interface';
import { UserService } from '../../../services/user.service'
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  @ViewChild("table") table!: GenericTableComponent;
  columns: DTColumn[] = [];

  constructor(public userService: UserService, private router: Router, private dialogService: ConfirmDialogService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.columns = [
      {
        dataAttribute: "name",
        attribute: "Nombre",
      },
      {
        dataAttribute: "code",
        attribute: "Usuario",
      },
      {
        dataAttribute: "email",
        attribute: "Correo",
      },
      {
        dataAttribute: "phone",
        attribute: "Telefono",
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
    this.router.navigate(["security", 'user', id]);
  }

  delete(user: User) {
    this.dialogService.open({
      message: `Esta seguro de que desea eliminar La Informacion de ${user.code}?`,
    });
    this.dialogService.confirmed().subscribe((confirmed) => {
      if (confirmed) {
        this.userService.remove(user.id || '').subscribe(
          (data) => {
            this.toastr.success("Usuario eliminado con exito!.");
            this.table.refresh();
          },
          (error: HttpErrorResponse) => {
            this.toastr.error(
              error.error.mesaage ||
              "No se logro eliminar el Usuario"
            );
          }
        );
      }
    });
  }

}
