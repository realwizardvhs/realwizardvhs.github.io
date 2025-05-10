// ===========================
//      Ant Class
// ===========================
class Ant {
    constructor(x, y, gridRef, nnRef, featureExtractorRef, config, p5Instance) {
        this.x = x;
        this.y = y;
        this.grid = gridRef;
        this.nn = nnRef;
        this.featureExtractor = featureExtractorRef;
        this.config = config;
        this.p = p5Instance;

        // Directions: 0: Up (-Y), 1: Right (+X), 2: Down (+Y), 3: Left (-X)
        this.dir = this.p.floor(this.p.random(4));
    }

    // Helper to get state of a cell relative to ant's position and direction
    // localX: positive is to ant's right, negative to its left
    // localY: positive is behind ant, negative is in front of ant
    getRelativeCellState(localX, localY, grid) {
        let dX, dY; // Changes in global X and Y based on localX, localY and ant.dir

        // Transform local relative coordinates to global offsets
        if (this.dir === 0) { // Up
            dX = localX;
            dY = localY;
        } else if (this.dir === 1) { // Right
            dX = -localY;
            dY = localX;
        } else if (this.dir === 2) { // Down
            dX = -localX;
            dY = -localY;
        } else { // dir === 3, Left
            dX = localY;
            dY = -localX;
        }

        const targetX = (this.x + dX + grid.cols) % grid.cols;
        const targetY = (this.y + dY + grid.rows) % grid.rows;
        
        return grid.getCellState(targetX, targetY);
    }


    update(simulationStepCount) {
        // 1. Get current cell's original state (before flipping for Langton's rule)
        const currentCell = this.grid.getCell(this.x, this.y);
        if (!currentCell) {
            console.error("Ant is on an invalid cell!");
            this._resetPosition();
            return;
        }
        const originalCellState = currentCell.state;

        // 2. Extract features for NN (based on originalCellState and current ant/grid state)
        this.featureExtractor.extractFeatures(this, this.grid, simulationStepCount, originalCellState);
        const nnInput = this.featureExtractor.getNNInputArray();

        // 3. Feed features to NN to get turn decision
        let nnOutput;
        try {
            if (!this.nn) throw new Error("NN not available for Ant.");
            if (nnInput.length !== this.nn.inputNodes) {
                 throw new Error(`NN input size mismatch. Ant sending ${nnInput.length}, NN expects ${this.nn.inputNodes}`);
            }
            nnOutput = this.nn.feedforward(nnInput);
        } catch (error) {
            console.error("NN feedforward error in Ant:", error);
            // Fallback: random turn or default turn (e.g., always right)
            nnOutput = [Math.random()]; // Random turn probability
        }
        
        const turnProbabilityRight = nnOutput[0]; // Assuming single output for P(turn_right)

        // 4. Flip the state of the cell the ant is currently on (Standard Langton's Rule)
        currentCell.flipState();

        // 5. Decide turn direction based on NN output
        // Turn right if NN output > threshold, else turn left
        if (turnProbabilityRight > this.config.NN_TURN_THRESHOLD) {
            this.dir = (this.dir + 1) % 4; // Turn Right
        } else {
            this.dir = (this.dir - 1 + 4) % 4; // Turn Left
        }

        // 6. Move forward
        this._moveForward();

        // Ensure ant stays within bounds (or wraps around)
        this.x = (this.x + this.grid.cols) % this.grid.cols;
        this.y = (this.y + this.grid.rows) % this.grid.rows;
    }

    _moveForward() {
        if (this.dir === 0) this.y--; // Up
        else if (this.dir === 1) this.x++; // Right
        else if (this.dir === 2) this.y++; // Down
        else if (this.dir === 3) this.x--; // Left
    }

    _resetPosition() {
        this.x = this.p.floor(this.grid.cols / 2);
        this.y = this.p.floor(this.grid.rows / 2);
        this.dir = this.p.floor(this.p.random(4));
        console.log("Ant position reset.");
    }

    display() {
        this.p.push();
        this.p.translate(this.x * this.config.CELL_SIZE + this.config.CELL_SIZE / 2, 
                         this.y * this.config.CELL_SIZE + this.config.CELL_SIZE / 2);
        
        const antBodyColor = this.config.ANT_COLOR || [255,0,0,150]; // Default red if not in config
        this.p.fill(antBodyColor[0], antBodyColor[1], antBodyColor[2], antBodyColor[3]);
        this.p.noStroke();
        this.p.ellipse(0, 0, this.config.CELL_SIZE * 0.7, this.config.CELL_SIZE * 0.7);

        // Draw a line indicating direction
        this.p.stroke(0,0,0, 200); // Black line for direction
        this.p.strokeWeight(1);
        let len = this.config.CELL_SIZE * 0.35;
        if (this.dir === 0) this.p.line(0, 0, 0, -len);    // Up
        else if (this.dir === 1) this.p.line(0, 0, len, 0); // Right
        else if (this.dir === 2) this.p.line(0, 0, 0, len); // Down
        else if (this.dir === 3) this.p.line(0, 0, -len, 0);// Left
        
        this.p.pop();
    }
}