// ===========================
//    Feature Extractor Class
// ===========================
class FeatureExtractor {
    constructor(config, activeFeatureConfigs) {
        this.config = config; // Full CONFIG object
        this.activeFeatureConfigs = activeFeatureConfigs; // Array of {id, name, extractor} for active features
        this.featureValues = {}; // To store calculated values for one step
    }

    // Call this if active features change to update the extractor's internal list
    setActiveFeatures(activeFeatureConfigs) {
        this.activeFeatureConfigs = activeFeatureConfigs;
    }

    // S_orig_current_cell is the state of the cell the ant is on *before* it's flipped
    extractFeatures(ant, grid, simulationStepCount, S_orig_current_cell) {
        this.featureValues = {}; // Reset for current step
        for (const featureConfig of this.activeFeatureConfigs) {
            try {
                this.featureValues[featureConfig.id] = featureConfig.extractor(
                    ant,
                    grid,
                    simulationStepCount,
                    this.config, // Pass full config for parameters like TIME_FEATURE_FREQUENCY
                    S_orig_current_cell
                );
            } catch (e) {
                console.error(`Error extracting feature '${featureConfig.id}':`, e);
                this.featureValues[featureConfig.id] = 0; // Default to 0 on error
            }
        }
    }

    getNNInputArray() {
        const nnInput = [];
        for (const featureConfig of this.activeFeatureConfigs) {
            const value = this.featureValues[featureConfig.id];
            if (typeof value === 'number' && isFinite(value)) {
                nnInput.push(value);
            } else {
                // console.warn(`Invalid value for feature '${featureConfig.id}': ${value}. Using 0.`);
                nnInput.push(0); // Default for non-numeric or non-finite values
            }
        }
        return nnInput;
    }

    getNumberOfActiveFeatures() {
        return this.activeFeatureConfigs.length;
    }
}