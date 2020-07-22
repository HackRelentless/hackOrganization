import { AccountService } from './account.service'

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import * as sdk from "matrix-js-sdk";

@Injectable({
  providedIn: 'root'
})
export class MatrixService {

  baseURL = 'https://matrix.relentlessinnovation.org';
  matrixUsername = ''
  fullMatrixUsername = ''
  accessToken = ''

  constructor(public accountService: AccountService, public http: HttpClient) {
    this.accountService.loadUserEvent.subscribe(isLoaded => {
      if(isLoaded) {
        if(this.accountService.currentUser) {
          console.log('currUser', this.accountService.currentUser);
          if(this.accountService.currentUser.attributes['custom:matrix-auth-json']) {
            this.accessToken = `access_token=${this.accountService.currentUser.attributes['custom:matrix-auth-json']['access_token']}`;
            this.fullMatrixUsername = this.accountService.currentUser.attributes['custom:matrix-auth-json']['user_id'];
            this.matrixUsername = this.fullMatrixUsername.split('@')[1].split(':')[0];
          } else {
            let emailname = this.accountService.currentUser.attributes.email.split('@')[0];
            let rand4 = ('0000' + Math.floor(Math.random()*10000).toString().substring(-2)).slice(-4);
            this.matrixUsername = `${emailname}${rand4}`;
          }
          console.log('matrixUsername', this.matrixUsername);
        }
      } 
    });
  }

  checkUsernameAvailibility() {
    return new Promise((resolve) => {
      this.http.get(`${this.baseURL}/_matrix/client/r0/register/available`, {
        params: new HttpParams().set('username', this.matrixUsername)
      }).subscribe(res => {
        resolve(true);
      }, error => {
        resolve(false);
      });
    });
  }

  registerUser() {
    return new Promise((resolve, reject) => {
      this.http.post(`${this.baseURL}/_matrix/client/r0/register`, {
        username: this.matrixUsername,
        password: this.accountService.currentUser['username'],
        auth: {
          type: 'm.login.dummy'
        }
      }).subscribe(res => {
        // update Cognito user
        this.accountService.updateUser({
          'custom:matrix-auth-json': JSON.stringify(res)
        }).then(added => {
          console.log('added', added);
          resolve(res);
        });
      }, error => {
        reject(error);
      });
    });
  }


  checkDisplayNameMatch() {
    return new Promise((resolve) => {
      this.http.get(`${this.baseURL}/_matrix/client/r0/profile/${this.fullMatrixUsername}/displayname`).subscribe(matrixAlias => {
        if(matrixAlias['displayname'] == this.accountService.currentUser.attributes.preferred_username) {
          console.log('display name already matching');
          resolve(true);
        } else {
          resolve(false);
        }
      }, error => {
        console.log('no display name for this user');
        resolve(false);
      });
    });
  }

  setDisplayName() {
    return new Promise((resolve, reject) => {
      this.checkDisplayNameMatch().then(isMatching => {
        if(!isMatching){
          this.http.put(`${this.baseURL}/_matrix/client/r0/profile/${this.fullMatrixUsername}/displayname?${this.accessToken}`,
            {
              displayname: this.accountService.currentUser.attributes.preferred_username
            }).subscribe(res => {
              resolve(true);
            }, error => {
              reject(error);
            });
          } else {
            resolve(true);
          }
      })
    });
  }




}
