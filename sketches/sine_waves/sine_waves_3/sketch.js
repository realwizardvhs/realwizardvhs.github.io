let waves = [];
let rotationCounter = 0;

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
}

function draw() {
  filter(POSTERIZE,3)
  background(255,2)
  translate(width / 2, height / 2);

    let t = frameCount 
    for (let i = 0; i < waves.length; i++) {
      let wave = waves[i];
      rotate(rotationCounter);
      rotationCounter += 0.1
      wave.freq = wave.baseFreq + (0.2 * (1 + sin(t + i * 45)) / 2) + random(0,0.01);
      wave.amp = wave.baseAmp + (50 * (1 + sin(t + i * 60)) / 2) + random(-0.1, 0.1);
    }

    for (let wave of waves) {
      stroke(wave.col);
      strokeWeight(2);
      let prevX = -width / 2;
      let prevY = sin(prevX * wave.freq) * wave.amp;
      for (let x = -width / 2; x <= width / 2; x+=4) {
        let angle = (x * wave.freq) + t;
        let y = sin(angle) * wave.amp;
        line(prevX, prevY, x, y);
        prevX = x;
        prevY = y;
      }
  }
}
