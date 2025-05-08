window.asciiGifInteractiveSketch = (p) => {
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
    let font;
    let img;
    let gifFrames = [];
    let currentFrame = 0;
    let asciiCharacters = "+*-=██*"; // Set of characters used to create structure-based ASCII art.
    let maxFontSize = 16;

    let currentGifGroupIndex = 0;
    let currentGifVariantIndex = 0;

    p.preload = function () {
        font = p.loadFont('assets/fonts/Inconsolata.otf'); // Adjusted path
    };

    p.setup = function () {
        canvas = p.createCanvas(100, 100); // Create a default canvas, will resize later
        // canvas.parent("sketch-holder"); // Handled by main.js
        p.frameRate(20); // Control the speed of GIF playback.
        p.textSize(maxFontSize); // Use maximum font size value
        p.textAlign(p.LEFT, p.TOP);


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
        const path = 'assets/gifs/' + gifName + '_' + variantNumber + '.gif';

        // Clear previous gif frames and stop if loading a new one
        gifFrames = [];
        currentFrame = 0;
        if (img && img.pause) img.pause(); // If p5.Gif.js is used, it might have pause

        img = p.loadImage(path, () => {
            resetSketch(); // Call resetSketch on successful load
            document.getElementById("art_title").innerHTML = gifName + " " + variantNumber;
            document.getElementById("art_date").innerHTML = "10/16/2024"; // Example date
            document.getElementById("art-description").innerHTML = "Interactive ASCII art of " + gifName + " " + variantNumber + ". Click to change.";
        }, () => {
            console.error("Failed to load GIF: " + path + ". Skipping to next.");
            p.background(25, 150);
            p.fill(255,0,0);
            p.textAlign(p.CENTER, p.CENTER);
            p.text("Failed to load GIF: " + gifName + " " + variantNumber , p.width/2, p.height/2);
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

        if (img && img.width > 0 && img.height > 0) { // Check if img is loaded and valid
            loadGifFrames();
            if (gifFrames.length > 0) {
                let canvasWidth = gifFrames[0].width * maxFontSize;
                let canvasHeight = gifFrames[0].height * maxFontSize;
                p.resizeCanvas(canvasWidth, canvasHeight);
            }
        }
    }

    function loadGifFrames() {
        if (!img || !img.numFrames || img.numFrames() === 0) {
            console.error("loadGifFrames: Image is not a valid GIF or has no frames.");
            gifFrames = []; // Ensure it's empty
            return;
        }
        let numFrames = img.numFrames();
        gifFrames = []; // Clear existing frames
        for (let i = 0; i < numFrames; i++) {
            img.setFrame(i);
            let frameCopy = p.createImage(img.width, img.height);
            frameCopy.copy(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);
            frameCopy.resize(60, 0); // Resize each frame to 110 pixels wide
            frameCopy.loadPixels();
            gifFrames.push(frameCopy);
        }
    }

    p.draw = function () {
        if (!gifFrames || gifFrames.length === 0) {
            // p.background(25,150); // Optional: clear canvas or show loading
            // p.fill(255);
            // p.textAlign(p.CENTER, p.CENTER);
            // p.text("Loading frames or no GIF loaded...", p.width/2, p.height/2);
            return;
        }

        p.background(25, 150); 

        let imgFrame = gifFrames[currentFrame];
        // imgFrame.loadPixels(); // Pixels should be loaded in loadGifFrames

        let textSizeValue = maxFontSize;

        p.textSize(textSizeValue);
        p.textAlign(p.LEFT, p.TOP); // Reset from any CENTER alignments if errors occurred

        for (let j = 1; j < imgFrame.height - 1; j++) {
            for (let i = 1; i < imgFrame.width - 1; i++) {
                let pixelIndex = (i + j * imgFrame.width) * 4;
                let r = imgFrame.pixels[pixelIndex + 0];
                let g = imgFrame.pixels[pixelIndex + 1];
                let b = imgFrame.pixels[pixelIndex + 2];

                let gx = -1 * getBrightness(imgFrame, i - 1, j - 1) + 1 * getBrightness(imgFrame, i + 1, j - 1)
                         - 2 * getBrightness(imgFrame, i - 1, j) + 2 * getBrightness(imgFrame, i + 1, j)
                         - 1 * getBrightness(imgFrame, i - 1, j + 1) + 1 * getBrightness(imgFrame, i + 1, j + 1);

                let gy = -1 * getBrightness(imgFrame, i - 1, j - 1) - 2 * getBrightness(imgFrame, i, j - 1) - 1 * getBrightness(imgFrame, i + 1, j - 1)
                         + 1 * getBrightness(imgFrame, i - 1, j + 1) + 2 * getBrightness(imgFrame, i, j + 1) + 1 * getBrightness(imgFrame, i + 1, j + 1);

                let edgeValue = p.sqrt(gx * gx + gy * gy);

                let len = asciiCharacters.length;
                let charIndex = p.floor(p.map(edgeValue, 0, 255, len - 1, 0));
                charIndex = p.constrain(charIndex, 0, len -1); // Ensure charIndex is valid
                let asciiChar = asciiCharacters.charAt(charIndex);

                let xPos = i * textSizeValue;
                let yPos = j * textSizeValue;
                let distfromMouse = p.dist(p.mouseX, p.mouseY, xPos, yPos);

                if (distfromMouse < 100) {
                    p.colorMode(p.HSL);
                    p.fill(r % 360, 100, 60); // Ensure hue is within 0-360 for HSL
                    p.textSize(textSizeValue * 1.5);
                    p.text(p.random(["*", "+"]), xPos + p.cos(p.sin(distfromMouse) + p.frameCount) * 2, yPos + p.sin(p.cos(distfromMouse) * 10 + p.frameCount) * 2);
                } else {
                    p.colorMode(p.RGB); // Switch back to RGB for original pixel colors
                    p.fill(r, g, b);
                    p.textSize(textSizeValue * 1.5); // Matching the interactive part's size
                    p.text(asciiChar, xPos, yPos);
                }
            }
        }
        p.colorMode(p.RGB); // Ensure RGB mode at the end of draw if not set
        currentFrame = (currentFrame + 1) % gifFrames.length;
    };

    function getBrightness(imgArg, x, y) { // Renamed img to imgArg to avoid conflict if any
        // Ensure x and y are within bounds of imgArg
        x = p.constrain(x, 0, imgArg.width - 1);
        y = p.constrain(y, 0, imgArg.height - 1);
        
        let index = (x + y * imgArg.width) * 4;
        // Check if pixels array is valid and index is within bounds
        if (!imgArg.pixels || index + 2 >= imgArg.pixels.length) {
            // console.warn(`getBrightness: Invalid pixel access at (${x}, ${y})`);
            return 0; // Return a default brightness or handle error
        }
        let r = imgArg.pixels[index + 0];
        let g = imgArg.pixels[index + 1];
        let b = imgArg.pixels[index + 2];
        return (r + g + b) / 3;
    }
};
