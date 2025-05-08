window.sineWavesSketch2 = (p) =>{
    let waves = [];

    p.setup = ()=> {
        p.createCanvas(p.windowWidth,p.windowHeight);
        p.noFill();
        p.background(255);
        p.angleMode(p.DEGREES); // Set angle mode to degrees

        waves = [
            { baseFreq: 0.5, baseAmp: 100, col: p.color(255, 165, 0, 80) },     // Orange
            { baseFreq: 0.2, baseAmp: 200, col: p.color(0, 0, 255, 80) },   // Blue
            { baseFreq: 0.3, baseAmp: 80, col: p.color(0, 255, 127, 80) }, // Spring Green
            { baseFreq: 0.7, baseAmp: 120, col: p.color(255, 0, 0, 80) },// Red
            { baseFreq: 0.4, baseAmp: 150, col: p.color(128, 0, 128, 80) },    // Purple
        ];
    }

    p.draw = ()=> {
        p.background(255, 1);

        p.translate(p.width / 2, p.height / 2);

        let t = p.frameCount * 0.5; // Time variable, adjust multiplier to control speed

        for (let i = 0; i < waves.length; i++) {
            let wave = waves[i];
            // Frequencies and amplitudes change over time and relative to each other
            wave.freq = wave.baseFreq + p.sin(t + i * 45) * 0.2;
            wave.amp = wave.baseAmp + p.sin(t + i * 60) * 50;
        }

        // Draw each emotion's waveform
        for (let wave of waves) {
            p.stroke(wave.col);
            p.strokeWeight(2);
            p.beginShape();
            for (let x = -p.width / 2; x <= p.width / 2; x++) {
                let angle = (x * wave.freq) + t;
                let y = p.sin(angle) * wave.amp;
                p.curveVertex(x, y);
            }
            p.endShape();
        }
    }
}