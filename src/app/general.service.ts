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
      let timeMin = moment().startOf('week').subtract(1, 'day').format();
      let timeMax = moment().endOf('week').add(1, 'week').format();
      let publicCalendarURL = `https://clients6.google.com/calendar/v3/calendars/hack@relentlessinnovation.org/events?calendarId=hack%40relentlessinnovation.org&singleEvents=true&timeZone=America%2FNew_York&maxAttendees=1&maxResults=250&sanitizeHtml=true&timeMin=${timeMin}&timeMax=${timeMax}&key=AIzaSyBNlYH01_9Hc5S1J9vuFmu2nUqBZJNAXxs`;
      this.http.get(publicCalendarURL, {responseType: 'json'}).subscribe(res => {
        res['items'] = res['items'].sort((a, b) => {
          return <any>new Date(a.start.dateTime) - <any>new Date(b.start.dateTime)
        });
        let currentDate = moment();
        let nextSelected = {
          diff: null,
          bool: false
        }
        for(var i = 0; i < res['items'].length; i += 1) {
          let start = moment(res['items'][i]['start']['dateTime']);
          let diff = start.diff(currentDate, 'days');

          if(diff >= 0 && !nextSelected.bool) {
            res['items'][i]['upNext'] = true;
            nextSelected.bool = true;
            nextSelected.diff = diff;
          } else {
            res['items'][i]['upNext'] = (diff == nextSelected.diff) ? true : false;
          }
        }

        resolve(res);
      }, error => {
        resolve(error);
      }); 
    });
  }
}
