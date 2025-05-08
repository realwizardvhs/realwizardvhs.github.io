window.particleTypographySketch = (p) => {
    let particles = [];
    let particleString = "LOVEYOU";
    let particleStringPoints;
    let font;
    let counter = 0;
    let time = 0;

    let renderFontSize;

    const texts = [
        "TEST", "////", "OOOO", "[--]", "NEAT", "WOOP",
        "COOL", "BOOP", "BEEP", "BLOP", "ECHO", "PING", "-][-",
        
    ];

    function calculateTextPoints() {
        if (!font) {
            return;
        }
        if (font && font.font) {
            p.textSize(renderFontSize);

            let textW = p.textWidth(particleString);
            let textAscentValue = p.textAscent();
            let textDescentValue = p.textDescent();
            let textBlockHeight = textAscentValue + textDescentValue;

            let centeredX = (p.width - textW) / 2;

            let centeredY_baseline = (p.height - textBlockHeight) / 2 + textAscentValue;

            particleStringPoints = font.textToPoints(particleString, centeredX, centeredY_baseline, renderFontSize, {
                sampleFactor: 0.08
            });
        }
    }

    class Particle {
        constructor(x, y, size, c, lifespan) {
            this.x = x;
            this.y = y;
            this.displayX = x;
            this.displayY = y;
            this.original_size = size;
            this.size = size;
            this.opacity = 1;
            this.c = p.color(
                p.hue(c),
                p.saturation(c),
                p.lightness(c),
                this.opacity
            );
            this.lifespan = lifespan;
        }

        drawshadow() {
            p.fill('black');
            p.noStroke();
            p.ellipse(this.displayX + 1.5, this.displayY + 1.5, this.size);
        }

        display() {
            this.drawshadow();
            p.fill(this.c);
            p.noStroke();
            p.ellipse(this.displayX, this.displayY, this.size);
        }

        update() {
            this.displayX = p.lerp(this.displayX, this.x, 0.05);
            this.displayY = p.lerp(this.displayY, this.y, 0.05);

            this.displayX += p.random(-2, 2);
            this.displayY += p.random(-2, 2);
            this.lifespan -= p.deltaTime;
            this.size = p.lerp(this.size, this.original_size, 0.5);

            let distanceToMouse = p.dist(this.x, this.y, p.mouseX, p.mouseY);
            let relativeDistance = p.map(distanceToMouse, 0, 120, 0, 5, true);
            relativeDistance = p.constrain(relativeDistance, 0, 5);

            if (distanceToMouse < 75) {
                this.size *= 1.25;
                this.displayX = p.lerp(this.displayX, p.mouseX, 0.15);
                this.displayY = p.lerp(this.displayY, p.mouseY, 0.15);
            } else {
                this.size += p.random(-1, 1);
                this.size = p.lerp(this.size, this.original_size, 0.5);
            }
        }
    }

    function increment() {
        counter++;
        if (counter >= texts.length) {
            counter = 0;
        }
        particleString = texts[counter];
        calculateTextPoints();
    }

    p.preload = () => {
        font = p.loadFont('./assets/fonts/Inconsolata.otf');
    };

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.colorMode(p.HSL);
        p.textSize(renderFontSize);
        renderFontSize =  p.width / 4;
        
        if (font) {
            p.textFont(font);
        }
        
        calculateTextPoints();
    };

    p.draw = () => {
        p.drawingContext.shadowColor = "";
        p.drawingContext.shadowBlur = 0;
        p.drawingContext.shadowOffsetX = 0;
        p.drawingContext.shadowOffsetY = 0;

        time += p.deltaTime;
        if (time > 6000) {
            increment();
            time = 0;
        }

        p.colorMode(p.RGB);
        p.background(255, 100); // Semi-transparent white
        p.colorMode(p.HSL);

        for (let i = particles.length - 1; i >= 0; i--) {
            let particle = particles[i];
            particle.display();
            particle.update();
            if (particle.lifespan < 0) {
                particles.splice(i, 1);
            }
        }

        if (particleStringPoints && particleStringPoints.length > 0) {
            for (let i = 0; i < 4; i++) {
                let randomIndex = p.int(p.random(particleStringPoints.length));
                let point = particleStringPoints[randomIndex];
                let newParticle = new Particle(
                    point.x,
                    point.y,
                    p.random(4, 20),
                    p.color(p.random(360), 80, 60),
                    p.random(1800, 3600)
                );
                particles.push(newParticle);
            }
        }
    };

    p.windowResized = () => {
        p.resizeCanvas(p.width, p.height);
        p.background(255, 100); // Redraw background
        calculateTextPoints();
    };
}; 