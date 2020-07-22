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

  constructor(public accountService: AccountService, public http: HttpClient) {
    this.accountService.loadUserEvent.subscribe(isLoaded => {
      if(isLoaded) {
        if(this.accountService.currentUser) {
          console.log('currUser', this.accountService.currentUser);
          if(this.accountService.currentUser.attributes['custom:matrix-username']) {
            this.matrixUsername = this.accountService.currentUser.attributes['custom:matrix-username'];
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
//88959dec-3d02-4947-87e2-d42dd3c67e9f

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




}
