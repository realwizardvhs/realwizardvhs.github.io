let font;
let particles = [];
let cellSize;

class Particle {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color(random(360), 100, 50);
    }

    display() {
        noStroke();
        fill(this.color);
        rect(this.x, this.y, this.radius / 2, this.radius / 2);
    }
}

function do_thing() {
    for (let i = 0; i < 10; i++) {
        let vec = createVector(mouseX + random(-150, 150), mouseY + random(-150, 150));

    for (let particle of particles) {
        if (dist(vec.x, vec.y, particle.x, particle.y) > 180) {
            continue;
        } else {
            let angle = atan2(particle.y - vec.y, particle.x - vec.x);
            particle.x += cos(angle) * 1.5;
            particle.y += sin(angle) * 1.5;
        }
        }
        particles.push(new Particle(vec.x, vec.y, cellSize));
    }
}

function setup() {

    createCanvas(windowWidth, windowHeight);
    pixelDensity(1);
    colorMode(HSL);
    rectMode(CENTER);


    cellSize = width / 40;

    particles = []; // Reset particles array

}

function draw() {
    background(225);
    if (mouseIsPressed) {
        do_thing();
    }
    for (let particle of particles) {
        particle.display();
    }

    while (particles.length > 2000) {
        particles.splice(0, 1);
    }
}