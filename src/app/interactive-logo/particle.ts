export class Particle {

  private x: number;
  private y: number;
  private dest: {x: number, y: number};
  private r: number;
  private vx: number;
  private vy: number;
  private accX: number;
  private accY: number;
  private friction: number;
  private colors = ['#00688B', '#236B8E', '#3299CC', '#4F94CD', '#50A6C2'];
  private color: string;

  constructor(x: number, y: number, ww: number, wh: number, definedX = null, definedY = null) {
    if (definedX && definedY) {
      this.x = definedX;
      this.y = definedY;
    } else {
      this.x = Math.random() * ww;
      this.y = Math.random() * wh;
    }
    this.dest = {x, y};
    this.r = Math.random() * ((ww + wh) / 1200) + 1;
    this.vx = (Math.random() - 0.5);
    this.vy = (Math.random() - 0.5);
    this.accX = 0;
    this.accY = 0;
    this.friction = Math.random() * 0.05 + 0.61;

    this.color = this.colors[Math.floor(Math.random() * 6)];
  }

  public render(ctx: CanvasRenderingContext2D, mouse: { x: number, y: number }, radius: number) {
    this.accX = (this.dest.x - this.x) / 61;
    this.accY = (this.dest.y - this.y) / 61;
    this.vx += this.accX;
    this.vy += this.accY;
    this.vx *= this.friction;
    this.vy *= this.friction;

    this.x += this.vx;
    this.y += this.vy;

    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, Math.PI * 2, Math.PI, false);
    ctx.fill();
    const a = this.x - mouse.x;
    const b = this.y - mouse.y;

    const distance = Math.sqrt(a * a + b * b);
    if (distance < (radius * 70)) {
      this.accX = (this.x - mouse.x) / 2;
      this.accY = (this.y - mouse.y) / 2;
      this.vx += this.accX;
      this.vy += this.accY;
    }
  }
}
