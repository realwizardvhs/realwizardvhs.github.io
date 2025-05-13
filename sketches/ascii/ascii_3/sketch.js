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
let asciiCharacters = "+*-=██*";
let maxFontSize = 16;
let currentGifGroupIndex = 0;
let currentGifVariantIndex = 0;

function preload() {
    font = loadFont('/assets/fonts/Inconsolata.otf');
}

function setup() {
    canvas = createCanvas(100, 100);
    frameRate(20);
    textSize(maxFontSize);
    textAlign(LEFT, TOP);

    let initialGroup = "train";
    let initialVariantNum = 2;
    let foundInitial = false;
    for (let i = 0; i < gifs.length; i++) {
        if (gifs[i][0] === initialGroup && gifs[i][1] >= initialVariantNum) {
            currentGifGroupIndex = i;
            currentGifVariantIndex = initialVariantNum - 1;
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
}

function loadCurrentGifByIndex() {
    const group = gifs[currentGifGroupIndex];
    const gifName = group[0];
    const variantNumber = currentGifVariantIndex + 1;
    const path = '/assets/gifs/' + gifName + '_' + variantNumber + '.gif';

    gifFrames = [];
    currentFrame = 0;
    if (img && img.pause) img.pause();

    img = loadImage(path, () => {
        resetSketch();
        document.getElementById("art_title").innerHTML = gifName + " " + variantNumber;
        document.getElementById("art_date").innerHTML = "10/16/2024";
        document.getElementById("art-description").innerHTML = "Interactive ASCII art of " + gifName + " " + variantNumber + ". Click to change.";
    }, () => {
        console.error("Failed to load GIF: " + path + ". Skipping to next.");
        background(25, 150);
        fill(255,0,0);
        textAlign(CENTER, CENTER);
        text("Failed to load GIF: " + gifName + " " + variantNumber , width/2, height/2);
        advanceGifAndLoad(true);
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

function mousePressed() {
    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
        advanceGifAndLoad(false);
    }
}

function resetSketch() {
    gifFrames = [];
    currentFrame = 0;

    if (img && img.width > 0 && img.height > 0) {
        loadGifFrames();
        if (gifFrames.length > 0) {
            let canvasWidth = gifFrames[0].width * maxFontSize;
            let canvasHeight = gifFrames[0].height * maxFontSize;
            resizeCanvas(canvasWidth, canvasHeight);
        }
    }
}

function loadGifFrames() {
    if (!img || !img.numFrames || img.numFrames() === 0) {
        console.error("loadGifFrames: Image is not a valid GIF or has no frames.");
        gifFrames = [];
        return;
    }
    let numFrames = img.numFrames();
    gifFrames = [];
    for (let i = 0; i < numFrames; i++) {
        img.setFrame(i);
        let frameCopy = createImage(img.width, img.height);
        frameCopy.copy(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);
        frameCopy.resize(60, 0);
        frameCopy.loadPixels();
        gifFrames.push(frameCopy);
    }
}

function draw() {
    if (!gifFrames || gifFrames.length === 0) {
        return;
    }

    background(25, 150);

    let imgFrame = gifFrames[currentFrame];

    let textSizeValue = maxFontSize;

    textSize(textSizeValue);
    textAlign(LEFT, TOP);

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

            let edgeValue = sqrt(gx * gx + gy * gy);

            let len = asciiCharacters.length;
            let charIndex = floor(map(edgeValue, 0, 255, len - 1, 0));
            charIndex = constrain(charIndex, 0, len -1);
            let asciiChar = asciiCharacters.charAt(charIndex);

            let xPos = i * textSizeValue;
            let yPos = j * textSizeValue;
            let distfromMouse = dist(mouseX, mouseY, xPos, yPos);

            if (distfromMouse < 100) {
                colorMode(HSL);
                fill(r % 360, 100, 60);
                textSize(textSizeValue * 1.5);
                text(random(["*", "+"]), xPos + cos(sin(distfromMouse) + frameCount) * 2, yPos + sin(cos(distfromMouse) * 10 + frameCount) * 2);
            } else {
                colorMode(RGB);
                fill(r, g, b);
                textSize(textSizeValue * 1.5);
                text(asciiChar, xPos, yPos);
            }
        }
    }
    colorMode(RGB);
    currentFrame = (currentFrame + 1) % gifFrames.length;
}

function getBrightness(imgArg, x, y) {
    x = constrain(x, 0, imgArg.width - 1);
    y = constrain(y, 0, imgArg.height - 1);
    
    let index = (x + y * imgArg.width) * 4;
    if (!imgArg.pixels || index + 2 >= imgArg.pixels.length) {
        return 0;
    }
    let r = imgArg.pixels[index + 0];
    let g = imgArg.pixels[index + 1];
    let b = imgArg.pixels[index + 2];
    return (r + g + b) / 3;
}
