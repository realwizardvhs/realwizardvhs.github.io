let simGrid;
let simAnt;
let simNN;
let simFeatureExtractor;

let simulationStepCount = 0;
let updatesPerFrame;

// Store active feature configurations (subset of CONFIG.ALL_AVAILABLE_FEATURES)
let currentActiveFeatureConfigs = [];


// This is a global-like object that will be passed to setupUI
// It allows UI elements to call functions on the main sketch

function resetSimulation(reinitializeNNBasedOnFeatures) {
    console.log("--- Resetting Simulation ---");
    simulationStepCount = 0;
    
    if (reinitializeNNBasedOnFeatures || currentActiveFeatureConfigs.length === 0) {
        currentActiveFeatureConfigs = getActiveFeatureConfigsFromUI(); // Ensure getActiveFeatureConfigsFromUI uses sketchInstance.p5 if needed
        if (currentActiveFeatureConfigs.length === 0) {
            console.warn("No features selected! Ant\'s NN might not work as expected.");
        }
    }
    console.log("Active features:", currentActiveFeatureConfigs.map(f => f.name));

    const numCols = floor(width / CONFIG.CELL_SIZE);
    const numRows = floor(height / CONFIG.CELL_SIZE);

    simGrid = new Grid(numCols, numRows, CONFIG.CELL_SIZE, this, CONFIG.GRID_INIT_MODE);
    console.log(`Grid Initialized: ${numCols}x${numRows}, Mode: ${CONFIG.GRID_INIT_MODE}`);

    if (!simFeatureExtractor) {
        simFeatureExtractor = new FeatureExtractor(CONFIG, currentActiveFeatureConfigs);
    } else {
        simFeatureExtractor.setActiveFeatures(currentActiveFeatureConfigs);
    }
    console.log("Feature Extractor Initialized/Updated.");

    const nnInputSize = simFeatureExtractor.getNumberOfActiveFeatures();
    if (nnInputSize <= 0 && reinitializeNNBasedOnFeatures) {
        console.warn("NN Input size is 0 or less. NN will likely fail or produce trivial output.");
    }

    if (reinitializeNNBasedOnFeatures || !simNN) {
        try {
            if (nnInputSize > 0) {
                simNN = new NeuralNetwork(
                    nnInputSize,
                    CONFIG.NN_HIDDEN_LAYERS,
                    CONFIG.NN_HIDDEN_NODES_PER_LAYER,
                    CONFIG.NN_OUTPUT_NODES,
                    CONFIG.NN_OUTPUT_ACTIVATION,
                    CONFIG.NN_HIDDEN_ACTIVATION_CANDIDATES
                );
                console.log(`NN Initialized/Reinitialized. Inputs: ${nnInputSize}, Output: ${CONFIG.NN_OUTPUT_NODES}`);
            } else {
                simNN = null; 
                console.warn("NN not created: 0 input features selected. Ant will use default Langton\'s rules.");
            }
        } catch (error) {
            console.error("NN Initialization Failed:", error);
            simNN = null; 
            noLoop();
            return;
        }
    }

    const startX = floor(numCols / 2);
    const startY = floor(numRows / 2);
    simAnt = new Ant(startX, startY, simGrid, simNN, simFeatureExtractor, CONFIG, this);
    console.log(`Ant Initialized at (${startX}, ${startY}).`);

    background(CONFIG.BACKGROUND_COLOR);
    if (simGrid) simGrid.display(); 
    if (simAnt) simAnt.display(); 
    
    if (!isLooping() && (simNN !== null || nnInputSize === 0) ) loop();
}

function changeSpeed(delta) {
    if (delta > 0) {
        updatesPerFrame = min(CONFIG.MAX_UPDATES_PER_FRAME, floor(updatesPerFrame * 1.5 + 1));
    } else {
        updatesPerFrame = max(1, floor(updatesPerFrame * 0.66));
    }
    let speedDisplayElement = document.getElementById('speedDisplay');
    if (speedDisplayElement) {
        updateSpeedDisplay(speedDisplayElement, null, updatesPerFrame);
    } else {
        console.warn("speedDisplayElement not found for changeSpeed.");
    }
    console.log("Updates per frame:", updatesPerFrame);
}


function setup() {
    console.log("=== Langton\'s Ant with NN Brain: Setup ===");

    const canvasContainer = select('#canvas-container');
    if (!canvasContainer) {
        console.error("#canvas-container div not found. UI cannot be placed correctly.");
        const canvas = createCanvas(CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
        canvas.parent(document.body); 
    } else {
        const canvas = createCanvas(CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
        canvas.parent(canvasContainer);
    }
    
    frameRate(CONFIG.FRAME_RATE);

    const sketchMainContainer = canvasContainer ? canvasContainer.parent() : select('body');
    const controlsOverlay = createDiv();
    controlsOverlay.id('dynamicNeuralAntControls');
    controlsOverlay.style('position', 'absolute');
    controlsOverlay.style('top', '10px');
    controlsOverlay.style('left', '10px');
    controlsOverlay.style('padding', '10px');
    controlsOverlay.style('background-color', 'rgba(230, 230, 230, 0.85)');
    controlsOverlay.style('border', '1px solid #ccc');
    controlsOverlay.style('border-radius', '5px');
    controlsOverlay.style('z-index', '100');
    controlsOverlay.style('font-family', 'sans-serif');
    controlsOverlay.style('font-size', '12px');
    controlsOverlay.parent(sketchMainContainer);

    setupUI(controlsOverlay, null, { resetSimulation, changeSpeed });
    
    updatesPerFrame = CONFIG.UPDATES_PER_FRAME_INIT;
    let speedDisplayElementGlobal = document.getElementById('speedDisplay');
    if (speedDisplayElementGlobal) {
        updateSpeedDisplay(speedDisplayElementGlobal, null, updatesPerFrame);
    } else {
        console.warn("speedDisplayElement not found for initial speed display.");
    }

    resetSimulation(true);

    console.log("Setup Complete.");
    if (!isLooping()) {
        loop();
    }
}


function draw() {
    if (!simGrid || !simAnt) {
        background(CONFIG.BACKGROUND_COLOR);
        fill(0); textAlign(CENTER,CENTER); textSize(16);
        text("Error: Simulation not initialized. Check console.", width/2, height/2);
        return;
    }
    const nnShouldExist = simFeatureExtractor && simFeatureExtractor.getNumberOfActiveFeatures() > 0;
    if (nnShouldExist && !simNN) {
        background(CONFIG.BACKGROUND_COLOR);
        fill(0); textAlign(CENTER,CENTER); textSize(16);
        text("Error: NN not initialized but features are selected.\\\\nClick \'Apply Feature Changes & Restart NN\'.", width/2, height/2);
        return;
    }

    background(CONFIG.BACKGROUND_COLOR);

    for (let i = 0; i < updatesPerFrame; i++) {
        simulationStepCount++;
        try {
            if (simAnt && (simNN || !nnShouldExist)) {
                simAnt.update(simulationStepCount);
            }
        } catch (error) {
            console.error("Error during Ant update:", error);
            noLoop();
            return;
        }
    }

    if (simGrid) simGrid.display();
    if (simAnt) simAnt.display();

    fill(0);
    noStroke();
    textSize(12);
    textAlign(LEFT, TOP);
    text(`Step: ${simulationStepCount}`, 10, 10);
    text(`Ant @ (${simAnt?.x}, ${simAnt?.y}) Dir: ${simAnt?.dir}`, 10, 25);
}