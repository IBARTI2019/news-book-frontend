import { Component, OnInit, ViewChild } from '@angular/core';
import { UsuarioService } from '../servicios/usuario.service';
import { DTColumn } from 'app/componentes/generic-table/interface';
import { Usuario } from '../servicios/interface';
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
        dataAttribute: 'cod_person',
        attribute: "Cod Persona",
      },
      {
        dataAttribute: 'name',
        attribute: 'Nombres'
      },
      {
        dataAttribute: 'lastname',
        attribute: 'Apellidos'
      },
       {
        dataAttribute: 'doc_ident',
        attribute: 'Cedula'
      },
      {
        dataAttribute: 'addres',
        attribute: 'Direccion'
      },
      {
        dataAttribute: 'phono',
        attribute: 'Telefono Hab.'
      },
      {
        dataAttribute: 'movil',
        attribute: 'Celular'
      },
      {
        dataAttribute: 'id_type_person',
        attribute: 'Tipo de Persona'
      },
       {
        dataAttribute: 'status',
        attribute: 'Statu'
      },
      {
        attribute: "id_person",
        header: "Opciones",
        template: "opciones"
      },
    ]
  }

  editar(id: string) {
    this.router.navigate(['personas/maestro/editar', id]);
  }

  eliminar(usuario: Usuario) {
    this.dialogService.open({ message: `Esta seguro de que desea eliminar La Informacion de ${usuario.name}?`, });
    this.dialogService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        this.usuarioService.remove(usuario.id_person).subscribe(data => {
          this.toastr.success("Datos eliminado con exito!.");
          this.tabla.refresh();
        }, error => {
          this.toastr.success("Ocurrio un error al intentar eliminar los datos de la Persona");
          this.tabla.refresh();
        });
      }
    });
  }

}
