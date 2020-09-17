import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
declare var particlesJS: any;

@Component({
  selector: 'hack-document-page',
  templateUrl: './document-page.component.html',
  styleUrls: ['./document-page.component.scss']
})
export class DocumentPageComponent implements OnInit {

  documentPage = '';
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    particlesJS.load('particles-js', './assets/particles.json', null);
    this.route.queryParams.subscribe(param => {
      this.documentPage = param.type;
    });
  }

}
