import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: "app-validate-oesvica-token",
  templateUrl: "./validate-oesvica-token.component.html",
  styleUrls: ["./validate-oesvica-token.component.css"],
})
export class ValidateOesvicaTokenComponent implements OnInit {
  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<ValidateOesvicaTokenComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) {}

  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  validate() {
    console.log(this. data)
    if (this.data) {
      this.toastr.success('Verificado!');
    this.dialogRef.close(true);
    }
  }
}
