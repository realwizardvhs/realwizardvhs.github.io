class Rectangle {
    constructor(centerX, centerY, sideWidth, sideHeight) {
    this.centerX = centerX;
    this.centerY = centerY;
    this.sideWidth = sideWidth;
    this.sideHeight = sideHeight;
    this.fillColor = color(random(360), 40, 70);
    }

    show() {
        push();
        stroke(0);
        strokeWeight(3);
        blendMode(BLEND);
        fill(this.fillColor);
        ellipse(
            (sin(frameCount) * this.sideWidth) + this.centerX,
            (cos(frameCount) * this.sideHeight) + this.centerY,
            this.sideWidth + 10,
            this.sideHeight + 10
        );
        blendMode(HARD_LIGHT);
        fill(this.fillColor);
        rect(
            (sin(frameCount) * this.sideWidth) + this.centerX,
            (cos(frameCount) * this.sideHeight) + this.centerY,
            this.sideWidth/2,
            this.sideHeight/2
        );
    
        pop();
    }
}

let rectangles = [];
    let offset = 6
    let offset2 = 8

function setup() {
    createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES);
    rectMode(CENTER);
    ellipseMode(CENTER);
    colorMode(HSL);
    let count = 32;
    let size = 6;
    for (let i = 0; i < width; i += width / count) {
        rectangles.push(new Rectangle(-45, -45, (size * i) / 10, (size * i) / 10));
    }
    rectangles = rectangles.reverse();
}

function draw() {
    background(255);
    translate(width / 2, height / 2);

    drawingContext.setLineDash([offset, offset2]);
    for (let r of rectangles) {
        rotate(frameCount/12);
        r.show();
    }
}