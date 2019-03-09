class Ball {
  constructor() {
    this.x = 0;
    this.y = 0.7*world.height; //initial y at 20% far from bottom
    this.speedY = 0; //normal speed of moving w/o external force in y-axis
    this.speedX = 0;
    this.diameter = 40;
    this.thrust = -9; //thrust up while jumping
    this.score = -1;
    this.nextbar = 0;
    this.barstatus = []; //array length = total bars, false - not counted, true - counted
    this.brain = new NeuralNetwork(7,7,5);
  }

  draw() {
    fill('rgba(224, 24, 24, 0.5)');
    const {x,y,diameter} = this;
    ellipse(x,y,diameter,diameter);
  }

  worldEffect() {
    const {gravity,width,height} = world;

    const {speedY,speedX,x} = this;
    this.y += speedY;
    this.speedY += gravity;

    this.x += speedX;

    if(speedX > 0) {
      this.speedX -= world.airFriction;
    } else {
      this.speedX += world.airFriction;
    }

    if(x >= width || x <= 0)
      this.speedX = 0;
  }

  moveRight() {
    const {x} = this;
    if (x <= width)
      this.speedX = 4;
  }
  moveLeft() {
    const {x} = this;
    if (x >= 0)
      this.speedX = -4;
  }

  jump() {
    this.speedY = this.thrust;
  }

  //collision with bar group (basic true/false) (v1)
  collisionWithBar(bar) {
    const radius = this.diameter/2;

    if(this.x - radius <= bar.left.width && (this.y - radius <= bar.y + bar.height  && this.y + radius >= bar.y) ) {
      return true;
    }

    if(this.x + radius >= bar.right.x && (this.y - radius <= bar.y + bar.height  && this.y + radius >= bar.y) ) {
      return true;
    }
    return false;
  }


  /* collision detection with specific area info
   * 0 - no collision
   * 1 - left top
   * 2 - left bottom
   * 3 - right top
   * 4 - right bottom
   */
  collisionCheckv2(bar) {
    const radius = this.diameter/2;

    //left
    if(this.x - radius <= bar.left.width) {
      //top-surface
      if (this.y + radius >= bar.y && this.y + radius <= bar.y + bar.height) {
        return 1;
      }
      //bottom surface
      if (this.y - radius <= bar.y + bar.height && this.y - radius >= bar.y) {
        return 2;
      }
    }

    //right
    if(this.x + radius >= bar.right.x) {
      //top-surface
      if (this.y + radius >= bar.y && this.y + radius <= bar.y + bar.height) {
        return 3;
      }
      //bottom surface
      if (this.y - radius <= bar.y + bar.height && this.y - radius >= bar.y) {
        return 4;
      }
    }
    return 0;
  }

  /* collision detection with specific area info v3
   * 1 - left top
   * 2 - right top
   *
   * 3 - no collision
   *
   * 4 - left bottom
   * 5 - right bottom
   */
  collisionCheckv3(bar) {
    const radius = this.diameter/2;
    //top surface
    if (this.y + radius >= bar.y && this.y + radius <= bar.y + bar.height) {
      if(this.x - radius <= bar.left.width) return 1; //left
      if(this.x + radius >= bar.right.x) return 2; //right
    }
    //bottom surface
    if (this.y - radius <= bar.y + bar.height && this.y - radius >= bar.y) {
      if(this.x - radius <= bar.left.width) return 4; //left
      if(this.x + radius >= bar.right.x) return 5; //right
    }
    return 3;
  }

   /*
    * INPUTS:
    * -------
    * ball Y
    * ball X
    * ball Speed Y
    * ball Speed X
    * barLeft Width
    * barRight X
    * bar Y
    *
    * OUTPUTS:
    * -------
    * jump
    * No jump
    * left
    * right
    * No direction
    */
  useBrain(barGroups) {
    const {y,x,speedY,speedX,nextbar} = this;

    const input = [];
    input.push(y);
    input.push(x);
    input.push(speedY);
    input.push(speedX);
    input.push(barGroups[nextbar].left.width);
    input.push(barGroups[nextbar].right.x);
    input.push(barGroups[nextbar].y);

    const output = this.brain.feedforward(input);

    console.log('next bar : ',nextbar);

    if(output[0] > output[1]) {
      for(let bar of barGroups) {
        if(this.collisionCheckv3(bar) < 3) {
          console.log('trynna jump..');
          this.jump();
        }
      }
    }

    if((output[2]+output[3])/2 > output[4]) {
      if(output[2] > output[3])
        this.moveLeft();
      else
        this.moveRight();
    }
  }
}