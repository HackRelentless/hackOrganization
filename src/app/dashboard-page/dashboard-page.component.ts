import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { Hub } from '@aws-amplify/core';
import { Auth } from 'aws-amplify';

@Component({
  selector: 'hack-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit {
  isMenuCollapsed = true;
  isSidebarToggled = false;
  signInTrigger = false;
  currentUser: any;

  constructor(public ngZone: NgZone, public cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.isMenuCollapsed = true;
    this.isSidebarToggled = false;

    try {
      Auth.currentAuthenticatedUser().then(user => {
        this.currentUser = user;
        this.cdr.detectChanges();
      });
    } catch (err) {
      this.currentUser = null;
    }

    this.ngZone.run(() => {
      Hub.listen('auth', (authEvent) => {
        switch (authEvent.payload.event) {

          case 'signIn':
            this.signInTrigger = true;
            Auth.currentAuthenticatedUser().then(user => {
              this.currentUser = user;
              this.cdr.detectChanges();
            });
            break;

          case 'signOut':
            this.signInTrigger = false;
            this.currentUser = null;
            this.cdr.detectChanges();
            break;

        }
      });
    });
  }

}
