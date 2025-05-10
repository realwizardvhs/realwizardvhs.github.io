window.neuralAntSketch = (p) => {
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
    const sketchInstance = {
        p5: p, // Assign the p5 instance immediately

        resetSimulation: (reinitializeNNBasedOnFeatures) => {
            if (!sketchInstance.p5) {
                console.error("p5 instance not available in sketchInstance.resetSimulation. Call after setup.");
                return;
            }
            const p5_local = sketchInstance.p5; // Use the stored p5 instance

            console.log("--- Resetting Simulation ---");
            simulationStepCount = 0;
            
            if (reinitializeNNBasedOnFeatures || currentActiveFeatureConfigs.length === 0) {
                currentActiveFeatureConfigs = getActiveFeatureConfigsFromUI(); // Ensure getActiveFeatureConfigsFromUI uses sketchInstance.p5 if needed
                if (currentActiveFeatureConfigs.length === 0) {
                    console.warn("No features selected! Ant's NN might not work as expected.");
                }
            }
            console.log("Active features:", currentActiveFeatureConfigs.map(f => f.name));

            const numCols = p5_local.floor(p5_local.width / CONFIG.CELL_SIZE);
            const numRows = p5_local.floor(p5_local.height / CONFIG.CELL_SIZE);

            simGrid = new Grid(numCols, numRows, CONFIG.CELL_SIZE, p5_local, CONFIG.GRID_INIT_MODE);
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
                        console.warn("NN not created: 0 input features selected. Ant will use default Langton's rules.");
                    }
                } catch (error) {
                    console.error("NN Initialization Failed:", error);
                    simNN = null; 
                    p5_local.noLoop(); 
                    return;
                }
            }

            const startX = p5_local.floor(numCols / 2);
            const startY = p5_local.floor(numRows / 2);
            simAnt = new Ant(startX, startY, simGrid, simNN, simFeatureExtractor, CONFIG, p5_local);
            console.log(`Ant Initialized at (${startX}, ${startY}).`);

            p5_local.background(CONFIG.BACKGROUND_COLOR);
            if (simGrid) simGrid.display(); 
            if (simAnt) simAnt.display(); 
            
            if (!p5_local.isLooping() && (simNN !== null || nnInputSize === 0) ) p5_local.loop(); // Restart draw loop if it was stopped (and NN is ready or not needed)
        },

        changeSpeed: (delta) => {
            if (!sketchInstance.p5) return;
            const p5_local = sketchInstance.p5;
            if (delta > 0) {
                updatesPerFrame = p5_local.min(CONFIG.MAX_UPDATES_PER_FRAME, p5_local.floor(updatesPerFrame * 1.5 + 1));
            } else {
                updatesPerFrame = p5_local.max(1, p5_local.floor(updatesPerFrame * 0.66));
            }
            // Use the updated updateSpeedDisplay, passing the stored speedDisplayElement
            if (sketchInstance.speedDisplayElement) {
                updateSpeedDisplay(sketchInstance.speedDisplayElement, p5_local, updatesPerFrame);
            } else {
                console.warn("speedDisplayElement not found on sketchInstance for changeSpeed.");
            }
            console.log("Updates per frame:", updatesPerFrame);
        }
    };


    function setupSketch() {
        // sketchInstance.p5 is already set to p

        console.log("=== Langton's Ant with NN Brain: Setup ===");

        const canvasContainer = p.select('#canvas-container'); // This is where the canvas is parented by main.js
        if (!canvasContainer) {
            console.error("#canvas-container div not found. UI cannot be placed correctly.");
            // Fallback: append canvas to body or a default div, though positioning will be off
            const canvas = p.createCanvas(CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
            canvas.parent(document.body); // Or some fallback div ID
        } else {
            const canvas = p.createCanvas(CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
            canvas.parent(canvasContainer);
        }
        
        p.frameRate(CONFIG.FRAME_RATE); // Use p

        // --- Create the dynamic UI container for Neural Ant controls ---
        const sketchMainContainer = canvasContainer ? canvasContainer.parent() : p.select('body'); // Parent of canvas-container or fallback
        const controlsOverlay = p.createDiv();
        controlsOverlay.id('dynamicNeuralAntControls');
        controlsOverlay.style('position', 'absolute');
        controlsOverlay.style('top', '10px'); // Adjust as needed
        controlsOverlay.style('left', '10px'); // Adjust as needed
        controlsOverlay.style('padding', '10px');
        controlsOverlay.style('background-color', 'rgba(230, 230, 230, 0.85)'); // Light, semi-transparent
        controlsOverlay.style('border', '1px solid #ccc');
        controlsOverlay.style('border-radius', '5px');
        controlsOverlay.style('z-index', '100'); // Ensure it's above the canvas
        controlsOverlay.style('font-family', 'sans-serif');
        controlsOverlay.style('font-size', '12px');
        controlsOverlay.parent(sketchMainContainer); // Append to the same container as the canvas-container, or body as fallback

        // Initialize UI elements, passing the new controlsOverlay and the p5 instance
        setupUI(controlsOverlay, p, sketchInstance);
        
        updatesPerFrame = CONFIG.UPDATES_PER_FRAME_INIT;
        // Initial call to display speed after UI is set up and element is available on sketchInstance
        if (sketchInstance.speedDisplayElement) {
            updateSpeedDisplay(sketchInstance.speedDisplayElement, p, updatesPerFrame);
        } else {
            console.warn("speedDisplayElement not found on sketchInstance for initial speed display.");
        }

        // Initial setup of simulation components
        sketchInstance.resetSimulation(true);

        console.log("Setup Complete.");
        if (!p.isLooping()) { // Use p
            p.loop(); // Use p
        }
    }


    function drawSketch() {
        // Use p from the outer scope

        if (!simGrid || !simAnt) {
            p.background(CONFIG.BACKGROUND_COLOR); 
            p.fill(0); p.textAlign(p.CENTER,p.CENTER); p.textSize(16);
            p.text("Error: Simulation not initialized. Check console.", p.width/2, p.height/2);
            return;
        }
        // Check if NN should exist but doesn't
        const nnShouldExist = simFeatureExtractor && simFeatureExtractor.getNumberOfActiveFeatures() > 0;
        if (nnShouldExist && !simNN) {
            p.background(CONFIG.BACKGROUND_COLOR); 
            p.fill(0); p.textAlign(p.CENTER,p.CENTER); p.textSize(16);
            p.text("Error: NN not initialized but features are selected.\\nClick 'Apply Feature Changes & Restart NN'.", p.width/2, p.height/2);
            return;
        }

        p.background(CONFIG.BACKGROUND_COLOR);

        for (let i = 0; i < updatesPerFrame; i++) {
            simulationStepCount++;
            try {
                if (simAnt && (simNN || !nnShouldExist)) { // Update if NN is available OR if no NN is expected (0 features)
                    simAnt.update(simulationStepCount);
                }
                // The Ant.update handles the fallback to standard Langton's if simNN is null.
            } catch (error) {
                console.error("Error during Ant update:", error);
                p.noLoop(); // Use p
                return;
            }
        }

        if (simGrid) simGrid.display();
        if (simAnt) simAnt.display();

        p.fill(0); 
        p.noStroke();
        p.textSize(12);
        p.textAlign(p.LEFT, p.TOP);
        p.text(`Step: ${simulationStepCount}`, 10, 10);
        p.text(`Ant @ (${simAnt?.x}, ${simAnt?.y}) Dir: ${simAnt?.dir}`, 10, 25);
        // p.text(`FPS: ${p.frameRate().toFixed(1)}`, 10, 40); // Use p
    }

    // Assign sketch_setup and sketch_draw to p.setup and p.draw
    p.setup = setupSketch;
    p.draw = drawSketch;
}