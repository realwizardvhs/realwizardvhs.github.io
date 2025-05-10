// ===========================
//      Configuration
// ===========================

// --- Helper Functions (moved here for organization) ---
function normalize(value, minVal, maxVal, targetMin = 0, targetMax = 1) {
    if (maxVal === minVal) return targetMin + (targetMax - targetMin) / 2; // Or just targetMin, or 0
    const clampedVal = Math.max(minVal, Math.min(maxVal, value));
    return targetMin + (targetMax - targetMin) * (clampedVal - minVal) / (maxVal - minVal);
}

function clamp(value, minVal, maxVal) {
    return Math.max(minVal, Math.min(maxVal, value));
}


const CONFIG = {
    // --- Simulation & Grid ---
    CANVAS_WIDTH: 600,
    CANVAS_HEIGHT: 600,
    CELL_SIZE: 5,
    BACKGROUND_COLOR: 255, // Light grey background
    GRID_INIT_MODE: 'all_off', // 'all_off' or 'random'
    UPDATES_PER_FRAME_INIT: 1,
    MAX_UPDATES_PER_FRAME: 1000,
    FRAME_RATE: 30,

    // --- Ant ---
    ANT_COLOR: [255, 0, 0, 150], // Red, slightly transparent

    // --- Neural Network ---
    NN_HIDDEN_LAYERS: 2,
    NN_HIDDEN_NODES_PER_LAYER: 8,
    NN_OUTPUT_NODES: 1, // Single output for turn decision (probability of turning right)
    NN_OUTPUT_ACTIVATION: 'sigmoid',
    NN_HIDDEN_ACTIVATION_CANDIDATES: ['relu', 'tanh', 'sigmoid', 'leaky_relu'],
    NN_TURN_THRESHOLD: 0.5, // Threshold for NN output to turn right

    // --- Feature Calculation Parameters ---
    // For 'step_count_sin', 'step_count_cos'
    TIME_FEATURE_FREQUENCY: 0.01,
    // For 'patch_...' features. Defines a relative region around the ant.
    // Example: a 3x3 region centered on the ant. (0,0) is ant's current cell.
    // These are relative to grid axes, not ant's direction for simplicity here.
    // For direction-relative patch, use specific features like 'patch_fwd_C_state'.
    PATCH_RELATIVE_COORDS: [
        // {relX: -1, relY: -1}, {relX: 0, relY: -1}, {relX: 1, relY: -1},
        // {relX: -1, relY:  0}, /*{relX:0,relY:0},*/ {relX: 1, relY:  0}, // Current cell state handled separately
        // {relX: -1, relY:  1}, {relX: 0, relY:  1}, {relX: 1, relY:  1},
    ],

    // --- Feature Definitions for NN Input ---
    // 'id': unique identifier, used internally
    // 'name': display name for UI
    // 'defaultEnabled': boolean, whether it's active by default
    // 'extractor': function(ant, grid, simulationStepCount, config, S_orig_current_cell) => value
    ALL_AVAILABLE_FEATURES: [
        { id: 'bias', name: 'Bias Input (1.0)', defaultEnabled: true, extractor: () => 1.0 },
        { id: 'current_cell_original_state', name: 'Current Cell (Original State)', defaultEnabled: true, extractor: (ant, grid, simStep, config, S_orig) => S_orig },
        { id: 'ant_x_norm', name: 'Ant X (Norm)', defaultEnabled: true, extractor: (ant, grid) => normalize(ant.x, 0, grid.cols - 1) },
        { id: 'ant_y_norm', name: 'Ant Y (Norm)', defaultEnabled: true, extractor: (ant, grid) => normalize(ant.y, 0, grid.rows - 1) },
        { id: 'ant_dir_sin', name: 'Ant Direction (Sin)', defaultEnabled: true, extractor: (ant) => Math.sin(ant.dir * Math.PI / 2) },
        { id: 'ant_dir_cos', name: 'Ant Direction (Cos)', defaultEnabled: true, extractor: (ant) => Math.cos(ant.dir * Math.PI / 2) },
        { id: 'random_input', name: 'Random Input', defaultEnabled: false, extractor: () => Math.random() * 2 - 1 },
        { id: 'step_time_sin', name: 'Sim Step Time (Sin)', defaultEnabled: false, extractor: (ant, grid, simStep, config) => Math.sin(simStep * config.TIME_FEATURE_FREQUENCY) },
        
        // Direction-relative patch (1 cell forward, 1 left-of-forward, 1 right-of-forward)
        { id: 'fwd_cell_state', name: 'Cell State: Forward', defaultEnabled: true, extractor: (ant, grid) => ant.getRelativeCellState(0, -1, grid)}, // 0:local_x, -1:local_y (forward)
        { id: 'fwd_left_cell_state', name: 'Cell State: Forward-Left', defaultEnabled: false, extractor: (ant, grid) => ant.getRelativeCellState(-1, -1, grid)}, // -1:local_x (left), -1:local_y (forward)
        { id: 'fwd_right_cell_state', name: 'Cell State: Forward-Right', defaultEnabled: false, extractor: (ant, grid) => ant.getRelativeCellState(1, -1, grid)}, // 1:local_x (right), -1:local_y (forward)
        
        // Add more features as desired, e.g., for cells to the side or behind
        { id: 'left_cell_state', name: 'Cell State: Left', defaultEnabled: false, extractor: (ant, grid) => ant.getRelativeCellState(-1, 0, grid)},
        { id: 'right_cell_state', name: 'Cell State: Right', defaultEnabled: false, extractor: (ant, grid) => ant.getRelativeCellState(1, 0, grid)},
    ]
};

// Dynamically add patch cell features based on PATCH_RELATIVE_COORDS
// This part is commented out as specific relative features are preferred for clarity.
// If a generic patch is needed, this can be uncommented and refined.
/*
CONFIG.PATCH_RELATIVE_COORDS.forEach(coord => {
    CONFIG.ALL_AVAILABLE_FEATURES.push({
        id: `patch_${coord.relX}_${coord.relY}`,
        name: `Patch Cell (${coord.relX}, ${coord.relY}) State`,
        defaultEnabled: false,
        extractor: (ant, grid) => {
            const x = (ant.x + coord.relX + grid.cols) % grid.cols;
            const y = (ant.y + coord.relY + grid.rows) % grid.rows;
            return grid.getCellState(x, y);
        }
    });
});
*/