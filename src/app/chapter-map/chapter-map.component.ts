import { Component, AfterViewInit } from '@angular/core';
import { defaults as defaultControls } from 'ol/control';
import { HttpClient } from '@angular/common/http';

import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import {fromLonLat} from 'ol/proj';
import Feature from 'ol/Feature';
import { Circle, Point } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Style, Icon } from 'ol/style';
import { Coordinate } from 'ol/coordinate';

@Component({
  selector: 'hack-chapter-map',
  templateUrl: './chapter-map.component.html',
  styleUrls: ['./chapter-map.component.scss']
})
export class ChapterMapComponent implements AfterViewInit {

  map: Map;
  addressLine = '';

  addMarker = (coord: Coordinate, isLocation: boolean) => {
    const iconFeature =  new Feature({
      geometry: new Point(coord)
    });
    const iconStyle = new Style({
      image: new Icon({
        src: isLocation ? 'assets/position_marker.png' : 'assets/hack_marker.png',
        anchor: [0.5, 1],
        scale: 0.23
      })
    });
    iconFeature.setStyle(iconStyle);
    return iconFeature;
  }

  chapterLocationLayer = new VectorSource();
  positionLayer = new VectorSource();


  constructor(public http: HttpClient) { }

  ngAfterViewInit() {

    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          })
        }),
        new VectorLayer({
          source: this.chapterLocationLayer
        }),
        new VectorLayer({
          source: this.positionLayer
        })
      ],
      view: new View({
        center: fromLonLat([0,0]),
        zoom: 1
      }),
    });

    this.chapterLocationLayer.addFeature(
      this.addMarker(fromLonLat([-75.165222, 39.952583]), false),
    );

  }

  findCoordinates() {
    this.http.get('https://nominatim.openstreetmap.org/search?q=' + this.addressLine + '&format=json').subscribe(res => {
      const lookup = res[0];

      let existingPositions = this.positionLayer.getFeatures();
      for(let i in existingPositions) {
        this.positionLayer.removeFeature(existingPositions[i]);
      }
      this.positionLayer.addFeature(this.addMarker(fromLonLat([lookup.lon, lookup.lat]), true));
      
      this.map.getView().animate({
        center: fromLonLat([lookup.lon, lookup.lat]),
        zoom: 13,
        duration: 1618
      });
    });
  }

}
