let grid;
let cell_size_pixels = 10;


function setup() {
    let w = floor(windowWidth / cell_size_pixels) * cell_size_pixels;
    let h = floor(windowHeight / cell_size_pixels) * cell_size_pixels;
    let canvas = createCanvas(w, h);
    canvas.parent("sketch-container");

    grid = create_grid(cell_size_pixels);

}

function draw() {
    background(255);
    fill(0);
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j].value == 1) {
                rect(grid[i][j].x, grid[i][j].y, cell_size_pixels, cell_size_pixels);
            }
        }
    }
}

function windowResized() {
    let w = floor(windowWidth / cell_size_pixels) * cell_size_pixels;
    let h = floor(windowHeight / cell_size_pixels) * cell_size_pixels;
    resizeCanvas(w, h);
    grid = create_grid(cell_size_pixels);
}

function create_grid(cell_size_pixels) {
    let num_cols = width / cell_size_pixels;
    let num_rows = height / cell_size_pixels;
    
    let grid = [];
    for (let i = 0; i < num_cols; i++) {
        grid.push([]);
        for (let j = 0; j < num_rows; j++) {
            grid[i].push(createCell(i * cell_size_pixels, j * cell_size_pixels));
        }
    }
    return grid;
}

function createCell(x, y) {
    return {
        x,
        y,
        value: Math.random() > 0.5 ? 1 : 0
    }
}
