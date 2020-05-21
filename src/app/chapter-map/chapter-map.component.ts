import { Component, AfterViewInit } from '@angular/core';
import { defaults as defaultControls } from 'ol/control';
import { HttpClient } from '@angular/common/http';

import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import {fromLonLat} from 'ol/proj';
import ZoomToExtent from 'ol/control/ZoomToExtent';


@Component({
  selector: 'hack-chapter-map',
  templateUrl: './chapter-map.component.html',
  styleUrls: ['./chapter-map.component.scss']
})
export class ChapterMapComponent implements AfterViewInit {

  map: Map;
  searchURL = 'https://www.openstreetmap.org/search?query=';
  addressLine = '';

  constructor(public http: HttpClient) { }

  ngAfterViewInit() {
    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          })
        })
      ],
      view: new View({
        center: fromLonLat([-75.165222, 39.952583]),
        zoom: 15
      }),
      // controls: defaultControls().extend([
      //   new ZoomToExtent({
      //     extent: [
      //       813079.7791264898, 5929220.284081122,
      //       848966.9639063801, 5936863.986909639
      //     ]
      //   })
      // ])
    });
  }

  findCoordinates() {
    this.http.get(this.searchURL + this.addressLine, { observe: 'response', responseType: 'blob' }).subscribe(res => {
      console.log(res);
    });
  }

}
