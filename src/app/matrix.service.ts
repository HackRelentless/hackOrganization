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
  client = null;

  constructor(public accountService: AccountService, public http: HttpClient) {
    this.accountService.loadUserEvent.subscribe(isLoaded => {
      // Cognito user is loaded
      if(isLoaded) {
        if(this.accountService.currentUser) {
          console.log('currUser', this.accountService.currentUser);
          // if matrix auth json is added already, loadthem as variables
          if(this.accountService.currentUser.attributes['custom:matrix-auth-json']) {
            this.accessToken = `access_token=${this.accountService.currentUser.attributes['custom:matrix-auth-json']['access_token']}`;
            this.fullMatrixUsername = this.accountService.currentUser.attributes['custom:matrix-auth-json']['user_id'];
            this.matrixUsername = this.fullMatrixUsername.split('@')[1].split(':')[0];
          } else {
            // create a temp matrix username
            let emailname = this.accountService.currentUser.attributes.email.split('@')[0];
            let rand4 = ('0000' + Math.floor(Math.random()*10000).toString().substring(-2)).slice(-4);
            this.matrixUsername = `${emailname}${rand4}`;
          }
          console.log('matrixUsername', this.matrixUsername);

          // matrix chat initialization based on variable
          if(this.accountService.currentUser.attributes['custom:chat-enabled'] && 
            this.accountService.currentUser.attributes['custom:chat-enabled'] === 'true') {
              this.accountService.isChatEnabled = true;
              this.startClient();
          } else {
            this.accountService.isChatEnabled = false;
            this.stopClient();
          }
        }
      } 
    });
  }

  checkUsernameAvailibility(): Promise<boolean> {
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

  registerUser(): Promise<boolean> {
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


  checkDisplayNameMatch(): Promise<boolean> {
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

  setDisplayName(): Promise<boolean> {
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

  // wrapper to create and start the client, post registrations
  startClient() {
    if(!this.client) {
      this.client = sdk.createClient({
        baseUrl: this.baseURL,
        accessToken: this.accountService.currentUser.attributes['custom:matrix-auth-json']['access_token'],
        userId: this.accountService.currentUser.attributes['custom:matrix-auth-json']['user_id']
      });
    } else {
      this.checkUsernameAvailibility().then(isAvailable => {
        let displayNamePromise;
        if(isAvailable) {
          this.registerUser().then(registered => {
            displayNamePromise = this.setDisplayName();
          });
        } else {
          console.log('name already taken');
          displayNamePromise = this.setDisplayName();
        }
        Promise.all([displayNamePromise]).then((matched) => {
          console.log('restarting start client function', matched);
          if(!matched[0]) {
            this.startClient();
          }
        });
      });
    }
    this.client.startClient({initialSyncLimit: 10}).then(started => {
      console.log('started client');
    });
  }

  stopClient() {
    if(!this.client) {
      console.log('client was not found');
      return;
    }
    this.client.stopClient();
  }

  clientStates() {
    this.client.on("sync", (state, prevState, data) => {
      switch (state) {
          case "PREPARED":
            console.log('client is prepared');
          break;
      }
    });
  }


}
