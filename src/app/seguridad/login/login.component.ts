import { Component, OnInit } from "@angular/core";
import { SessionService } from "app/services/session.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { HttpErrorResponse } from "@angular/common/http";
import { Book, SigninData, VerifyCodeResponse } from "app/interfaces";
import { API } from "app/utils/api";
import { setLocalStorage } from "app/utils/localStorage";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  signinData: SigninData = {
    code: "",
    user: "",
    password: "",
    security_code: "",
    book: ""
  };
  sendingCode = false;
  sendCodeSucces = false;
  verifyCodeSubmit = false;
  showVerifyCode = false;
  hide = false;
  lerror= "";
  titulog="";
  books: Book[] = [];
  constructor(
    private router: Router,
    private toastrService: ToastrService,
    private sessionService: SessionService
  ) { }

  ngOnInit() {
    if (this.sessionService.isLoggedIn) {
      this.router.navigateByUrl("/new");
    }
  }

  handleSubmit() {
    if (!this.showVerifyCode) {
      this.sendCode();
    } else {
      if (this.books.length > 0 && !this.signinData.book) {
        this.toastrService.error('Debe seleccionar un libro');
        return;
      }
      this.verifyCode();
    }
  }

  sendCode(): void {
    this.sendingCode = true;
    this.sessionService.sendCode(this.signinData).subscribe(
      (data: { locations: Book[] }) => {
        this.books = data.locations;
        this.sendingCode = false;
        this.showVerifyCode = true;
        this.sendCodeSucces = true;
        this.toastrService.success(
          "El codigo ha sido enviado satisfactoriamente."
        );
      },
      (error: HttpErrorResponse) => {
        console.error(error.error.error);
        this.sendingCode = false;
        let posicion =  error.message.indexOf(":");
        let nuevo =posicion + 81;
        let nuevo2= posicion + 82;
        let nuevo3= posicion + 83;
        let numero= error.message[nuevo]+error.message[nuevo2]+error.message[nuevo3];
        switch(numero) { 
          case '400': { 
            this.titulog="Error en Password, en Blanco o no coincide..."; 
             break; 
          } 
          case '404': { 
             this.titulog="Usuario o Password no encontrados..."; 
             break; 
          } 
          default: { 
            this.titulog="Error Inesperado, Servidor Fuera de Servicio..."; 
            break; 
          } 
       } 

        this.lerror=  "Numero:" + error.message[nuevo]+error.message[nuevo2]+error.message[nuevo3] + "    "+ "Titulo: " + this.titulog ;
        
        this.toastrService.error(
           this.lerror        
            ); 
       
      }
    
    );
    
  }

  verifyCode(): void {
    this.verifyCodeSubmit = true;
    this.sessionService.verifyCode(this.signinData).subscribe(
      async (data: VerifyCodeResponse) => {
        setLocalStorage(API.BOOK, this.signinData.book);
        this.verifyCodeSubmit = true;
        this.toastrService.success("El codigo ha sido verificado con exito.");
        //const isSuperUser = await this.sessionService.isSuperUser()
        //if (isSuperUser) {
        this.router.navigateByUrl("/new");
        /*         } else {
                  const isStaff = await this.sessionService.isStaff()
                  this.router.navigateByUrl(isStaff ? "/new/view" : "/new");
                } */
      },
      (error: HttpErrorResponse) => {
        console.error(error.error.error);
        this.verifyCodeSubmit = false;
        this.toastrService.error(
          error.error.error || "No se pudo verificar el codigo."
        );
      }
    );
  }

}
