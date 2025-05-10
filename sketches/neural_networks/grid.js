// ===========================
//      Grid Class
// ===========================
class Grid {
    constructor(cols, rows, cellSize, p5Instance, initMode = 'all_off') {
        this.cols = cols;
        this.rows = rows;
        this.cellSize = cellSize;
        this.p = p5Instance;
        this.cells = [];

        for (let i = 0; i < this.cols; i++) {
            this.cells[i] = [];
            for (let j = 0; j < this.rows; j++) {
                let initialState = 0;
                if (initMode === 'random') {
                    initialState = this.p.floor(this.p.random(2));
                }
                this.cells[i][j] = new Cell(i, j, this.cellSize, this.p, initialState);
            }
        }
    }

    getCell(x, y) {
        if (x >= 0 && x < this.cols && y >= 0 && y < this.rows) {
            return this.cells[x][y];
        }
        return null; // Or handle out-of-bounds differently
    }

    getCellState(x, y) {
        const cell = this.getCell(x, y);
        return cell ? cell.state : 0; // Default to 0 if out of bounds
    }

    setCellState(x, y, state) {
        const cell = this.getCell(x, y);
        if (cell) {
            cell.state = state;
        }
    }
    
    flipCellState(x,y){
        const cell = this.getCell(x,y);
        if(cell){
            cell.flipState();
        }
    }

    display() {
        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                this.cells[i][j].display();
            }
        }
    }
}