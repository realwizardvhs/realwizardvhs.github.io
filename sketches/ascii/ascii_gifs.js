window.asciiGifsSketch = (p) => {
    let gifs = [
        ["anime", 4],
        ["bike", 2],
        ["car", 1],
        ["cat", 2],
        ["cyberpunk", 5],
        ["effect", 5],
        ["falling", 3],
        ["guitar", 1],
        ["gun_spin", 1],
        ["horse", 1],
        ["optical_illusion", 1],
        ["piano", 1],
        ["retro", 9],
        ["spinning_record", 1],
        ["train", 2],
        ["wizard", 1],
    ];
    let canvas;
    let img;
    let gifFrames = [];
    let currentFrame = 0;
    let asciiCharacters = "+*-=██*"; // Set of characters used to create structure-based ASCII art.
    let maxFontSize = 8;

    let currentGifGroupIndex = 0; 
    let currentGifVariantIndex = 0;

    p.setup = function () {
        canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        p.frameRate(20); // Control the speed of GIF playback.
        p.textSize(maxFontSize); // Use maximum font size value
        p.textAlign(p.LEFT, p.TOP);

        console.log(gifs);

        // Initialize to "train_2.gif" or fallback to the first GIF
        let initialGroup = "train";
        let initialVariantNum = 2; // 1-based number
        let foundInitial = false;
        for (let i = 0; i < gifs.length; i++) {
            if (gifs[i][0] === initialGroup && gifs[i][1] >= initialVariantNum) {
                currentGifGroupIndex = i;
                currentGifVariantIndex = initialVariantNum - 1; // 0-based index
                foundInitial = true;
                break;
            }
        }
        if (!foundInitial) {
            console.warn(`Initial GIF ${initialGroup}_${initialVariantNum}.gif not found or invalid, defaulting to first GIF.`);
            currentGifGroupIndex = 0;
            currentGifVariantIndex = 0;
        }

        loadCurrentGifByIndex(); 
    };

    function loadCurrentGifByIndex() {
        const group = gifs[currentGifGroupIndex];
        const gifName = group[0];
        const variantNumber = currentGifVariantIndex + 1; // 1-based for filename and display
        const path = './assets/gifs/' + gifName + '_' + variantNumber + '.gif';

        img = p.loadImage(path, () => { // Success callback
            resetSketch(); // Uses the new img
            const artTitleElement = document.getElementById("art_title");
            if (artTitleElement) {
                artTitleElement.innerHTML = gifName + " " + variantNumber;
            }
        }, () => { // Error callback
            console.error("Failed to load GIF: " + path + ". Skipping to next.");
            advanceGifAndLoad(true); // true indicates it's an error skip
        });
    }

    function advanceGifAndLoad(isErrorSkip) {
        currentGifVariantIndex++;
        let group = gifs[currentGifGroupIndex];
        let groupCount = group[1];

        if (currentGifVariantIndex >= groupCount) {
            currentGifVariantIndex = 0;
            currentGifGroupIndex++;
            if (currentGifGroupIndex >= gifs.length) {
                currentGifGroupIndex = 0;
                // If it was an error skip and we fully wrapped around, 
                // we might be in a loop if all GIFs are bad or directories are wrong.
                // For now, this simple loop is fine.
            }
        }
        loadCurrentGifByIndex();
    }

    p.mousePressed = function () {
        // Ensure click is within canvas
        if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
            advanceGifAndLoad(false);
        }
    };

    function resetSketch() {
        gifFrames = [];
        currentFrame = 0; // Reset current frame

        // Make sure image is loaded before extracting frames
        if (img) {
            loadGifFrames();
            // Resize canvas only if frames are loaded successfully
            if (gifFrames.length > 0) {
                let canvasWidth = gifFrames[0].width * maxFontSize;
                let canvasHeight = gifFrames[0].height * maxFontSize;
                p.resizeCanvas(canvasWidth, canvasHeight);
            }
        }
    }

    function loadGifFrames() {
        // Resize and store each frame of the GIF in an array
        let numFrames = img.numFrames();
        gifFrames = [];
        for (let i = 0; i < numFrames; i++) {
            img.setFrame(i);
            let frameCopy = p.createImage(img.width, img.height);
            frameCopy.copy(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);
            frameCopy.resize(110, 0); // Resize each frame to 100 pixels wide
            frameCopy.loadPixels();
            gifFrames.push(frameCopy);
        }
    }

    p.draw = function () {
        if (gifFrames.length === 0) {
            // Return if frames are not yet loaded
            return;
        }

        p.background(25, 150); // Set a white background with some transparency

        let imgFrame = gifFrames[currentFrame];
        imgFrame.loadPixels();
        let textSizeValue = maxFontSize;

        p.textSize(textSizeValue);
        p.textAlign(p.LEFT, p.TOP);

        for (let j = 1; j < imgFrame.height - 1; j++) {
            for (let i = 1; i < imgFrame.width - 1; i++) {
                let pixelIndex = (i + j * imgFrame.width) * 4;
                let r = imgFrame.pixels[pixelIndex + 0];
                let g = imgFrame.pixels[pixelIndex + 1];
                let b = imgFrame.pixels[pixelIndex + 2];

                // Calculate edge detection using Sobel operator
                let gx = -1 * getBrightness(imgFrame, i - 1, j - 1) + 1 * getBrightness(imgFrame, i + 1, j - 1)
                    - 2 * getBrightness(imgFrame, i - 1, j) + 2 * getBrightness(imgFrame, i + 1, j)
                    - 1 * getBrightness(imgFrame, i - 1, j + 1) + 1 * getBrightness(imgFrame, i + 1, j + 1);

                let gy = -1 * getBrightness(imgFrame, i - 1, j - 1) - 2 * getBrightness(imgFrame, i, j - 1) - 1 * getBrightness(imgFrame, i + 1, j - 1)
                    + 1 * getBrightness(imgFrame, i - 1, j + 1) + 2 * getBrightness(imgFrame, i, j + 1) + 1 * getBrightness(imgFrame, i + 1, j + 1);

                let edgeValue = p.sqrt(gx * gx + gy * gy);

                let len = asciiCharacters.length;
                let charIndex = p.floor(p.map(edgeValue, 0, 255, len - 1, 0)); // Map edge value to ASCII density.
                let asciiChar = asciiCharacters.charAt(charIndex);

                p.fill(r, g, b);
                p.textSize(textSizeValue * 1.5);
                p.text(asciiChar, i * textSizeValue, j * textSizeValue); // Draw each character individually to map to a grid.
            }
        }

        currentFrame = (currentFrame + 1) % gifFrames.length; // Loop through frames
    };

    // Helper function to get the brightness of a pixel at (x, y)
    function getBrightness(img, x, y) {
        let index = (x + y * img.width) * 4;
        let r = img.pixels[index + 0];
        let g = img.pixels[index + 1];
        let b = img.pixels[index + 2];
        return (r + g + b) / 3;
    }
};
