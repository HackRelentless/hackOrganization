import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';

@Component({
  selector: 'hack-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  isReadingManifesto = {
    height: '25rem',
    button: 1,
    gradient: 'none'
  };

  constructor(public accountService: AccountService) { }

  ngOnInit() {
  }

}
