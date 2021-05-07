import { Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Event, NavigationEnd, Router } from "@angular/router";
import { TemplateNew, TemplatesNew } from "environments/environment";
import { filter } from "rxjs/operators";
import { ValidateOesvicaTokenComponent } from "../validate-oesvica-token/validate-oesvica-token.component";

@Component({
  selector: "app-new-container",
  templateUrl: "./new-container.component.html",
  styleUrls: ["./new-container.component.css"],
})
export class NewContainerComponent implements OnInit {
  @Input() srcNew = "assets/images/users/1.jpg";
  @Input() description = "No me la pasaste manco";
  @Input() altNew = "ke c llo";
  @Input() template = "";
  @Input() prevUrl = "";
  @Input() allowNavigate = true;

  url = "";

  constructor(private router: Router, private dialog: MatDialog) {}

  ngOnInit(): void {
    const templateNew = TemplatesNew.filter(
      (currentTemplate) => currentTemplate.name === this.template
    );

    if (templateNew.length) {
      this.url = templateNew[0].url
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ValidateOesvicaTokenComponent, {
      width: "400px",
      data: "",
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      console.log("The dialog was closed");
      if (result) this.navigate();
    });
  }

  navigate() {
    if (this.allowNavigate) {
      // console.log(this.link)
      // console.log("Router: ", this.router.routerState.snapshot);
      this.router.navigate([
        this.router.routerState.snapshot.url,
        this.prevUrl,
        this.url,
      ]);
    }
  }
}
