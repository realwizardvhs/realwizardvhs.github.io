window.particlePusherSketch = function(p) {
    let font;
    let particles = [];
    let cellSize;
    class Particle {
        constructor(x, y, radius) {
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.color = p.color(p.random(360), 100, 50);
        }

        display() {
            p.noStroke();
            p.fill(this.color);
            p.rect(this.x, this.y, this.radius / 2, this.radius / 2);
        }
    }

    function do_thing() {
        for (let i = 0; i < 10; i++) {
            let vec = p.createVector(p.mouseX + p.random(-150, 150), p.mouseY + p.random(-150, 150));

        for (let particle of particles) {
            if (p.dist(vec.x, vec.y, particle.x, particle.y) > 180) {
                continue;
            } else {
                let angle = p.atan2(particle.y - vec.y, particle.x - vec.x);
                particle.x += p.cos(angle) * 1.5;
                particle.y += p.sin(angle) * 1.5;
            }
            }
            particles.push(new Particle(vec.x, vec.y, cellSize));
        }
    }

    p.setup = function() {

        p.createCanvas(p.windowWidth, p.windowHeight);
        p.pixelDensity(1);
        p.colorMode(p.HSL);
        p.rectMode(p.CENTER);


        cellSize = p.width / 40

        particles = []; // Reset particles array

    };

    p.draw = function() {
        p.background(225);
        if (p.mouseIsPressed) {
            do_thing();
        }
        for (let particle of particles) {
            particle.display();
        }

        while (particles.length > 2000) {
            particles.splice(0, 1);
        }
    };


}; 