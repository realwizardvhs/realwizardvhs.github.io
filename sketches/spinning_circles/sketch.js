let angle = 0;

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(240);
    noStroke();
}

function draw() {
    background(255, 100);

    let numCircles = 10;
    let radius = min(width, height) * 0.4;

    for (let i = 0; i < numCircles; i++) {
        let x = width / 2 + cos(angle + (TWO_PI / numCircles) * i) * radius * sin(angle * 0.5);
        let y = height / 2 + sin(angle + (TWO_PI / numCircles) * i) * radius * cos(angle * 0.5);
        let r = 50 + 30 * sin(angle + i);
        
        fill(
            100 + 155 * cos(angle + i * 0.5),
            100 + 155 * sin(angle + i * 0.6),
            100 + 155 * cos(angle + i * 0.7)
        );
        ellipse(x, y, r, r);
    }
    angle += 0.02;
}

function windowResized() {
    resizeCanvas(width, height);
    background(240);
}

