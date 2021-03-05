import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'app/seguridad/servicios/usuario.service'
import { Router } from '@angular/router';
import { Usuario } from 'app/seguridad/servicios/interface';
import { from } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import getMAC, { isMAC } from 'getmac';
import {HttpClient} from '@angular/common/http';
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
  Equipo= false;
  ipAddress:any;
  pc:any;
  constructor(
    private usuarioService: UsuarioService,
    private http: HttpClient,
    private router: Router,
    private toastrService: ToastrService
  ) {
  
  this.http.get<{ip:string}>('https://jsonip.com')
    .subscribe( data => {
      console.log('th data', data);
      this.ipAddress = data
       
    })
  }

  ngOnInit() {
        if (this.usuarioService.isLoggedIn) {
          this.router.navigateByUrl('seguridad/login');
        } 
    this.errors = {};
    this.pc= this.ipAddress;
    
  }

  
  
  doLogin(usuario: Usuario) {
    this.cargando = true;
    this.usuarioService.login(usuario).subscribe(
      (response: any) => {
        this.errors = {};
         this.toastrService.info('Info:No ha reportado Cambio de Guardia','Novedades'+ this.pc);
         this.router.navigateByUrl('/inicio');
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
