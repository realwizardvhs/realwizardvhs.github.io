// ====================== Configuration ====================== //

// Change these variables to switch between image and GIF
const sourcePath = 'horse.gif'; // Path to your static image or GIF frames
const isGif = false; // Set to true if sourcePath refers to GIF frames
const gifFrameCount = 10; // Number of frames in your GIF (if isGif is true)

// ASCII characters from dark to light
const asciiChars = "@%#*+=-:. ";

// Font size for ASCII art
const fontSize = 8;

// Edge detection threshold
const edgeThreshold = 100;

// Frame interval for GIF animation (in milliseconds)
const frameInterval = 100;

// ============================================================== //

// Global Variables
let img; // Single image
let gifFrames = []; // Array to hold GIF frames
let currentFrame = 0; // Current frame index for GIF
let lastFrameTime = 0; // Timestamp of the last frame change

// Number of columns and rows based on window size and font size
let cols, rows;

// Preload function to load images
function preload() {
  if (isGif) {
    let gif = loadImage(sourcePath);
    let numFrames = gif.numFrames();
    for (let i = 0; i < numFrames; i++) {
        gif.setFrame(i);
        gifFrames.push(gif.get());
    }
}

function setup() {
  // Calculate number of columns and rows based on window size and font size
  cols = floor(windowWidth / fontSize);
  rows = floor(windowHeight / fontSize);

  createCanvas(cols * fontSize, rows * fontSize);
  background(0);
  fill(255);
  textFont('Courier'); // Use a monospaced font
  textSize(fontSize);
  textAlign(LEFT, TOP);

  if (!isGif && img) {
    processImage(img, cols, rows);
    noLoop(); // No need to loop for static images
  }
}

function draw() {
  if (isGif && gifFrames.length > 0) {
    let currentTime = millis();
    if (currentTime - lastFrameTime > frameInterval) {
      lastFrameTime = currentTime;
      // Process and display the current frame
      processFrame(gifFrames[currentFrame], cols, rows);
      // Move to the next frame
      currentFrame = (currentFrame + 1) % gifFrameCount;
    }
  }
}

// Function to process and display a single image
function processImage(image, cols, rows) {
  image.resize(cols, rows); // Resize image to fit the canvas
  image.filter(GRAY); // Convert to grayscale
  image.loadPixels();

  const edgeImg = detectEdges(image, image.width, image.height);
  const asciiImage = mapToASCII(edgeImg, image.width, image.height);

  displayASCII(asciiImage);
}

// Function to process and display a GIF frame
function processFrame(image, cols, rows) {
  image.resize(cols, rows); // Resize image to fit the canvas
  image.filter(GRAY); // Convert to grayscale
  image.loadPixels();

  const edgeImg = detectEdges(image, image.width, image.height);
  const asciiImage = mapToASCII(edgeImg, image.width, image.height);

  displayASCII(asciiImage);
}

// Function to detect edges using Sobel operator
function detectEdges(sourceImg, w, h) {
  const edgeImg = createImage(w, h);
  sourceImg.loadPixels();
  edgeImg.loadPixels();

  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      // Sobel kernels
      const gx =
        -1 * getGray(sourceImg, x - 1, y - 1) +
         1 * getGray(sourceImg, x + 1, y - 1) +
        -2 * getGray(sourceImg, x - 1, y) +
         2 * getGray(sourceImg, x + 1, y) +
        -1 * getGray(sourceImg, x - 1, y + 1) +
         1 * getGray(sourceImg, x + 1, y + 1);

      const gy =
        -1 * getGray(sourceImg, x - 1, y - 1) +
        -2 * getGray(sourceImg, x, y - 1) +
        -1 * getGray(sourceImg, x + 1, y - 1) +
         1 * getGray(sourceImg, x - 1, y + 1) +
         2 * getGray(sourceImg, x, y + 1) +
         1 * getGray(sourceImg, x + 1, y + 1);

      let magnitude = sqrt(gx * gx + gy * gy);
      magnitude = magnitude > edgeThreshold ? 255 : 0; // Binarize edges

      edgeImg.set(x, y, color(magnitude));
    }
  }

  edgeImg.updatePixels();
  return edgeImg;
}

// Function to map edge-detected image to ASCII characters
function mapToASCII(edgeImg, w, h) {
  edgeImg.loadPixels();
  let asciiImage = "";
  const step = 1; // You can adjust this for scaling

  for (let y = 0; y < h; y += step) {
    let row = "";
    for (let x = 0; x < w; x += step) {
      const index = (x + y * w) * 4;
      const brightness = edgeImg.pixels[index]; // Since the image is grayscale
      row += brightness === 255 ? asciiChars.charAt(0) : ' ';
    }
    asciiImage += row + "\n";
  }

  return asciiImage;
}

// Function to display ASCII art on the canvas
function displayASCII(asciiStr) {
  background(0);
  fill(255);
  noStroke();
  text(asciiStr, 0, 0);
}

// Helper function to get grayscale value from an image
function getGray(sourceImg, x, y) {
  const index = (x + y * sourceImg.width) * 4;
  return sourceImg.pixels[index]; // Since the image is already in grayscale
}

// Handle window resizing
function windowResized() {
  cols = floor(windowWidth / fontSize);
  rows = floor(windowHeight / fontSize);
  resizeCanvas(cols * fontSize, rows * fontSize);
  background(0);
  fill(255);
  textFont('Courier');
  textSize(fontSize);
  textAlign(LEFT, TOP);

  if (isGif && gifFrames.length > 0) {
    // No need to reprocess frames; they will be handled in draw()
  } else if (!isGif && img) {
    processImage(img, cols, rows);
  }
}
