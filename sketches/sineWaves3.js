window.sineWavesSketch3 = (p) => {
  let waves = [];
  let rotationCounter = 0;

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.noFill();
    p.background(255);
    p.angleMode(p.DEGREES); // Set angle mode to degrees

    waves = [
      { baseFreq: 0.5, baseAmp: 100, col: p.color(255, 165, 0, 80) },  
      { baseFreq: 0.2, baseAmp: 200, col: p.color(0, 0, 255, 80) },  
      { baseFreq: 0.3, baseAmp: 80, col: p.color(0, 255, 127, 80) },
      { baseFreq: 0.7, baseAmp: 120, col: p.color(255, 0, 0, 80) },
      { baseFreq: 0.4, baseAmp: 150, col: p.color(128, 0, 128, 80) },    
    ];
  }

  p.draw = () => {
    p.filter(p.POSTERIZE,3)
    p.translate(p.width / 2, p.height / 2);
    let t = p.frameCount * 8.0; 

    for (let i = 0; i < waves.length; i++) {
      let wave = waves[i];
      p.rotate(rotationCounter)
      rotationCounter +=0.1
      wave.freq = wave.baseFreq + (0.2 * (1 + p.sin(t + i * 45)) / 2) + p.random(0,0.01)
      wave.amp = wave.baseAmp + (50 * (1 + p.sin(t + i * 60)) / 2) + p.random(-0.1, 0.1)
    }

    // Draw each emotion's waveform centered around the canvas center
    for (let wave of waves) {
      p.stroke(wave.col);
      p.strokeWeight(2);
      p.beginShape();
      for (let x = -p.width / 2; x <= p.width / 2; x+=4) {
        let angle = (x * wave.freq) + t;
        let y = p.sin(angle) * wave.amp;
        p.curveVertex(x, y);
      }
      p.endShape();
    }
  }
}
