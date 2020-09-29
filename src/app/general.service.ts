import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor(public http: HttpClient) {}

  fetchPublicCalendar() {
    return new Promise((resolve) => {
      let timeMin = moment().startOf('week').subtract(1, 'week').format();
      let timeMax = moment().endOf('week').add(1, 'week').format();
      let publicCalendarURL = `https://clients6.google.com/calendar/v3/calendars/hack@relentlessinnovation.org/events?calendarId=hack@relentlessinnovation.org&singleEvents=true&timeZone=America/New_York&maxAttendees=1&maxResults=250&sanitizeHtml=true&timeMin=${timeMin}&timeMax=${timeMax}&key=AIzaSyBNlYH01_9Hc5S1J9vuFmu2nUqBZJNAXxs`;
      this.http.get(publicCalendarURL, {responseType: 'json'}).subscribe(res => {
        resolve(res);
      }, error => {
        resolve(error);
      }); 
    });
  }
}
