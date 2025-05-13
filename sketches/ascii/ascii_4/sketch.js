let font;
let grid = [];
let sc;
let density;
let _textSize;
const gapCharacter = " ";

const characterSets = [
    '+-',
    ["--","++"],
    '▒▓█',
    '⟡⟐',
    '⧄⧅⧆⧇⧈',
    '▣▤▥▦▧▨▩',
    ['  ▒','▓  '],
    ['⁂','⁜','※'],
    '⦓⦔',
];

const colors = [
    [[197, 100, 50],[377, 100, 50]],
    [[194, 93, 64],[374, 93, 64]],
    [[221, 86, 65],[417, 86, 65]],
    [[206, 85, 65],[357, 85, 65]],
    [[130, 80,65], [310, 80, 65]],
];

function getRandomColorPair(){
    return colors[Math.floor(Math.random() * colors.length)];
}

function getRandomCharacterSet(){
    return characterSets[Math.floor(Math.random() * characterSets.length)];
}

function getRandomString(characterSet){
    if (typeof characterSet == "string"){
        return characterSet.charAt(Math.floor(Math.random() * characterSet.length));
    } else {
        return characterSet[Math.floor(Math.random() * characterSet.length)];
    }
}

function createGrid(_densityParam){
    let characterSet = getRandomCharacterSet();
    let [main, accent] = getRandomColorPair();
    grid = [];
    for(let i = 0; i < _densityParam * _densityParam; i++){
        let string = getRandomString(characterSet);
        let currentColor = main;
        if(Math.random() > 0.8){
            currentColor = accent;
        }
        if(Math.random() > 0.8){
            characterSet = getRandomCharacterSet();
            let [newMain, newAccent] = getRandomColorPair();
            main = newMain;
            accent = newAccent;
        }
        let x = (i % _densityParam) * width / _densityParam;
        let y = Math.floor(i / _densityParam) * height / _densityParam;

        grid.push({x, y, string, currentColor, characterSet});
    }
}
    
function drawGrid(){
    for(let g of grid){
        fill(g.currentColor[0], g.currentColor[1], g.currentColor[2]);
        if (typeof _textSize !== 'undefined' && typeof density !== 'undefined' && density !== 0) {
             textSize(_textSize);
        }
        textAlign(CENTER, CENTER);
        if (typeof density !== 'undefined' && density !== 0) {
            text(g.string, g.x + width / density / 2, g.y + height / density / 2);
        }
    }
}

function setParameters(){
    sc = 1.4; 
    density = Math.floor(Math.random() * 13) + 3;
    if (density === 0) density = 3; 
    _textSize = width / (density * 2) * sc;
}


function setup() {
    createCanvas(windowWidth, windowHeight);
    pixelDensity(1);
    colorMode(HSL);
    
    textFont('monospace');

    setParameters();
    createGrid(density); 

    drawingContext.shadowOffsetX = 5;
    drawingContext.shadowOffsetY = 5;
    drawingContext.shadowBlur = 0;
    drawingContext.shadowColor = 'black';

    let generateButton = select("#generate");
    if (generateButton) {
        generateButton.mousePressed(generate);
    }
}

function generate(){
    grid = [];
    setParameters();
    createGrid(density); 
    console.log(grid);
}

function draw() {
    background(255);
    drawGrid();
}

function mousePressed() {
    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
        generate();
    }
}
