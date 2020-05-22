import { Component, AfterViewInit } from '@angular/core';
import { defaults as defaultControls } from 'ol/control';
import { HttpClient } from '@angular/common/http';

import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import {fromLonLat} from 'ol/proj';
import Vector from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Style from 'ol/style/Style';
import { Icon } from 'ol/style';
@Component({
  selector: 'hack-chapter-map',
  templateUrl: './chapter-map.component.html',
  styleUrls: ['./chapter-map.component.scss']
})
export class ChapterMapComponent implements AfterViewInit {

  map: Map;
  addressLine = '';

  testFeature;
  hackIcon;

  constructor(public http: HttpClient) { }

  ngAfterViewInit() {

    // this.testFeature = new Feature({
    //   geometry: new Point([-75.165222, 39.952583]),
    //   name: 'Philly Chapter',
    // });

    // this.hackIcon = new Style({
    //   image: new Icon({
    //     anchor: [0.5, 46],
    //     src: '../../assets/hack_transparent_logo.png'
    //   })
    // });

    // this.testFeature.setStyle(this.hackIcon);


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
    });

    // let source = new Vector({});

  }

  findCoordinates() {
    this.http.get('https://nominatim.openstreetmap.org/search?q=' + this.addressLine + '&format=json').subscribe(res => {
      const lookup = res[0];
      this.map.getView().setCenter(fromLonLat([lookup.lon, lookup.lat]));
    });
  }

}
