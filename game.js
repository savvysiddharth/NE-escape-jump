const BAR_STOPS_AT = 50; //pixel from bottom
const MAX_BARS = 10; //total bars per level

class BarGroup {
  constructor(y) {
    this.height = 30;
    this.y = y; //y is starting position

    this.speedY = 1;
    this.counted = false; //counted for score.

    this.speedXr = random(1,6);
    this.speedXl = random(1,6);

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

let rect1;

let barGroups = []; //bar groups

let balls = [];

function setup() {
  noStroke();
  createCanvas(world.width,world.height);

  ball = new Ball();

  ball.x = width/2;

  // balls.push(new Ball());

  // for(ball of balls) {
  //   ball.x = random(20,width-20);
  // }

  barGroups[0] = new BarGroup(world.height-100);
  barGroups[0].left.width = world.width;
  for(let i = 1; i<=MAX_BARS ; i++) {
    barGroups[i] = new BarGroup(-i*300);
  }
}

let score = -1;
let gameOver = false;
let gameLevel = -1;

function draw() {
  frameRate(60);
  background(150);

  ball.useBrain(barGroups[(score + 1) - (gameLevel*10)], barGroups);

  // for(ball of balls) {

  // }

  ball.draw();
  ball.worldEffect();
  for(bar of barGroups) {
    bar.draw()
    bar.move();
    if(collision = ball.collisionCheckv3(bar)) {
      if(collision < 3) { // (top surface)
        if(!bar.counted) {
          score++;
          bar.counted = true;
          console.log('score:',score);
          if(score%MAX_BARS == 0) {
            gameLevel++;
            console.log("level:",gameLevel);
            for(let i = 1; i<=MAX_BARS ; i++) {
              barGroups[i] = new BarGroup(-(i-1)*300);
            }
          }
        }
        ball.speedY = bar.speedY;
      } else if(collision > 3) { // (bottom surface)
        ball.speedY = 3; //thrust down
      }
    }
  }

  if(ball.y >= world.height) {
    gameOver = true;
  }

  if(score >= 0 && score < MAX_BARS*(gameLevel + 1)) {
    const d2 = world.height - BAR_STOPS_AT - 30;
    const d1 = barGroups[(score + 1) - (gameLevel*10)].y + barGroups[(score + 1) - (gameLevel*10)].height;
    if( d2 - d1 <= ball.diameter && true) { //one more condition for ball pos on gameover yet to be added
      gameOver = true;
    }
  }

  //WARNING!!!!!!!!!!!!!!!!!!!!!!!!!111
  //DO NOT SAVE.....NOT COMPLETED YET
  //


  if(gameOver) {
    console.log('game over');
    setup();
    score = -1;
    gameOver = false;
    gameLevel = -1;

    return;
  }

}

function keyPressed() {
  if(keyCode == 38 ) {
    for(bar of barGroups) {
      if(ball.collisionCheckv3(bar) < 3) {
        ball.jump();
        return false;
      }
    }
  }

  if(keyCode == 39) //right
    ball.moveRight();

  if(keyCode == 37) //left
    ball.moveLeft();
}

function mousePressed() {
  let b = barGroups[0];
  if(ball.collisionCheckv2(b)) {
    ball.jump();
  }
  return false;
}

// function touchStarted() {
//   ball.jump();
//   return false;
// }