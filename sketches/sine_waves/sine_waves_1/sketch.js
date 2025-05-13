let waves; // Declare waves globally

function setup() { // p.setup -> function setup()
    createCanvas(windowWidth, windowHeight); // p.createCanvas, p.windowWidth, p.windowHeight -> createCanvas, windowWidth, windowHeight
    noFill(); // p.noFill -> noFill
    background(0); // p.background -> background

    waves = [
        { freq: 0.02, amp: 100, col: color(255, 165, 0, 80) }, // p.color -> color     
        { freq: 0.005, amp: 200, col: color(0, 0, 255, 80) }, // p.color -> color   
        { freq: 0.01, amp: 80, col: color(0, 255, 127, 80) }, // p.color -> color  
        { freq: 0.03, amp: 120, col: color(255, 0, 0, 80) }, // p.color -> color 
        { freq: 0.015, amp: 150, col: color(128, 0, 128, 80) }, // p.color -> color   
    ];
}

function draw() { // p.draw -> function draw()
    background(0, 5); // p.background -> background

    // Draw each emotion's waveform
    for (let w of waves) {
        stroke(w.col); // p.stroke -> stroke
        strokeWeight(2); // p.strokeWeight -> strokeWeight
        beginShape(); // p.beginShape -> beginShape
        for (let x = 0; x <= width; x++) { // p.width -> width
        let angle = (x * w.freq) + (frameCount * 0.05); // p.frameCount -> frameCount
        let y = height / 2 + sin(angle) * w.amp; // p.height, p.sin -> height, sin
        curveVertex(x, y); // p.curveVertex -> curveVertex
        }
        endShape(); // p.endShape -> endShape
    }
}