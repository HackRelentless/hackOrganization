import { Injectable, Output, EventEmitter, NgZone } from '@angular/core';

import { Hub } from '@aws-amplify/core';
import { Auth } from 'aws-amplify';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  currentUser: any;
  isChatEnabled = false;
  loadUserEvent = new EventEmitter();
  fetchUserEvent = new EventEmitter();

  constructor(public ngZone: NgZone, public router: Router) {
    this.fetchCurrentUser();

    this.ngZone.run(() => {
      Hub.listen('auth', (authEvent) => {
        switch (authEvent.payload.event) {
          case 'signIn':
            // console.log('signed in');
            this.fetchCurrentUser();
            this.router.navigate(['/dashboard']);
            break;

          case 'signOut':
            // console.log('signed out');
            this.fetchCurrentUser();
            this.router.navigate(['/login']);
            break;
        }
      });
    });
  }

  fetchCurrentUser(shouldBypass = false) {
      Auth.currentAuthenticatedUser({bypassCache: shouldBypass}).then(user => {
        this.currentUser = user;
        if(this.currentUser.attributes['custom:matrix-auth-json']) {
          this.currentUser.attributes['custom:matrix-auth-json'] = JSON.parse(this.currentUser.attributes['custom:matrix-auth-json']);
        }
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
        // console.log('err', err)
        res(false);
      });
    });
  }

}
