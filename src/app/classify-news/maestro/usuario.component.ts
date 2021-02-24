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
        dataAttribute: 'description',
        attribute: "Descripcion",
      },
      {
        dataAttribute: 'level_urgency',
        attribute: 'Nivel Urgencia'
      },
      {
        dataAttribute: 'status',
        attribute: 'Status'
      },
      
      {
        attribute: "id_classify",
        header: "Opciones",
        template: "opciones"
      },
    ]
  }

  editar(id: string) {
    this.router.navigate(['inicio/classify-news/maestro/', id]);
  }

  eliminar(usuario: Usuario) {
    this.dialogService.open({ message: `Esta seguro de que desea eliminar el Classify News ${usuario.description}?`, });
    this.dialogService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        this.usuarioService.remove(usuario.id_classify).subscribe(data => {
          this.toastr.success("Classify News eliminado con exito!.");
          this.tabla.refresh();
        }, error => {
          this.toastr.success("Ocurrio un error al intentar eliminar la Classify News");
          this.tabla.refresh();
        });
      }
    });
  }

}
