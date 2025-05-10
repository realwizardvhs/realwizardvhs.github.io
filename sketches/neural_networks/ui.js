// ===========================
//      UI Controls
// ===========================
let featureCheckboxes = {}; // To store p5.Checkbox objects
let speedDisplayElement; // To store the speed display span element

// controlsContainer is the p5.Element passed from neural_ant.js
function setupUI(controlsContainer, p, sketchInstance) {
    controlsContainer.html(''); // Clear any previous content if sketch is reloaded

    // --- Sketch Title ---
    const title = p.createElement('h3', 'Neural Ant Controls');
    title.parent(controlsContainer);
    title.style('margin-top', '0px');

    // --- General Controls ---
    const generalControlsDiv = p.createDiv();
    generalControlsDiv.parent(controlsContainer);
    generalControlsDiv.style('margin-bottom', '10px');

    const resetButton = p.createButton('Reset Simulation');
    resetButton.parent(generalControlsDiv);
    resetButton.mousePressed(() => sketchInstance.resetSimulation(false));

    // --- Speed Controls ---
    const speedControlsDiv = p.createDiv();
    speedControlsDiv.parent(controlsContainer);
    speedControlsDiv.style('margin-bottom', '10px');

    p.createSpan('Speed: ').parent(speedControlsDiv);
    const speedDownButton = p.createButton('-');
    speedDownButton.parent(speedControlsDiv);
    speedDownButton.mousePressed(() => sketchInstance.changeSpeed(-1));

    speedDisplayElement = p.createSpan('1'); // Create and store the element
    speedDisplayElement.parent(speedControlsDiv);
    speedDisplayElement.id('dynamicSpeedDisplay'); // Assign an ID if needed for external access / styling

    const speedUpButton = p.createButton('+');
    speedUpButton.parent(speedControlsDiv);
    speedUpButton.mousePressed(() => sketchInstance.changeSpeed(1));
    
    // --- NN Turn Threshold ---
    const nnControlsDiv = p.createDiv();
    nnControlsDiv.parent(controlsContainer);
    nnControlsDiv.style('margin-bottom', '10px');

    const thresholdLabel = p.createElement('label', 'NN Turn Threshold: ');
    thresholdLabel.parent(nnControlsDiv);
    const nnTurnThresholdInput = p.createInput(CONFIG.NN_TURN_THRESHOLD.toString(), 'number');
    nnTurnThresholdInput.parent(nnControlsDiv);
    nnTurnThresholdInput.attribute('min', '0');
    nnTurnThresholdInput.attribute('max', '1');
    nnTurnThresholdInput.attribute('step', '0.01');
    nnTurnThresholdInput.style('width', '50px');
    nnTurnThresholdInput.input(() => {
        const val = parseFloat(nnTurnThresholdInput.value());
        if (!isNaN(val) && val >=0 && val <=1) {
            CONFIG.NN_TURN_THRESHOLD = val;
            console.log("NN Turn Threshold set to:", CONFIG.NN_TURN_THRESHOLD);
        }
    });

    // --- Feature Checkboxes ---
    const featuresTitle = p.createElement('h4', 'Neural Network Features:');
    featuresTitle.parent(controlsContainer);
    featuresTitle.style('margin-bottom', '5px');
    const featuresContainerDiv = p.createDiv(); // This is the container for individual checkbox divs
    featuresContainerDiv.parent(controlsContainer);
    featuresContainerDiv.id('dynamic-feature-checkboxes');

    featureCheckboxes = {}; // Reset for this setup
    CONFIG.ALL_AVAILABLE_FEATURES.forEach(feature => {
        const div = p.createDiv();
        div.parent(featuresContainerDiv);
        div.style('margin-bottom', '2px');
        
        const checkbox = p.createCheckbox(` ${feature.name}`, feature.defaultEnabled); // Added space for alignment
        checkbox.parent(div);
        featureCheckboxes[feature.id] = checkbox;
    });

    const applyFeaturesButton = p.createButton('Apply Feature Changes & Restart NN');
    applyFeaturesButton.parent(controlsContainer);
    applyFeaturesButton.style('margin-top', '10px');
    applyFeaturesButton.mousePressed(() => sketchInstance.resetSimulation(true));

    // Call updateSpeedDisplay initially with the created element
    // The initial speed is set by neural_ant.js before resetSimulation, which calls updateSpeedDisplay via changeSpeed or directly.
    // We need to ensure sketchInstance has speedDisplayElement to pass it.
    sketchInstance.speedDisplayElement = speedDisplayElement; // Make it available to sketchInstance
    // Initial call to display speed, assuming updatesPerFrame is set in neural_ant.js
    // This will be updated when sketchInstance.changeSpeed is called by resetSimulation if speed is set there.
    // Or, neural_ant.js can call sketchInstance.updateDisplay() after setting initial updatesPerFrame.
}

function getActiveFeatureConfigsFromUI() {
    const activeConfigs = [];
    if (Object.keys(featureCheckboxes).length === 0) {
        // console.warn("featureCheckboxes is empty. UI might not be set up yet.");
        // Attempt to use default if UI not ready or no features selected.
        // This path should ideally not be taken if resetSimulation is called after setupUI.
        return CONFIG.ALL_AVAILABLE_FEATURES.filter(f => f.defaultEnabled);
    }
    CONFIG.ALL_AVAILABLE_FEATURES.forEach(feature => {
        if (featureCheckboxes[feature.id] && featureCheckboxes[feature.id].checked()) {
            activeConfigs.push(feature);
        }
    });
    return activeConfigs;
}

// Modified to take the element directly
function updateSpeedDisplay(displayElement, p, currentSpeed) {
    if (displayElement) {
      displayElement.html(currentSpeed);
    }
}