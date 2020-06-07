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
  fetchUserEvent = new EventEmitter();

  constructor() {
    this.fetchCurrentUser();
  }

  fetchCurrentUser(shouldBypass = false) {
      Auth.currentAuthenticatedUser({bypassCache: shouldBypass}).then(user => {
        this.currentUser = user;
        this.loadUserEvent.emit(true);
      }).catch(err => {
        this.currentUser = null;
        this.loadUserEvent.emit(false);
      });
  }


  updateUser(userFormValues): Promise<boolean> {
    return new Promise((resolve, rej) => {
      Auth.updateUserAttributes(this.currentUser, userFormValues).then(res => {
        this.fetchUserEvent.emit();
        resolve(true);
      }).catch(err => {
        resolve(false);
      });
    });
  }

  verifyEmail() {
    return new Promise((res, rej) => {
      // res(false); // for debugging
      Auth.verifyCurrentUserAttribute('email').then((data) => {
        res(true);
      }).catch(err =>{
        res(false);
        });
    });
  }

  verifyEmailWithCode(code) {
    return new Promise((res, rej) => {
      // res(true); // for debugging
      Auth.verifyCurrentUserAttributeSubmit('email', code).then(data => {
        this.fetchUserEvent.emit(true);
        res(true);
      }).catch(err => {
        console.log('err', err)
        res(false);
      });
    });
  }

}
