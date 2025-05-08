
window.sineWavesSketch = (p)=>{
    p.setup = ()=> {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.noFill();
        p.background(0);

        waves = [
            { freq: 0.02, amp: 100, col: p.color(255, 165, 0, 80) },      
            { freq: 0.005, amp: 200, col:p.color(0, 0, 255, 80) },    
            { freq: 0.01, amp: 80, col: p.color(0, 255, 127, 80) },   
            { freq: 0.03, amp: 120, col: p.color(255, 0, 0, 80) },  
            { freq: 0.015, amp: 150, col: p.color(128, 0, 128, 80) },    
        ];
    }

    p.draw = ()=> {
       p.background(0, 5); // Slightly transparent background for trail effect

        // Draw each emotion's waveform
        for (let w of waves) {
            p.stroke(w.col);
            p.strokeWeight(2);
            p.beginShape();
            for (let x = 0; x <= p.width; x++) {
            let angle = (x * w.freq) + (p.frameCount * 0.05);
            let y = p.height / 2 + p.sin(angle) * w.amp;
            p.curveVertex(x, y);
            }
            p.endShape();
        }
    }
    
}