import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Event, NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs/operators";

@Component({
  selector: "app-new-container",
  templateUrl: "./new-container.component.html",
  styleUrls: ["./new-container.component.css"],
})
export class NewContainerComponent implements OnInit {
  @Input() srcNew = "assets/images/users/1.jpg";
  @Input() description = "No me la pasaste manco";
  @Input() altNew = "ke c llo";
  @Input() link = "";
  @Input() allowNavigate = true;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {}

  navigate() {
    if (this.allowNavigate) {
      console.log(this.link)
      console.log("Router: ", this.router.routerState.snapshot);
    this.router.navigate([this.router.routerState.snapshot.url, ...this.link.split('/')]);
    }
  }
}
