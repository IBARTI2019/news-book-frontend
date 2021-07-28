import { Component, OnInit, ViewChild } from '@angular/core';
import { UsuarioService } from '../servicios/usuario.service';
import { DTColumn } from 'app/componentes/generic-table/interface';
import { listemail } from '../servicios/interface';
import { Router } from '@angular/router';
import { ConfirmDialogService } from 'app/componentes/confirm-dialog/confirm-dialog.service';
import { ToastrService } from 'ngx-toastr';
import { GenericTableComponent } from 'app/componentes/generic-table/generic-table.component';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  @ViewChild('tabla') tabla!: GenericTableComponent;
  columns: DTColumn[] = [];
  constructor(public usuarioService: UsuarioService, private router: Router,
    private dialogService: ConfirmDialogService, private toastr: ToastrService) { }

  showCheck = () => { return true; }
  ngOnInit(): void {
    this.columns = [
      {
        dataAttribute: 'name',
        attribute: "Nombres",
      },
      {
        dataAttribute: 'last_name',
        attribute: 'Apellidos'
      },
       {
        dataAttribute: 'email',
        attribute: 'Email'
      },
      {
        dataAttribute: 'is_active',
        attribute: 'Estatus'
      },
      
      {
        attribute: "id_listemail",
        header: "Opciones",
        template: "opciones"
      },
    ]
  }

  editar(id: string) {
    this.router.navigate(['listemail/maestro/', id]);
  }

  eliminar(plantillaemail: listemail) {
    this.dialogService.open({ message: `Esta seguro de que desea eliminar la Informacion ${plantillaemail.name}?`, });
    this.dialogService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        this.usuarioService.remove(plantillaemail.id_listemail).subscribe(data => {
          this.toastr.success("Datos eliminado con exito!.");
          this.tabla.refresh();
        }, error => {
          this.toastr.success("Ocurrio un error al intentar eliminar la informacion");
          this.tabla.refresh();
        });
      }
    });
  }

}
