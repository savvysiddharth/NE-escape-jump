const BAR_STOPS_AT = 50; //pixel from bottom
const MAX_BARS = 5; //maximum bars in memory at a time
const BAR_GAP = 300; //gaps between consecutive bar

class BarGroup {
  constructor(y) {
    this.height = 30;
    this.y = y; //y is starting position

    this.speedY = 1;
    // this.counted = false; //counted for score.

    this.speedXr = random(1,6);
    this.speedXl = random(1,6);
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

let ball;

let barGroups = []; //bar groups

let balls = [];

const TOTAL_BALL_POPULATION = 40;

function setup() {
  noStroke();
  createCanvas(world.width,world.height);

  barGroups[0] = new BarGroup(world.height-100);
  barGroups[0].left.width = world.width;
  for(let i = 1; i<=MAX_BARS ; i++) {
    barGroups[i] = new BarGroup(-i*300);
  }

  for(let i=0 ; i<TOTAL_BALL_POPULATION ; i++) {
    balls.push(new Ball());
  }

  for(ball of balls) {
    ball.x = random(10,width-10);
    for(k in barGroups) {
      ball.barstatus[k] = false;
    }
  }
}

let gameOver = false;
let gameLevel = 0;

function draw() {
  frameRate(60);
  background(150);

  for(j in barGroups) {
    if(barGroups[j] != null) {
      const bar = barGroups[j];
      if(j != 0 && bar.stopped) {
        barGroups[j] = null;
        barGroups.push(new BarGroup(barGroups[barGroups.length - 1].y - BAR_GAP));
      } else {
        bar.move();
      }
    }

  }

  for(k in balls) {

    let thisBallDied = false;

    for(j in barGroups) {
      if(barGroups[j] != null) {
        const bar = barGroups[j];
        if(collision = balls[k].collisionCheckv3(bar)) {
          if(collision < 3) { // (top surface)
            if(j > balls[k].barstatus) {
              balls[k].score++;
              balls[k].barstatus = j;
            }
            balls[k].speedY = bar.speedY;
          } else if(collision > 3) { // (bottom surface) , collision with bottom surface of any bar results same
            balls[k].speedY = 3; //thrust down
          }
        }
      }
    }

    balls[k].nextbar = balls[k].score+1;

    balls[k].useBrain(barGroups);

    balls[k].worldEffect(); //applies effect of gravity and speed to the motion

    if (balls[k].y >= world.height) { //if ball drops below the view
      thisBallDied = true;
    }

    //BALL DIES WHEN IT'S SQUEEZED
    if(balls[k].score >= 0) {
      const d2 = world.height - BAR_STOPS_AT - 30; //dist from originTop to top surface of bottom bar
      const d1 = barGroups[balls[k].nextbar].y + barGroups[balls[k].nextbar].height; //dist from originTop to bottom surface of next bar
      if( d2 - d1 <= balls[k].diameter && balls[k].y > (d2 - balls[k].diameter)) {
        thisBallDied = true;
        balls[k].nextbar++;
      }
    }

    if(thisBallDied) {
      balls.splice(k,1);
    }

  }

  for(ball of balls) {
    ball.draw();
  }

  for(bar of barGroups) {
    if(bar != null) {
      bar.draw();
    }
  }
}

function keyPressed() {
  if(keyCode == 38 ) {
    for(bar of barGroups) {
      if(bar != null) {
        if(balls[0].collisionCheckv3(bar) < 3) {
          balls[0].jump();
          return false;
        }
      }
    }
  }

  if(keyCode == 39) //right
    ball.moveRight();

  if(keyCode == 37) //left
    ball.moveLeft();
}