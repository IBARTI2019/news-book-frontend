import { Component, OnInit } from "@angular/core";
import { SessionService } from "app/services/session.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { HttpErrorResponse } from "@angular/common/http";
import { SigninData, VerifyCodeResponse } from "app/interfaces";
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  signinData: SigninData = {
    user: "",
    password: "",
    codigocelular: "",
  };
  sendingCode = false;
  sendCodeSucces = false;
  verifyCodeSubmit = false;
  showVerifyCode = false;
  hide = false;
  constructor(
    private router: Router,
    private toastrService: ToastrService,
    private sessionService: SessionService
  ) {}

  ngOnInit() {
    if (this.sessionService.isLoggedIn) {
      this.router.navigateByUrl("/new");
    }
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
    this.sessionService.sendCode(this.signinData).subscribe(
      () => {
        this.sendingCode = false;
        this.showVerifyCode = true;
        this.sendCodeSucces = true;
        this.toastrService.success(
          "El codigo ha sido enviado satisfactoriamente."
        );
      },
      (error: HttpErrorResponse) => {
        console.error(error);
        this.sendingCode = false;
        this.toastrService.error(
          error.error.message || "Ha ocurrido un error inesperado"
        );
      }
    );
  }

  verifyCode(): void {
    this.verifyCodeSubmit = true;
    this.sessionService.verifyCode(this.signinData).subscribe(
      (data: VerifyCodeResponse) => {
        this.verifyCodeSubmit = true;
        this.toastrService.success("El codigo ha sido verificado con exito.");
        this.router.navigateByUrl("/new");
      },
      (error: HttpErrorResponse) => {
        console.error(error);
        this.verifyCodeSubmit = false;
        this.toastrService.error(
          error.error.message || "No se pudo verificar el codigo."
        );
      }
    );
  }

}
