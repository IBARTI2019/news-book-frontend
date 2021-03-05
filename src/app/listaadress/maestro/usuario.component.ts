import { Component, OnInit, ViewChild } from '@angular/core';
import { UsuarioService } from '../servicios/usuario.service';
import { DTColumn } from 'app/componentes/generic-table/interface';
import { listaadress} from '../servicios/interface';
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
        dataAttribute: 'ipinternet',
        attribute: "Ip Internet",
      },
      {
        dataAttribute: 'ubicacionpc',
        attribute: 'Ubicada?'
      },
       {
        dataAttribute: 'macadress',
        attribute: 'Mascara de Red'
      },
      {
        dataAttribute: 'status',
        attribute: 'Estatus'
      },
      
      {
        attribute: "id_listaadress",
        header: "Opciones",
        template: "opciones"
      },
    ]
  }

  editar(id: string) {
    this.router.navigate(['inicio/listaadress/maestro/', id]);
  }

  eliminar(modelo: listaadress) {
    this.dialogService.open({ message: `Esta seguro de que desea eliminar la Informacion ${modelo.macadress}?`, });
    this.dialogService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        this.usuarioService.remove(modelo.id_listaadress).subscribe(data => {
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
