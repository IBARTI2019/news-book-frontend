import { Component, Input, OnInit } from "@angular/core";
import { Router } from '@angular/router';

@Component({
  selector: "app-new-container",
  templateUrl: "./new-container.component.html",
  styleUrls: ["./new-container.component.css"],
})
export class NewContainerComponent implements OnInit {
  @Input() src = "assets/images/users/1.jpg";
  @Input() description = "No me la pasaste manco";
  @Input() alt = "ke c llo";
  @Input() link = "";

  constructor(
    private router: Router,
  ) {}

  ngOnInit(): void {}

  navigate() {
    this.router.navigateByUrl(this.link)
  }
}
