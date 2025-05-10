// FILE: neural_network.js
// ===========================
//   Neural Network Class
// ===========================
// Supports randomized activation per hidden neuron.

class NeuralNetwork {
    constructor(inputNodes, numHiddenLayers, hiddenNodesPerLayer, outputNodes,
                outputActivationType = 'sigmoid',
                hiddenActivationCandidates = ['relu', 'tanh'])
    {
        // --- Validation ---
        if (!Number.isInteger(numHiddenLayers) || numHiddenLayers < 0 || !Number.isInteger(inputNodes) || inputNodes <= 0 || (numHiddenLayers > 0 && (!Number.isInteger(hiddenNodesPerLayer) || hiddenNodesPerLayer <= 0)) || !Number.isInteger(outputNodes) || outputNodes <= 0) {
            throw new Error(`Invalid NN dimensions: inputs=${inputNodes}, hiddenLayers=${numHiddenLayers}, hiddenNodes=${hiddenNodesPerLayer}, outputs=${outputNodes}`);
        }
        if (hiddenActivationCandidates.length === 0 && numHiddenLayers > 0) {
             throw new Error("Must provide hidden activation candidates.");
        }
        if (numHiddenLayers === 0 && hiddenNodesPerLayer > 0) { // If no hidden layers, no hidden nodes
            hiddenNodesPerLayer = 0;
        }
        if (numHiddenLayers > 0 && hiddenNodesPerLayer === 0) { // If hidden layers exist, must have nodes
             throw new Error("Hidden layers specified but hiddenNodesPerLayer is 0.");
        }

        this.inputNodes = inputNodes;
        this.hiddenNodes = hiddenNodesPerLayer;
        this.outputNodes = outputNodes;
        this.numHiddenLayers = numHiddenLayers;

        // --- Activation Setup ---
        this.activationFunctionMap = {
            'sigmoid': this._sigmoid, 'tanh': this._tanh,
            'relu': this._relu, 'leaky_relu': this._leakyRelu,
        };
        this.hiddenActivationChoices = []; // Stores activation function names for each neuron in each hidden layer
        this.outputActivationFunction = this.activationFunctionMap[outputActivationType.toLowerCase()];
        if (!this.outputActivationFunction) {
            console.warn(`Unknown output activation '${outputActivationType}'. Defaulting sigmoid.`);
            this.outputActivationFunction = this._sigmoid;
        }

        // --- Weights & Biases Init ---
        this.weights = []; this.biases = [];
        let currentLayerInputSize = this.inputNodes;
        try {
            if (this.numHiddenLayers > 0) {
                this._addLayer(this.hiddenNodes, currentLayerInputSize); // First hidden layer
                this._assignRandomHiddenActivations(0, hiddenActivationCandidates);
                currentLayerInputSize = this.hiddenNodes;

                for (let i = 1; i < this.numHiddenLayers; i++) { // Subsequent hidden layers
                    this._addLayer(this.hiddenNodes, this.hiddenNodes);
                    this._assignRandomHiddenActivations(i, hiddenActivationCandidates);
                    currentLayerInputSize = this.hiddenNodes; // Redundant if hiddenNodes is const, but good practice
                }
            }
            this._addLayer(this.outputNodes, currentLayerInputSize); // Add output layer
        } catch (error) { console.error("Error during NN weight/bias creation:", error); throw error; }

        // --- Validation ---
        const expectedMatrices = this.numHiddenLayers + (this.outputNodes > 0 ? 1 : 0);
        if (this.weights.length !== expectedMatrices || this.biases.length !== expectedMatrices) { throw new Error(`NN Init Error: Matrix count mismatch. Expected ${expectedMatrices}, Got Weights: ${this.weights.length}, Biases: ${this.biases.length}`); }
        if (this.hiddenActivationChoices.length !== this.numHiddenLayers) { throw new Error(`NN Init Error: Activation choices mismatch. Expected ${this.numHiddenLayers}, Got ${this.hiddenActivationChoices.length}`); }
    }

    // --- Internal Helpers ---
    _addLayer(numNodes, inputSize) {
        if (numNodes <=0) { return; } // Should not happen with constructor validation
        let weights_m = this._createMatrix(numNodes, inputSize);
        let bias_m = this._createMatrix(numNodes, 1);
        this._randomizeMatrix(weights_m);
        this._randomizeMatrix(bias_m);
        this.weights.push(weights_m);
        this.biases.push(bias_m);
    }
    _assignRandomHiddenActivations(layerIndex, candidates) {
        // This assumes all hidden layers have 'this.hiddenNodes' neurons.
        const numNeurons = this.hiddenNodes; // This should be this.weights[layerIndex].length
        const layerActivations = new Array(numNeurons);
        for (let i = 0; i < numNeurons; i++) {
            const randomIndex = Math.floor(Math.random() * candidates.length);
            layerActivations[i] = candidates[randomIndex].toLowerCase();
        }
        this.hiddenActivationChoices[layerIndex] = layerActivations;
    }

    // --- Activation Functions (made internal) ---
    _sigmoid(x) { return 1 / (1 + Math.exp(-clamp(x, -700, 700))); } // clamp from global scope
    _tanh(x) { return Math.tanh(clamp(x, -350, 350)); } // clamp from global scope
    _relu(x) { return Math.max(0, x); }
    _leakyRelu(x) { return x > 0 ? x : 0.01 * x; }

    // --- Matrix Utilities (made internal) ---
    _createMatrix(rows, cols) { if (!Number.isInteger(rows) || rows < 0 || !Number.isInteger(cols) || cols < 0) { throw new Error(`Invalid dimensions: ${rows}x${cols}`); } const m = []; for (let i = 0; i < rows; i++) { m[i] = new Array(cols).fill(0); } return m; }
    _randomizeMatrix(matrix) { if (!this._isValidMatrix(matrix)) { throw new Error("Invalid matrix for randomization"); } for (let i = 0; i < matrix.length; i++) { for (let j = 0; j < matrix[0].length; j++) { matrix[i][j] = Math.random() * 2 - 1; } } }
    _matrixFromArray(arr) { if (!Array.isArray(arr)) { throw new Error("Input not array for matrixFromArray"); } const m = this._createMatrix(arr.length, 1); for (let i = 0; i < arr.length; i++) { m[i][0] = this._getNumericOrDefault(arr[i]); } return m; }
    _matrixToArray(matrix) { if (!this._isValidMatrix(matrix)) { throw new Error("Invalid matrix for matrixToArray"); } if (matrix.length === 0 || matrix[0]?.length === 0) { return []; } const a = []; for (let i = 0; i < matrix.length; i++) { for (let j = 0; j < matrix[0].length; j++) { a.push(this._getNumericOrDefault(matrix[i]?.[j])); } } return a; }
    _matrixMultiply(a, b) { if (!this._isValidMatrix(a) || !this._isValidMatrix(b)) { throw new Error(`Invalid mult matrices`); } const rA = a.length, cA = a[0]?.length ?? 0, rB = b.length, cB = b[0]?.length ?? 0; if (cA !== rB) { throw new Error(`Dimension mismatch mult: A[${rA}x${cA}], B[${rB}x${cB}]`); } if (rA === 0 || cA === 0 || rB === 0 || cB === 0) { return this._createMatrix(rA, cB); } const res = this._createMatrix(rA, cB); for (let i = 0; i < rA; i++) { for (let j = 0; j < cB; j++) { let s = 0; for (let k = 0; k < cA; k++) { s += this._getNumericOrDefault(a[i]?.[k]) * this._getNumericOrDefault(b[k]?.[j]); } res[i][j] = s; } } return res; }
    _matrixAdd(a, b) { if (!this._isValidMatrix(a) || !this._isValidMatrix(b)) { throw new Error(`Invalid add matrices`); } const rA = a.length, cA = a[0]?.length ?? 0, rB = b.length, cB = b[0]?.length ?? 0; if (rA !== rB || cA !== cB) { throw new Error(`Dimension mismatch add: A[${rA}x${cA}], B[${rB}x${cB}]`); } if (rA === 0 || cA === 0) { return this._createMatrix(rA, cA); } const res = this._createMatrix(rA, cA); for (let i = 0; i < rA; i++) { for (let j = 0; j < cA; j++) { res[i][j] = this._getNumericOrDefault(a[i]?.[j]) + this._getNumericOrDefault(b[i]?.[j]); } } return res; }
    _matrixMap(matrix, func) { if (!this._isValidMatrix(matrix)) { throw new Error("Invalid map matrix"); } if (typeof func !== 'function') { throw new Error("Invalid map function"); } const r = matrix.length, c = matrix[0]?.length ?? 0; if (r === 0 || c === 0) { return this._createMatrix(r, c); } const res = this._createMatrix(r, c); for (let i = 0; i < r; i++) { for (let j = 0; j < c; j++) { let mapV; try { mapV = func(this._getNumericOrDefault(matrix[i]?.[j])); } catch (e) { console.error("Error in matrixMap apply function:", e); mapV = 0; } res[i][j] = this._getNumericOrDefault(mapV); } } return res; }
    _isValidMatrix(matrix) { if (!Array.isArray(matrix)) return false; if (matrix.length > 0) { if (!Array.isArray(matrix[0])) return false; const len = matrix[0].length; for (let i = 1; i < matrix.length; i++) { if (!Array.isArray(matrix[i]) || matrix[i].length !== len) return false; } } return true; }
    _getNumericOrDefault(value, defaultValue = 0) { if (typeof value === 'number' && isFinite(value)) { return value; } return defaultValue; }

    // --- Feedforward ---
    feedforward(inputArray) {
        if (!Array.isArray(inputArray)) { throw new Error("Input not array for feedforward"); }
        if (inputArray.length !== this.inputNodes) { throw new Error(`Input size mismatch in feedforward: Expected ${this.inputNodes}, Got ${inputArray.length}`); }

        let currentActivationMatrix = this._matrixFromArray(inputArray);
        const numWeightLayers = this.weights.length; // This is numHiddenLayers + 1 (for output layer)

        for (let i = 0; i < numWeightLayers; i++) {
            const layerWeights = this.weights[i]; const layerBias = this.biases[i];
            if (!layerWeights || !layerBias) throw new Error(`Missing weights/bias for layer ${i}`);

            let nextActivationMatrix;
            try {
                let weightedSum = this._matrixMultiply(layerWeights, currentActivationMatrix);
                let biasedSum = this._matrixAdd(weightedSum, layerBias);

                if (i < this.numHiddenLayers) { // Hidden Layer
                    const numNeuronsInLayer = biasedSum.length; // Should be this.hiddenNodes (or this.weights[i].length)
                    const layerActivationChoices = this.hiddenActivationChoices[i];
                    nextActivationMatrix = this._createMatrix(numNeuronsInLayer, 1);
                    
                    if(!layerActivationChoices || layerActivationChoices.length !== numNeuronsInLayer){ 
                        throw new Error(`Activation choice mismatch for hidden layer ${i}. Expected ${numNeuronsInLayer} choices, got ${layerActivationChoices?.length}`); 
                    }

                    for (let n = 0; n < numNeuronsInLayer; n++) {
                        const activationName = layerActivationChoices[n];
                        const activationFunc = this.activationFunctionMap[activationName] || this._sigmoid; // Default to sigmoid if name is wrong
                        let value = biasedSum[n][0]; let activatedValue;
                        try { activatedValue = activationFunc(value); } catch(e) { console.error(`Error applying activation ${activationName} in layer ${i}, neuron ${n}:`, e); activatedValue = 0;}
                        nextActivationMatrix[n][0] = this._getNumericOrDefault(activatedValue);
                    }
                } else { // Output Layer
                     if (!this.outputActivationFunction) throw new Error("Output activation function missing for output layer");
                    nextActivationMatrix = this._matrixMap(biasedSum, this.outputActivationFunction);
                }
            } catch (e) { 
                console.error(`Error processing layer ${i}:`, e);
                // Fallback: create a zero matrix of expected size to prevent total crash
                const expectedRows = (i < this.numHiddenLayers) ? this.hiddenNodes : this.outputNodes;
                currentActivationMatrix = this._createMatrix(expectedRows, 1);
                // Potentially re-throw or handle more gracefully
                throw new Error(`Feedforward failed at layer ${i}. Original error: ${e.message}`);
            }
            currentActivationMatrix = nextActivationMatrix;
        }

        let outputArray = this._matrixToArray(currentActivationMatrix);
        if (outputArray.length !== this.outputNodes) { throw new Error(`Final output size mismatch: Expected ${this.outputNodes}, Got ${outputArray.length}`); }
        
        // Ensure all outputs are numeric and finite
        for (let i = 0; i < outputArray.length; ++i) { 
            outputArray[i] = this._getNumericOrDefault(outputArray[i]); 
        }
        return outputArray;
    }
}