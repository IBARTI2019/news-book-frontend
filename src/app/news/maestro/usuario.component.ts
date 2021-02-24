import { Component, OnInit, ViewChild } from '@angular/core';
import { UsuarioService } from '../servicios/usuario.service';
import { DTColumn } from 'app/componentes/generic-table/interface';
import { Usuario } from '../servicios/interface';
import { Router } from '@angular/router';
import { ConfirmDialogService } from 'app/componentes/confirm-dialog/confirm-dialog.service';
import { ToastrService } from 'ngx-toastr';
import { GenericTableComponentf } from 'app/componentes/tablefree/generic-table.component';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  @ViewChild('tabla') tabla!: GenericTableComponentf;
  columns: DTColumn[] = [];
  constructor(public usuarioService: UsuarioService, private router: Router,
    private dialogService: ConfirmDialogService, private toastr: ToastrService) { }

  showCheck = () => { return true; }
  ngOnInit(): void {
    this.columns = [
      {
        dataAttribute: 'notice',
        attribute: "Noticia",
      },
      {
        dataAttribute: 'ced_notifica',
        attribute: 'Cedula'
      },
      {
        dataAttribute: 'nombres_apellidos',
        attribute: 'Nombres Y Apellidos'
      },
          
     {
        attribute: "id_news",
        header: "Opciones",
        template: "opciones"
      },
    ]
  }

  editar(id: string) {
    this.router.navigate(['inicio/news/maestro/', id]);
  }

  eliminar(usuario: Usuario) {
    this.dialogService.open({ message: `Esta seguro de que desea eliminar La Informacion de ${usuario.id_news}?`, });
    this.dialogService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        this.usuarioService.remove(usuario.id_news).subscribe(data => {
          this.toastr.success("Datos eliminado con exito!.");
          this.tabla.refresh();
        }, error => {
          this.toastr.success("Ocurrio un error al intentar eliminar los datos del Material");
          this.tabla.refresh();
        });
      }
    });
  }

}
