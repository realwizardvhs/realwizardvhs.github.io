window.rotatingWavesSketch = (p) => {
    let waves = [];
    let rotationCounter = 0;
    let t = 0;
    let offsetX
    let offsetY
    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.noFill();
        p.background(255);
        p.angleMode(p.DEGREES); 

        waves = [
            { baseFreq: 0.5, baseAmp: 100, col: p.color(255, 165, 0, 80) },    
            { baseFreq: 0.2, baseAmp: 200, col: p.color(0, 0, 255, 80) },  
            { baseFreq: 0.3, baseAmp: 80, col: p.color(0, 255, 127, 80) },
            { baseFreq: 0.7, baseAmp: 120, col: p.color(255, 0, 0, 80) },
            { baseFreq: 0.4, baseAmp: 150, col: p.color(128, 0, 128, 80) },  
        ];
        
        offsetX = p.random(-50,50)
        offsetY = p.random(-50,50)
    }

    p.draw = () => {
        p.filter(p.POSTERIZE,5)
        

        // Move the origin to the center of the canvas
        p.translate((p.width / 2) + offsetX, (p.height / 2)+offsetY);

        for(let iter=0;iter<4;iter++){
            t+=0.5
            for (let i = 0; i < waves.length; i++) {
                let wave = waves[i];
                wave.freq = wave.baseFreq + 0.1 * p.sin(t + i * 45);
                wave.amp = wave.baseAmp + 25 * p.sin(t + i * 60);
            }

            // Loop to create multiple rotated layers
            for (let n = 1; n <= 1; n++) {
                p.push();
                p.rotate(rotationCounter * n);

                // Draw each emotion's waveform
                for (let w of waves) {
                    p.stroke(w.col);
                    p.strokeWeight(0.8);
                    p.beginShape();
                    // Increase x increment to reduce the number of calculations
                    for (let x = -p.width / 2; x <= p.width / 2; x += p.width/12) {
                    let angle = (x * w.freq) + t;
                    let y =  p.tan(angle) * p.sin(p.frameCount)
                    p.vertex(x, y);
                    }
                    p.endShape();
                }

                p.pop();
            }

            rotationCounter += 0.1 ; // Increment rotation once per frame


            
            p.pop()
        }
    }
}