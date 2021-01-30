import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'app/seguridad/servicios/usuario.service'
import { Router } from '@angular/router';
import { Usuario } from 'app/seguridad/servicios/interface';
import { from } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  usuario: Usuario = {};

  errors: any;
  cargando = false;
  hide = true;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private toastrService: ToastrService
  ) {
  }

  ngOnInit() {
        if (this.usuarioService.isLoggedIn) {
          this.router.navigateByUrl('seguridad/login');
        } 
    this.errors = {};
  }

  doLogin(usuario: Usuario) {
    this.cargando = true;
    this.usuarioService.login(usuario.user, usuario.password).subscribe(
      (response: any) => {
        this.errors = {};
        this.router.navigateByUrl('/');
      },
      (result: any) => {
        if (result.error.challenge) {
          const challenge = result.error.challenge[0];
          console.log(challenge);
          return;
        }
        this.errors = result.error;
        this.toastrService.error(this.errors.text ? this.errors.text : 'Ocurrio un error');
      }
    ).add(() => this.cargando = false);
  }
}
