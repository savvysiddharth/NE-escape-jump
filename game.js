let barGroups = []; //bar groups

let balls = []; //all balls alive

const TOTAL_BALL_POPULATION = 20;

let ANIMATION_SPEED = 1;

class StatusBoard {

  constructor() {
    this.best = 0; //AlltimeBest
    this.gen = 0;
    this.curr = 0; //currentBest
  }

  updateBest(score) {
    this.best = score;
  }

  updateGeneration() {
    this.gen++;
  }

  updateCurrent(score) {
    this.curr = score;
    if(score > this.best) {
      this.updateBest(score);
    }
  }

}

let status = new StatusBoard();

function print_status(val, pos) {
  textSize(18);
  fill(255);
  if(pos == 1) {
    text("Current score : "+val, 10, 20);
  } else if(pos == 2) {
    text("Best yet : "+val, 10, 45);
  } else if(pos == 3) {
    text("Generation : "+val, 10, 70);
  }
}

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
  }
}

let gameOver = false;
let gameLevel = 0;
let previousGen = []; //dead balls

let highScore = 0;

function draw() {
  frameRate(60);
  background(150);
  print_status(status.curr, 1);
  print_status(status.best, 2);
  print_status(status.gen, 3);

  for(let ITR=0 ; ITR < ANIMATION_SPEED ; ITR++) {
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
      // balls[k].worldEffect(); //uncomment here if using keyboard
      balls[k].fitness_score++;

      let thisBallDied = false;

      for(let j =0 ;  j< barGroups.length ; j++) {

        if(barGroups[j] != null) {
          const bar = barGroups[j];
          if(collision = balls[k].collisionCheckv3(bar)) {
            if(collision < 3) { // (top surface)
              // if(balls[k].score == 9) {
              //   console.log('j',j,'status',balls[k].barstatus)
              // }
              // if(j >= 9) {
              //   console.log(typeof(j),typeof(balls[k].barstatus));
              //   console.log(j > balls[k].barstatus);
              // }
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

      balls[k].useBrain();

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

      if(balls[k].score > highScore) {
        highScore = balls[k].score;
      }

      if(thisBallDied) {
        previousGen.push(balls[k]);
        balls.splice(k,1);
      }

    }

    status.updateCurrent(highScore);
  
    if(balls.length == 0) {
      //RESET EVERYTHING
      barGroups = [];
      barGroups[0] = new BarGroup(world.height-100);
      barGroups[0].left.width = world.width;
      for(let i = 1; i<=MAX_BARS ; i++) {
        barGroups[i] = new BarGroup(-i*300);
      }
      balls = [];
      highScore = 0;
      status.updateCurrent(0);
      status.updateGeneration();


      //GET NEW GENERATION
      balls = nextGeneration(previousGen);
      previousGen = [];
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