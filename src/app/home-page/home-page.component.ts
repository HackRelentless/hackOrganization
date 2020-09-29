import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { GeneralService } from '../general.service';

import * as moment from 'moment';

@Component({
  selector: 'hack-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  calendarItems = [];

  constructor(public accountService: AccountService, public generalService: GeneralService) { }

  ngOnInit() {
    this.getCalendarData();
  }

  getCalendarData() {
    this.generalService.fetchPublicCalendar().then(data => {
      this.calendarItems = data['items'].sort((a, b) => {
        return <any>new Date(a.start.dateTime) - <any>new Date(b.start.dateTime)
      });
    });
  }

}
