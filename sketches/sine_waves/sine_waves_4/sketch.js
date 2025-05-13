let waves = [];
let rotationCounter = 0;
let t = 0;
let offsetX;
let offsetY;

function setup() {
    createCanvas(windowWidth, windowHeight);
    noFill();
    background(255);
    angleMode(DEGREES);

    waves = [
        { baseFreq: 0.5, baseAmp: 100, col: color(255, 165, 0, 80) },
        { baseFreq: 0.2, baseAmp: 200, col: color(0, 0, 255, 80) },
        { baseFreq: 0.3, baseAmp: 80, col: color(0, 255, 127, 80) },
        { baseFreq: 0.7, baseAmp: 120, col: color(255, 0, 0, 80) },
        { baseFreq: 0.4, baseAmp: 150, col: color(128, 0, 128, 80) },
    ];
    
    offsetX = random(-50,50);
    offsetY = random(-50,50);
}

function draw() {
    filter(POSTERIZE,5);
    

    // Move the origin to the center of the canvas
    translate((width / 2) + offsetX, (height / 2)+offsetY);

    for(let iter=0;iter<4;iter++){
        t+=0.5;
        for (let i = 0; i < waves.length; i++) {
            let wave = waves[i];
            wave.freq = wave.baseFreq + 0.1 * sin(t + i * 45);
            wave.amp = wave.baseAmp + 25 * sin(t + i * 60);
        }

        // Loop to create multiple rotated layers
        for (let n = 1; n <= 1; n++) {
            push();
            rotate(rotationCounter * n);

            // Draw each emotion's waveform
            for (let w of waves) {
                stroke(w.col);
                strokeWeight(0.8);
                beginShape();
                // Increase x increment to reduce the number of calculations
                for (let x = -width / 2; x <= width / 2; x += width/12) {
                let angle = (x * w.freq) + t;
                let y =  tan(angle) * sin(frameCount);
                vertex(x, y);
                }
                endShape();
            }

            pop();
        }

        rotationCounter += 0.1 ; // Increment rotation once per frame


        
        pop();
    }
}