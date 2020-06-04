import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { Hub } from '@aws-amplify/core';
import { Auth } from 'aws-amplify';

import { AccountService } from '../account.service';

@Component({
  selector: 'hack-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit {
  isMenuCollapsed = true;
  isSidebarToggled = false;
  signInTrigger = false;
  

  constructor(public ngZone: NgZone, public cdr: ChangeDetectorRef, public accountService: AccountService) {
    this.accountService.loadUserEvent.subscribe(isLoaded => {
      if(isLoaded) {
        this.signInTrigger = true;
        this.cdr.detectChanges();
      } else {
        this.signInTrigger = false;
        this.cdr.detectChanges();
      }
    });
  }

  ngOnInit() {
    this.isMenuCollapsed = true;
    this.isSidebarToggled = false;

    this.accountService.fetchCurrentUser();

    this.ngZone.run(() => {
      Hub.listen('auth', (authEvent) => {
        switch (authEvent.payload.event) {
          case 'signIn':
            this.accountService.fetchCurrentUser();
            break;

          case 'signOut':
            this.accountService.fetchCurrentUser();
            break;

        }
      });
    });
  }

}
