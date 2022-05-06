import { HttpErrorResponse } from "@angular/common/http";
import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { serviceficha } from "../../services/ficha.service";
import { json } from "d3";

@Component({
  selector: "app-validate-oesvica-token",
  templateUrl: "./validate-oesvica-token.component.html",
  styleUrls: ["./validate-oesvica-token.component.css"],
})
export class ValidateOesvicaTokenComponent implements OnInit {
  info: any = null;
  sendingficha = false;
  sendfichaSucces = false;
  verifyfichaSubmit = false;
 
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private serviceficha: serviceficha,
    public dialogRef: MatDialogRef<ValidateOesvicaTokenComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) {}

  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  private setLocalStorage(fieldName: string, value: any) {
    if (fieldName) localStorage.setItem(fieldName, JSON.stringify(value));
  }
  
  validate(ficha: string) {
    if (ficha) {
      this.serviceficha.ficha(ficha).subscribe((result) =>{
        this.setLocalStorage('id_user', `${result.ap_nombre} ${result.cod_ficha}`);
        this.verifyfichaSubmit = true;
        this.dialogRef.close(true);  
      },
      (error: HttpErrorResponse) => {
        console.error(error.error.error);
        this.toastr.error(
          error.error.error || "Ha ocurrido un error inesperado"
        );
      })
    }
    
  }
  
}
