import { Component, OnInit } from '@angular/core';
import { tileLayer, latLng } from 'leaflet';


@Component({
  selector: 'hack-chapter-map',
  templateUrl: './chapter-map.component.html',
  styleUrls: ['./chapter-map.component.scss']
})
export class ChapterMapComponent implements OnInit {

  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      })
    ],
    zoom: 7,
    center: latLng([ 46.879966, -121.726909 ])
  };

  constructor() { }

  ngOnInit() {
  }

}
