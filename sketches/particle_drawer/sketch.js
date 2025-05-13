let particles = [];

class Particle {
    constructor(x, y, c, lifespan) {
        this.x = x;
        this.y = y;
        this.lifespan = lifespan;

        this.size  = lifespan / 100;
        this.opacity = 1;
        this.c = color(
            hue(c),
            saturation(c),
            lightness(c),
            this.opacity
        );
    }

    display() {
        fill(this.c);
        noStroke();
        ellipse(this.x, this.y, this.size);
    }

    update() {
        this.x += lerp(0, random(-5, 5), random(0.1, 0.5));
        this.y += lerp(0, random(-5, 5), random(0.1, 0.5));
        this.lifespan -= deltaTime;
        this.size = this.lifespan / 100;
    }
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    colorMode(HSL);
}

function draw() {
    colorMode(RGB);
    background(225);
    colorMode(HSL);
    let to_kill = [];
    for (let i = 0; i < particles.length; i++) {
        let particle = particles[i];
        particle.display();
        particle.update();
        if (particle.lifespan < 0) {
            to_kill.push(i);
        }
    }
    for (let i = 0; i < to_kill.length; i++) {
        particles.splice(to_kill[i], 1);
    }


    if (mouseIsPressed) {
        spawnParticle();
    }
}

function spawnParticle() {
    let mousePos = createVector(mouseX, mouseY);
    let spawnPos = createVector(random(-25, 25), random(-25, 25));
    spawnPos = spawnPos.add(mousePos);
    let newParticle = new Particle(
        spawnPos.x,
        spawnPos.y,
        color(random(360), 80, 60),
        random(4000, 12000)
    );
    particles.push(newParticle);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    background(225);
}
