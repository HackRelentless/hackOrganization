import { Component, OnInit } from '@angular/core';

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
  

  constructor(public accountService: AccountService) {
  }

  ngOnInit() {
    this.isMenuCollapsed = true;
    this.isSidebarToggled = false;
    this.accountService.fetchCurrentUser();
  }

}
