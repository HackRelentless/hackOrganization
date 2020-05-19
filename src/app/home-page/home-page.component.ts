import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit() {
  }

  readMore() {
    this.isReadingManifesto = {
      height: '100%',
      button: 0,
      gradient: 'none'
    };
    setTimeout(() => { 
      this.isReadingManifesto.gradient = 'linear-gradient(white, #3a3a4d)';
    }, 500);
  }

}
