import { Component, OnInit, ViewChild } from '@angular/core';
import { UsuarioService } from '../servicios/usuario.service';
import { DTColumn } from 'app/componentes/generic-table/interface';
import { Plantilla } from '../servicios/interface';
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
        dataAttribute: 'descripcion',
        attribute: "Descripcion",
      },
      {
        dataAttribute: 'abreviado',
        attribute: 'Abreviado'
      },
      {
        dataAttribute: 'estatus',
        attribute: 'Status'
      },
      
      {
        attribute: "id_plantilla",
        header: "Opciones",
        template: "opciones"
      },
    ]
  }

  editar(id: string) {
    this.router.navigate(['inicio/plantillas/maestro/', id]);
  }

  eliminar(plantilla: Plantilla) {
    this.dialogService.open({ message: `Esta seguro de que desea eliminar el Tipo de Plantilla ${plantilla.descripcion}?`, });
    this.dialogService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        this.usuarioService.remove(plantilla.id_plantilla).subscribe(data => {
          this.toastr.success("Plantilla eliminado con exito!.");
          this.tabla.refresh();
        }, error => {
          this.toastr.success("Ocurrio un error al intentar eliminar la plantilla");
          this.tabla.refresh();
        });
      }
    });
  }

}
