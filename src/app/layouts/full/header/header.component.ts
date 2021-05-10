import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { SessionService } from 'app/services/session.service';

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: [],
})
export class AppHeaderComponent {
  constructor(private router: Router, private sessionService: SessionService) {}

  logout() {
    this.sessionService.logout();
  }
}
