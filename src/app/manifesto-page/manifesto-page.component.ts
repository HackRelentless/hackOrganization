import { Component, OnInit } from '@angular/core';
declare var particlesJS: any;

@Component({
  selector: 'hack-manifesto-page',
  templateUrl: './manifesto-page.component.html',
  styleUrls: ['./manifesto-page.component.scss']
})
export class ManifestoPageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    particlesJS.load('particles-js', './assets/particles.json', null);
    
  }

}
