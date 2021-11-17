
let bugs = []; // array of Jitter objects

function setup() {
    createCanvas(windowWidth, windowHeight);
  // Create objects
  for (let i = 0; i < 50; i++) {
    bugs.push(new Jitter());
  }
}

function draw() {
  background(0);
  for (let i = 0; i < bugs.length; i++) {
    bugs[i].move();
    bugs[i].display();
  }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
  }

// Jitter class
class Jitter {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.diameter = random(10, 30);
    this.speed = 1;
  }

  move() {
    this.x += random(-this.speed, this.speed);
    this.y += random(-this.speed, this.speed);
  }

  display() {
    fill(random(0, 255), random(0, 255), random(0, 255));
    ellipse(this.x, this.y, this.diameter, this.diameter);
  }
}


