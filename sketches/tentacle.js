window.tentacleSketch = function(p){
    class EndEffector {
        constructor(x, y, l) {
        this.position = p.createVector(x, y);
        this.length = l;
        }
    }
    
    class Limb {
        constructor(_root) {
        this.segments = [];
        this.num_effectors = 12;
        this.reach_target = null;
        this.root = _root.copy(); // Ensure the root is stored properly
    
        let limb_segment_length = 200;
        let sum = 0;
        for (let i = 0; i < this.num_effectors; i++) {
            this.segments.push(new EndEffector(p.width / 2, p.height - sum, limb_segment_length));
            sum += limb_segment_length;
            limb_segment_length *= 0.8;
        }
        }
    
        fabrikForward() {
            if (!this.reach_target) return;
        
            // Start with the end effector
            this.segments[this.segments.length - 1].position = this.reach_target.copy();
        
            // Move each segment from end effector to the root
            for (let i = this.segments.length - 2; i >= 0; i--) {
                let next_effector = this.segments[i + 1];
                let current_effector = this.segments[i];
        
                let direction = p5.Vector.sub(current_effector.position, next_effector.position);
                direction.setMag(current_effector.length);
                current_effector.position = p5.Vector.add(next_effector.position, direction);
            }
        }
        
        fabrikBackward() {
            // Set the root in place
            this.segments[0].position = this.root.copy();
        
            // Move each segment from the root to the end effector
            for (let i = 1; i < this.segments.length; i++) {
                let prev_effector = this.segments[i - 1];
                let current_effector = this.segments[i];
        
                let direction = p5.Vector.sub(current_effector.position, prev_effector.position);
                direction.setMag(prev_effector.length);
                current_effector.position = p5.Vector.add(prev_effector.position, direction);
            }
        }
    
        update() {
            this.fabrikForward();
            this.fabrikBackward();
        }
    
        display() {
            p.stroke(0);
            p.strokeWeight(5);
        
            // Draw segments
            for (let i = 0; i < this.segments.length - 1; i++) {
                let current = this.segments[i].position;
                let next = this.segments[i + 1].position;
                p.line(current.x, current.y, next.x, next.y);
                p.circle(current.x, current.y, 20);
            }
        
            // Draw last end effector
            let last = this.segments[this.segments.length - 1].position;
            p.circle(last.x, last.y, 20);
        }
    }
    
    let limb;
    
    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        limb = new Limb(p.createVector(p.width / 2, p.height - 72.5)); // Proper root initialization, adjusted for visibility
    }
    
    p.draw = () => {
        p.background(220);
        limb.reach_target = p.createVector(p.mouseX, p.mouseY);
        limb.update();
        limb.display();
    }
}