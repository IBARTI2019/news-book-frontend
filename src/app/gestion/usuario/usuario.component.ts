import { Component, OnInit } from '@angular/core';
import { DTColumn } from 'app/componentes/generic-table/interface';
import { UsuarioG } from '../servicios/interface';
import { UsuarioServiceG } from '../servicios/usuariog.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  columns: DTColumn[] = [];
  params: any = { params: 'Ejemplo' };
  constructor(public usuarioService: UsuarioServiceG) { }

  ngOnInit(): void {
    this.columns = [
      {
        attribute: 'nombre',
        header: "Nombre"
      },
      {
        attribute: 'apellido',
        header: "Apellido"
      },
      {
        attribute: '_id',
        header: 'Opciones',
        template: 'opc'
      }
    ];
  }

  editar(id: string) {
    console.log(id);

  }

  eliminar(usuario: UsuarioG) {
    console.log('Eliminar', usuario);

  }
}
