class World {
  constructor(width,height) {
    this.gravity = 0.2;
    this.width = width;
    this.height = height;
    this.airFriction = 0.1;
  }
}

const world = new World(500,600);