import { Component, Input, OnInit } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { InfoDialogComponent } from "../info-dialog/info-dialog.component";

@Component({
  selector: "app-info-button",
  templateUrl: "./info-button.component.html",
  styleUrls: ["./info-button.component.css"],
})
export class InfoButtonComponent implements OnInit {
  @Input() text: string = "";
  constructor(private toastr: ToastrService, private dialog: MatDialog) {}

  ngOnInit(): void {}

  openDialog(event: MouseEvent): void {
    console.log(event);
    if (!this.text) {
      this.toastr.warning("info-not-found");
      return;
    }
    if (typeof this.text !== "string") {
      this.toastr.error("data-type-is-invalid");
      return;
    }
    const config: MatDialogConfig = {
      position: {
        top: `${event.pageY}px`,
        left: `${event.pageX}px`,
      },
      data: this.text,
      maxWidth: '360px',
      minWidth: '200px',
      minHeight: '100px',
    };
    this.dialog.open(InfoDialogComponent, config);
  }
}
