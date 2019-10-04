const BAR_STOPS_AT = 50; //pixel from bottom
const MAX_BARS = 5; //maximum bars in memory at a time
const BAR_GAP = 300; //gaps between consecutive bar

class BarGroup {
  constructor(y) {
    this.height = 30;
    this.y = y; //y is starting position

    this.speedY = 1;

    this.speedXr = random(2,7);
    this.speedXl = random(2,7);
    this.stopped = false;

    this.left = {
      x : 0,
      width : 0,
      speed : this.speedXl
    };

    this.right = {
      x : world.width,
      width : world.width,
      speed : this.speedXr
    };
  }

  draw() {
    const {y, height} = this;
    let rx = this.right.x;
    let rwidth = this.right.width;
    let lx = this.left.x;
    let lwidth = this.left.width;
    fill(0);
    rect(rx, y, rwidth, height);
    rect(lx, y, lwidth, height);
  }

  move() {
    const {y, speedY, height} = this;

    this.y += speedY;

    this.left.width += this.left.speed;
    this.right.x -= this.right.speed;

    let gap = this.right.x - this.left.width;

    if(gap <= 0) {
      this.left.speed = 0;
      this.right.speed = 0;
    }

    if(y > world.height - height - BAR_STOPS_AT) {
      this.speedY = 0;
      if(!this.stopped) {
        this.stopped = true;
      }
    }

    if (y <= 300) {
      this.right.speed=0;
      this.left.speed=0;
    } else if(gap >= 0) {
      this.right.speed=this.speedXr;
      this.left.speed=this.speedXl;
    }
  }
}