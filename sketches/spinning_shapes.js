window.spinningShapesSketch = function(p){
    class Rectangle {
        constructor(centerX, centerY, sideWidth, sideHeight) {
        this.centerX = centerX;
        this.centerY = centerY;
        this.sideWidth = sideWidth;
        this.sideHeight = sideHeight;
        this.fillColor = p.color(p.random(360), 40, 70);
        }
    
        show() {
            p.push();
            p.stroke(0);
            p.strokeWeight(3);
            p.blendMode(p.BLEND);
            p.fill(this.fillColor);
            p.ellipse(
                (p.sin(p.frameCount) * this.sideWidth) + this.centerX,
                (p.cos(p.frameCount) * this.sideHeight) + this.centerY,
                this.sideWidth + 10,
                this.sideHeight + 10
            );
            p.blendMode(p.HARD_LIGHT);
            p.fill(this.fillColor);
            p.rect(
                (p.sin(p.frameCount) * this.sideWidth) + this.centerX,
                (p.cos(p.frameCount) * this.sideHeight) + this.centerY,
                this.sideWidth/2,
                this.sideHeight/2
            );
        
            p.pop();
        }
    }
    
    let rectangles = [];
        let offset = 6
        let offset2 = 8
    
    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.angleMode(p.DEGREES);
        p.rectMode(p.CENTER);
        p.ellipseMode(p.CENTER);
        p.colorMode(p.HSL);
        let count = 32;
        let size = 6;
        for (let i = 0; i < p.width; i += p.width / count) {
            rectangles.push(new Rectangle(-45, -45, (size * i) / 10, (size * i) / 10));
        }
        rectangles = rectangles.reverse();
    }
    
    p.draw = () => {
        p.background(255);
        p.translate(p.width / 2, p.height / 2);
    
        p.drawingContext.setLineDash([offset, offset2]);
        for (let r of rectangles) {
            p.rotate(p.frameCount/12);
            r.show();
        }
    }
}