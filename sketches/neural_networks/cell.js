// ===========================
//      Cell Class
// ===========================
class Cell {
    constructor(x, y, size, /* p5Instance, */ initialState = 0) {
        this.x = x; // Grid column index
        this.y = y; // Grid row index
        this.size = size;
        this.state = initialState; // 0 for 'off' (e.g., white), 1 for 'on' (e.g., black)
    }

    flipState() {
        this.state = 1 - this.state;
    }

    display() {
        // In p5.js, fill(0) is black, fill(255) is white.
        // Standard Langton: White (0) -> turn Right, Black (1) -> turn Left
        // Let's map state 0 to p5 fill 255 (white) and state 1 to p5 fill 0 (black)
        if (this.state === 0) {
            fill(255); // Use global fill
        } else {
            fill(0);   // Use global fill
        }
        noStroke(); // Use global noStroke
        rect(this.x * this.size, this.y * this.size, this.size, this.size); // Use global rect
    }
}