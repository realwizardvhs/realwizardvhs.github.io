window.spinningCirclesSketch = (p) => {
    let angle = 0;

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.background(240);
        p.noStroke();
    };

    p.draw = () => {
        p.background(255, 100);

        let numCircles = 10;
        let radius = p.min(p.width, p.height) * 0.4;

        for (let i = 0; i < numCircles; i++) {
            let x = p.width / 2 + p.cos(angle + (p.TWO_PI / numCircles) * i) * radius * p.sin(angle * 0.5);
            let y = p.height / 2 + p.sin(angle + (p.TWO_PI / numCircles) * i) * radius * p.cos(angle * 0.5);
            let r = 50 + 30 * p.sin(angle + i);
            
            p.fill(
                100 + 155 * p.cos(angle + i * 0.5),
                100 + 155 * p.sin(angle + i * 0.6),
                100 + 155 * p.cos(angle + i * 0.7)
            );
            p.ellipse(x, y, r, r);
        }
        angle += 0.02;
    };

    p.windowResized = () => {

        p.resizeCanvas(p.width, p.height);
        p.background(240);
    };
};

