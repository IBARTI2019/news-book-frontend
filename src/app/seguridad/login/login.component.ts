import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'app/seguridad/servicios/usuario.service';
import { SessionService } from 'app/services/session.service';
import { Router } from '@angular/router';
import { Usuario } from 'app/seguridad/servicios/interface';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { SigninData, VerifyCodeResponse } from 'app/interfaces';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  signinData: SigninData = {
    user: '',
    password: '',
    codigocelular: '',
  };
  sendingCode = false;
  sendCodeSucces = false;
  verifyCodeSubmit = false;
  showVerifyCode = false;
  usuario: Usuario = {};
  errors: any;
  cargando = false;
  hide = false;
  // Equipo= false;
  ipAddress: any;
  pc: any;
  constructor(
    private usuarioService: UsuarioService,
    private http: HttpClient,
    private router: Router,
    private toastrService: ToastrService,
    private sessionService: SessionService,
  ) {
  
    // this.http.get<{ip:string}>('https://jsonip.com').subscribe( data => {
    //   // console.log('th data', data);
    //   this.ipAddress = data  
    // })
  }

  ngOnInit() {
    if (this.sessionService.isLoggedIn) {
      this.router.navigateByUrl('/inicio');
    }
    this.errors = {};
    this.pc= this.ipAddress;
  }

  handleSubmit() {
    if (!this.showVerifyCode) {
      this.sendCode();
    } else {
      this.verifyCode();
    }
  }

  sendCode(): void {
    this.sendingCode = true;
    this.sessionService.sendCode(this.signinData).subscribe(() => {
      this.sendingCode = false;
      this.showVerifyCode = true;
      this.sendCodeSucces = true;
      this.toastrService.success('El codigo ha sido enviado satisfactoriamente.');
    }, (error: HttpErrorResponse) => {
      this.sendingCode = false;
      if (error.error.challenge) {
        const challenge = error.error.challenge[0];
        console.log(challenge);
      }
      this.toastrService.error(error.error.message || 'Ha ocurrido un error inesperado');
    })
  }

  verifyCode(): void {
    this.verifyCodeSubmit = true;
    this.sessionService.verifyCode(this.signinData).subscribe((data: VerifyCodeResponse) => {
      this.verifyCodeSubmit = true;
      console.log(data);
      this.toastrService.success('El codigo ha sido verificado con exito.');
      this.router.navigateByUrl('/inicio');
    }, (error: HttpErrorResponse) => {
      this.verifyCodeSubmit = false;
      console.error(error)
      this.toastrService.error(error.error.message || 'No se pudo verificar el codigo.');
    })
  }

  doLogin(usuario: Usuario) {
    this.cargando = true;
    this.usuarioService.login(usuario).subscribe(
      (response: any) => {
        this.errors = {};
        this.toastrService.info('Info: No ha reportado Cambio de Guardia','Novedades'+ this.pc);
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
