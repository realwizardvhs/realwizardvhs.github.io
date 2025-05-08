window.floatyParticlesSketch = (p) => {
    let particles = [];

    class Particle {
        constructor(x, y, c, lifespan) {
            this.x = x;
            this.y = y;
            this.lifespan = lifespan;

            this.size  = lifespan / 100;
            this.opacity = 1;
            this.c = p.color(
                p.hue(c),
                p.saturation(c),
                p.lightness(c),
                this.opacity
            );
        }

        display() {
            p.fill(this.c);
            p.noStroke();
            p.ellipse(this.x, this.y, this.size);
        }

        update() {
            this.x += p.lerp(0, p.random(-5, 5), p.random(0.1, 0.5));
            this.y += p.lerp(0, p.random(-5, 5), p.random(0.1, 0.5));
            this.lifespan -= p.deltaTime;
            this.size = this.lifespan / 100;
        }
    }

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.colorMode(p.HSL);
        maxShapes = 100;
    };

    p.draw = () => {
        p.colorMode(p.RGB);
        p.background(225);
        p.colorMode(p.HSL);
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


        if (p.mouseIsPressed) {
            spawnParticle();
        }
    };

    function spawnParticle() {
        let mousePos = p.createVector(p.mouseX, p.mouseY);
        let spawnPos = p.createVector(p.random(-25, 25), p.random(-25, 25));
        spawnPos = spawnPos.add(mousePos);
        let newParticle = new Particle(
            spawnPos.x,
            spawnPos.y,
            p.color(p.random(360), 80, 60),
            p.random(4000, 12000)
        );
        particles.push(newParticle);
    }

    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        p.background(225);
    };
};
