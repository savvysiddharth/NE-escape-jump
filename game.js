const BAR_STOPS_AT = 50; //pixel from bottom
const MAX_BARS = 10; //total bars per level

class BarGroup {
  constructor(y) {
    this.height = 30;
    this.y = y; //y is starting position

    this.speedY = 1;
    // this.counted = false; //counted for score.

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

let max_score = -1; //current highest score, helps to find next bar
let gameOver = false;
let gameLevel = 0;

function draw() {
  frameRate(60);
  background(150);

  for(bar of barGroups) {
    bar.move();
  }

  for(k in balls) {

    let thisBallDied = false;

    for(j in barGroups) {
      const bar = barGroups[j];

      if(collision = balls[k].collisionCheckv3(bar)) {
        if(collision < 3) { // (top surface)
          if(!balls[k].barstatus[j]) {
            balls[k].score++;
            console.log('ball',k,'score',balls[k].score);
            balls[k].barstatus[j] = true;
          }
          balls[k].speedY = bar.speedY;
        } else if(collision > 3) { // (bottom surface) , collision with bottom surface of any bar results same
          balls[k].speedY = 3; //thrust down
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
      // console.log('ball',k,'died');
      balls.splice(k,1);
    }

  }

  for(ball of balls) {
    ball.draw();
  }

  for(bar of barGroups) {
    bar.draw();
  }

  // for(bar of barGroups) {
  //   if(collision = ball.collisionCheckv3(bar)) {
  //     if(collision < 3) { // (top surface)
  //       if(!bar.counted) {
  //         score++;
  //         bar.counted = true;
  //         console.log('score:',score);
  //         if(score%MAX_BARS == 0) {
  //           gameLevel++;
  //           console.log("level:",gameLevel);
  //           for(let i = 1; i<=MAX_BARS ; i++) {
  //             barGroups[i] = new BarGroup(-(i-1)*300);
  //           }
  //         }
  //       }
  //       ball.speedY = bar.speedY;
  //     } else if(collision > 3) { // (bottom surface)
  //       ball.speedY = 3; //thrust down
  //     }
  //   }
  // }

  // if(ball.y >= world.height) {
  //   gameOver = true;
  // }

  // if(score >= 0 && score < MAX_BARS*(gameLevel + 1)) {
  //   const d2 = world.height - BAR_STOPS_AT - 30;
  //   const d1 = barGroups[(score + 1) - (gameLevel*10)].y + barGroups[(score + 1) - (gameLevel*10)].height;
  //   if( d2 - d1 <= ball.diameter && true) { //one more condition for ball pos on gameover yet to be added
  //     gameOver = true;
  //   }
  // }

  // if(gameOver) {
  //   console.log('game over');
  //   setup();
  //   score = -1;
  //   gameOver = false;
  //   gameLevel = -1;

  //   return;
  // }

}

function keyPressed() {
  if(keyCode == 38 ) {
    for(bar of barGroups) {
      if(balls[0].collisionCheckv3(bar) < 3) {
        balls[0].jump();
        return false;
      }
    }
  }

  if(keyCode == 39) //right
    ball.moveRight();

  if(keyCode == 37) //left
    ball.moveLeft();
}