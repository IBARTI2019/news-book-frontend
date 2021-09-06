import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { SessionService } from 'app/services/session.service';
import { User } from 'app/interfaces';
import { USER } from 'app/constants';
import { BehaviorSubject } from 'rxjs';
import { UserService } from 'app/services/user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: []
})
export class AppSidebarComponent implements OnInit, OnDestroy {
  user: User = {
    name: "",
    last_name: "",
    email: "",
  };
  superUser = false;
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private sessionService: SessionService,
    private userService: UserService,
  ) {
    this.userService.user$.subscribe((user) => {
      console.log('Behavior Subject: ', user)
    })
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  async ngOnInit() {
    this.superUser = await this.sessionService.isSuperUser()
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  logout() {
    this.sessionService.logout();
  }
}
