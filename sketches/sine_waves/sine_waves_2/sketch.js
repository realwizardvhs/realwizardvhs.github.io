let waves = []; // Declare waves at the top level

function setup() { // p.setup -> function setup()
    createCanvas(windowWidth,windowHeight); // p.createCanvas, p.windowWidth, p.windowHeight -> createCanvas, windowWidth, windowHeight
    noFill(); // p.noFill -> noFill
    background(255); // p.background -> background
    angleMode(DEGREES); // p.angleMode, p.DEGREES -> angleMode, DEGREES

    waves = [
        { baseFreq: 0.5, baseAmp: 100, col: color(255, 165, 0, 80) },     // Orange // p.color -> color
        { baseFreq: 0.2, baseAmp: 200, col: color(0, 0, 255, 80) },   // Blue // p.color -> color
        { baseFreq: 0.3, baseAmp: 80, col: color(0, 255, 127, 80) }, // Spring Green // p.color -> color
        { baseFreq: 0.7, baseAmp: 120, col: color(255, 0, 0, 80) },// Red // p.color -> color
        { baseFreq: 0.4, baseAmp: 150, col: color(128, 0, 128, 80) },    // Purple // p.color -> color
    ];
}

function draw() { // p.draw -> function draw()
    background(255, 1); // p.background -> background

    translate(width / 2, height / 2); // p.translate, p.width, p.height -> translate, width, height

    let t = frameCount * 0.5; // p.frameCount -> frameCount

    for (let i = 0; i < waves.length; i++) {
        let wave = waves[i];
        // Frequencies and amplitudes change over time and relative to each other
        wave.freq = wave.baseFreq + sin(t + i * 45) * 0.2; // p.sin -> sin
        wave.amp = wave.baseAmp + sin(t + i * 60) * 50; // p.sin -> sin
    }

    // Draw each emotion's waveform
    for (let wave of waves) {
        stroke(wave.col); // p.stroke -> stroke
        strokeWeight(2); // p.strokeWeight -> strokeWeight
        beginShape(); // p.beginShape -> beginShape
        for (let x = -width / 2; x <= width / 2; x++) { // p.width -> width
            let angle = (x * wave.freq) + t;
            let y = sin(angle) * wave.amp; // p.sin -> sin
            curveVertex(x, y); // p.curveVertex -> curveVertex
        }
        endShape(); // p.endShape -> endShape
    }
}