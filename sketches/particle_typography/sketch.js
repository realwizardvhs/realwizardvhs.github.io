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
        textSize(renderFontSize);

        let textW = textWidth(particleString);
        let textAscentValue = textAscent();
        let textDescentValue = textDescent();
        let textBlockHeight = textAscentValue + textDescentValue;

        let centeredX = (width - textW) / 2;

        let centeredY_baseline = (height - textBlockHeight) / 2 + textAscentValue;

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
        this.c = color(
            hue(c),
            saturation(c),
            lightness(c),
            this.opacity
        );
        this.lifespan = lifespan;
    }

    drawshadow() {
        fill('black');
        noStroke();
        ellipse(this.displayX + 1.5, this.displayY + 1.5, this.size);
    }

    display() {
        this.drawshadow();
        fill(this.c);
        noStroke();
        ellipse(this.displayX, this.displayY, this.size);
    }

    update() {
        this.displayX = lerp(this.displayX, this.x, 0.05);
        this.displayY = lerp(this.displayY, this.y, 0.05);

        this.displayX += random(-2, 2);
        this.displayY += random(-2, 2);
        this.lifespan -= deltaTime;
        this.size = lerp(this.size, this.original_size, 0.5);

        let distanceToMouse = dist(this.x, this.y, mouseX, mouseY);
        let relativeDistance = map(distanceToMouse, 0, 120, 0, 5, true);
        relativeDistance = constrain(relativeDistance, 0, 5);

        if (distanceToMouse < 75) {
            this.size *= 1.25;
            this.displayX = lerp(this.displayX, mouseX, 0.15);
            this.displayY = lerp(this.displayY, mouseY, 0.15);
        } else {
            this.size += random(-1, 1);
            this.size = lerp(this.size, this.original_size, 0.5);
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

function preload() {
    font = loadFont('../assets/fonts/Inconsolata.otf');
}

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent("sketch-container");
    colorMode(HSL);
    renderFontSize =  width / 4;
    textSize(renderFontSize);
    
    if (font) {
        textFont(font);
    }
    
    calculateTextPoints();
}

function draw() {
    drawingContext.shadowColor = "";
    drawingContext.shadowBlur = 0;
    drawingContext.shadowOffsetX = 0;
    drawingContext.shadowOffsetY = 0;

    time += deltaTime;
    if (time > 6000) {
        increment();
        time = 0;
    }

    colorMode(RGB);
    background(255, 100);
    colorMode(HSL);

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
            let randomIndex = int(random(particleStringPoints.length));
            let point = particleStringPoints[randomIndex];
            let newParticle = new Particle(
                point.x,
                point.y,
                random(4, 20),
                color(random(360), 80, 60),
                random(1800, 3600)
            );
            particles.push(newParticle);
        }
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    background(255);
    renderFontSize = width / 4;
    textSize(renderFontSize);
    calculateTextPoints();
}

function getNearbyPoints(x, y, searchRadius, numPointsToFind) {
    if (!particleStringPoints) return [];

    let nearbyPoints = [];
    let shuffledPoints = shuffle(particleStringPoints);

    for (let pt of shuffledPoints) {
        let distance = dist(x, y, pt.x, pt.y);
        if (distance < searchRadius) {
            nearbyPoints.push(pt);
            if (nearbyPoints.length >= numPointsToFind) {
                break;
            }
        }
    }
    return nearbyPoints;
}

function mouseDragged() {
    const clickX = mouseX;
    const clickY = mouseY;
    const searchRadius = 150;
    const numPointsToSpawnFrom = 15;
    const particlesPerPoint = 4;

    let nearbyPoints = getNearbyPoints(clickX, clickY, searchRadius, numPointsToSpawnFrom);

    if (nearbyPoints.length > 0) {
        for (let pt of nearbyPoints) {
            for (let i = 0; i < particlesPerPoint; i++) {
                let newParticle = new Particle(
                    pt.x + random(-25,25),
                    pt.y + random(-25,25),
                    random(2, 12),
                    color(random(360), 90, 70),
                    random(100, 200)
                );
                particles.push(newParticle);
            }
        }
    }
}