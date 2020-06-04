import { Injectable, Output, EventEmitter } from '@angular/core';

import { Hub } from '@aws-amplify/core';
import { Auth } from 'aws-amplify';
import { resolve } from 'url';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  currentUser: any;
  loadUserEvent = new EventEmitter();

  constructor() {
    console.log('account service on');
    this.fetchCurrentUser();
  }

  fetchCurrentUser() {
      Auth.currentAuthenticatedUser().then(user => {
        console.log(user);
        this.currentUser = user;
        this.loadUserEvent.emit(true);
      }).catch(err => {
        console.log(err);
        this.currentUser = null;
        this.loadUserEvent.emit(false);
      });
  }


  updateUser(userFormValues): Promise<boolean> {
    return new Promise((resolve, rej) => {
      console.log('currentUse', this.currentUser);
      console.log('vals', userFormValues);
      Auth.updateUserAttributes(this.currentUser, userFormValues).then(res => {
        resolve(true);
      }).catch(err => {
        console.log('err', err);
        resolve(false);
      });
    });
  }

}
