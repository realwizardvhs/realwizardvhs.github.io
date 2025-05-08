window.asciiPatternsSketch = (p) => {
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

    function createGrid(_density){ // Renamed parameter to avoid conflict with global-like 'density'
        let characterSet = getRandomCharacterSet();
        let [main, accent] = getRandomColorPair();
        grid = []; // Clear grid before creating
        for(let i = 0; i < _density * _density; i++){
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
            let x = (i % _density) * p.width / _density;
            let y = Math.floor(i / _density) * p.height / _density;

            grid.push({x, y, string, currentColor, characterSet});
        }
    }
        
    function drawGrid(){
        for(let g of grid){
            p.fill(g.currentColor[0], g.currentColor[1], g.currentColor[2]);
            // Ensure _textSize and density are not undefined before use
            if (typeof _textSize !== 'undefined' && typeof density !== 'undefined' && density !== 0) {
                 p.textSize(_textSize);
            }
            p.textAlign(p.CENTER, p.CENTER);
            if (typeof density !== 'undefined' && density !== 0) {
                p.text(g.string, g.x + p.width / density / 2, g.y + p.height / density / 2);
            }
        }
    }

    function setParameters(){
        sc = 1.4; // Adjusted for better text fit, aiming for ~70% of cell width
        density = Math.floor(Math.random() * 13) + 3;
        if (density === 0) density = 3; // Prevent division by zero
        _textSize = p.width / (density * 2) * sc;
    }


    p.setup = function() {
        p.createCanvas(p.windowWidth, p.windowHeight); // Dimensions will be resized by main.js
        p.pixelDensity(1);
        p.colorMode(p.HSL);
        
        p.textFont('monospace');


        setParameters();
        createGrid(density); // Use the 'density' set by setParameters

        p.drawingContext.shadowOffsetX = 5;
        p.drawingContext.shadowOffsetY = 5;
        p.drawingContext.shadowBlur = 0;
        p.drawingContext.shadowColor = 'black';

        // The button is expected to be in the main HTML.
        // If you want the sketch to create its own button, that logic would go here.
        let generateButton = p.select("#generate");
        if (generateButton) {
            generateButton.mousePressed(generate);
        }
    };

    function generate(){
        grid = [];
        setParameters();
        createGrid(density); // Use the 'density' set by setParameters
        console.log(grid)
    }

    p.draw = function() {
        p.background(255);

        drawGrid();
    };

    p.mousePressed = function() {
        // Check if the mouse press is within the canvas bounds
        if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
            generate();
        }
    };
};
