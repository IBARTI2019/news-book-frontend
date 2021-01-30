import { Component } from '@angular/core';
import { UsuarioService } from 'app/seguridad/servicios/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: []
})
export class AppHeaderComponent {
  constructor(private router: Router, private usuarioService: UsuarioService) { }

  logout() {
    this.usuarioService.logout();
  }
}