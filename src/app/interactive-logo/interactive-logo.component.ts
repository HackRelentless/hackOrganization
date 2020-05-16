import { Component, OnInit, ElementRef, ViewChild, NgZone } from '@angular/core';
import { Particle } from './particle';

@Component({
  selector: 'hack-interactive-logo',
  templateUrl: './interactive-logo.component.html',
  styleUrls: ['./interactive-logo.component.scss']
})
export class InteractiveLogoComponent implements OnInit {
  @ViewChild('scene') canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('hacklogo') sourceImg: ElementRef<HTMLImageElement>;
  ctx: CanvasRenderingContext2D;
  particles: Array<Particle>;
  amount = 0;
  mouse = { x: 0, y: 0 };
  radius = 1;
  ww: number;
  wh: number;
  pww: number;
  pwh: number;

  constructor(public ngZone: NgZone) { }

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      this.sourceImg.nativeElement.onload = () => {
        this.ctx = this.canvas.nativeElement.getContext('2d');
        this.ww = this.canvas.nativeElement.width = window.innerWidth;
        this.wh = this.canvas.nativeElement.height = window.innerHeight;
        this.pww = this.canvas.nativeElement.width = window.innerWidth;
        this.pwh = this.canvas.nativeElement.height = window.innerHeight;
        this.initScene();
      };
    });
  }

  resizeScene(e) {
    this.ngZone.runOutsideAngular(() => {
      this.ww = window.innerWidth;
      this.wh = window.innerHeight;
      this.canvas.nativeElement.width = this.ww;
      this.canvas.nativeElement.height = this.wh;
      if (Math.abs(this.ww - this.pww) > 100 || Math.abs(this.wh - this.pwh) > 100) {
        this.initScene();
      }
    });
  }

  render() {
    this.ngZone.runOutsideAngular(() => {
      this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
      for (let i = 0; i < this.amount; i++) {
        this.particles[i].render(this.ctx, this.mouse, this.radius);
      }
      requestAnimationFrame(() => {
        this.render();
      });
    });
  }

  onMouseMove(e) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
  }

  onTouchMove(e) {
    if (e.touches.length > 0 ) {
      this.mouse.x = e.touches[0].clientX;
      this.mouse.y = e.touches[0].clientY;
      console.log(e.touches[0]);
    }
  }

  onTouchEnd(e) {
    this.mouse.x = -9999;
    this.mouse.y = -9999;
  }

  calculateWorkableArea() {
    // this.ngZone.runOutsideAngular(() => {
      this.ww = window.innerWidth;
      this.wh = window.innerHeight;
      this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
      let iw = this.sourceImg.nativeElement.width;
      let ih = this.sourceImg.nativeElement.height;
      let dx = (this.ww / 2) - (iw / 2);
      let dy = (this.wh / 2) - (ih / 2);

      if (dx > this.ww / 4) {
        const diffX = dx - (this.ww / 4);
        iw = (iw + (diffX) / 2);
      }
      if (dy > this.wh / 4) {
        const diffY = dy - (this.wh / 4);
        ih = ih + diffY;
      }

      dx = (this.ww / 2) - (iw / 2);
      dy = (this.wh / 2) - (ih / 2);

      this.ctx.drawImage(this.sourceImg.nativeElement, dx, dy, iw, ih);

      const data = this.ctx.getImageData(0, 0, this.ww, this.wh).data;
      this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
      this.ctx.globalCompositeOperation = 'screen';
      return data;
    // });
  }

  initScene() {
    this.ngZone.runOutsideAngular(() => {
      const data = this.calculateWorkableArea();
      this.particles = [];
      for (let i = 0; i < this.ww; i++) {
        for (let j = 0; j < this.wh; j++) {
          if (j % 5 === 0) {
            if (data[((i + j * this.ww) * 4) + 3] > 150) {
              const newParticle = new Particle(i, j, this.ww, this.wh);
              this.particles.push(newParticle);
            }
          }
        }
      }
      this.amount = this.particles.length;
      this.pww = this.ww;
      this.pwh = this.wh;
      requestAnimationFrame(() => {
        this.render();
      });
    });
  }
}
