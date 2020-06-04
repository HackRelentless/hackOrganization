import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'hack-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss']
})
export class AccountSettingsComponent implements OnInit {

  profileForm: FormGroup;
  isSuccessAlert = false;
  isVerificationState = false;
  verificationCode = '';
  verificationModal: NgbModalRef;
  successText = '';

  constructor(public accountService: AccountService, private fb: FormBuilder, public modalService: NgbModal) {
    this.profileForm = this.fb.group({
      preferred_username: [''],
      email: [''],
      phone_number: [''],
      given_name: [''],
      family_name: [''],
      'custom:bio': [''],
      address: [{
        formatted: '',
        street_address: '',
        locality: '',
        region: '',
        postal_code: '',
        country: ''
      }],
      birthdate: [''],
      gender: [''],
      picture: [''],
    });

    this.accountService.loadUserEvent.subscribe(isLoaded => {
      if(isLoaded) {
        this.loadUserSettings();
      } 
    });

    this.accountService.fetchUserEvent.subscribe((shouldBypassCache) => {
      if(shouldBypassCache) {
        this.accountService.fetchCurrentUser('bypass');
      }
      this.accountService.fetchCurrentUser();
    });
  }

  ngOnInit() { }

  loadUserSettings() {
    if (this.accountService.currentUser) {
      this.profileForm.patchValue({
        preferred_username: this.accountService.currentUser.attributes.preferred_username,
        email: this.accountService.currentUser.attributes.email,
        phone_number: this.accountService.currentUser.attributes.phone_number,
        given_name: this.accountService.currentUser.attributes.given_name,
        family_name: this.accountService.currentUser.attributes.family_name,
        'custom:bio': this.accountService.currentUser.attributes['custom:bio'],
        address: this.accountService.currentUser.attributes.address,
        birthdate: this.accountService.currentUser.attributes.birthdate,
        gender: this.accountService.currentUser.attributes.gender,
        picture: this.accountService.currentUser.attributes.picture,
      });
    }
  }

  displaySuccess(message, isSuccess=true) {
    this.successText = message;
      this.isSuccessAlert = isSuccess;
      setTimeout(() => {
        this.isSuccessAlert = false;
      }, 5000);
  }

  updateUserSettings() {
    let profileValues = this.profileForm.value;
    for (let i in profileValues) {
      profileValues[i] = (profileValues[i] === undefined) ? '' : profileValues[i];
    }
    this.accountService.updateUser(profileValues).then(isSuccess => {
      this.displaySuccess('Changes Saved Successfully', isSuccess);
    });
  }

  sendEmailVerification(verifycode) {
    this.isVerificationState = true;
    this.accountService.verifyEmail().then(isSent => {
      if(isSent) {
        // make modal for confirmation
        this.verificationModal = this.modalService.open(verifycode, {centered: true});
        this.verificationModal.result.then(closed => {
          console.log('closed', closed);
          this.isVerificationState = false;
        }, dismissed => {
          console.log('dismissed', dismissed);
          this.isVerificationState = false;
        });
      }
    })
  }

  confirmCode() {
    this.accountService.verifyEmailWithCode(this.verificationCode).then(isVerified => {
      this.displaySuccess('Email Verified');
      this.verificationCode = '';
    }).finally(() => {
      this.isVerificationState = false;
      this.verificationModal.dismiss();
    });
  }

}
