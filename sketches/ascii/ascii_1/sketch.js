let custom_font;
let canvasTextSize = 8;
let characters_by_brightness = `.- \\':_,^=;><+!rc*/z?sLTv)J7(|Fi{C}fI31tlu[neoZ5Yxjya]2ESwqkP6h9d4VpOGbUAKXHm8RD#$Bg0MNWQ%&@`;

let canvas_width;
let canvas_height;
let grid_rows;
let grid_columns;

let gif_path = '/assets/gifs/car_1.gif';
let gif;
let gif_frames = [];
let fps = 8;
let gif_frame_number = 0;

function preload() {
    custom_font = loadFont('/assets/fonts/square.ttf');
    gif = loadImage(gif_path);
}

function load_gif_frames() {
    if (!gif || gif.width === 0 || gif.height === 0) {
        console.error("GIF not loaded properly or has no dimensions.");
        return;
    }
    for (let i = 0; i < gif.numFrames(); i++) {
        gif.setFrame(i);
        let frameCopy = createImage(gif.width, gif.height);
        frameCopy.copy(gif, 0, 0, gif.width, gif.height, 0, 0, gif.width, gif.height);
        frameCopy.loadPixels();
        gif_frames.push(frameCopy);
    }
    if (gif_frames.length === 0 && gif.numFrames() > 0) {
        console.warn("GIF frames might not have been loaded correctly. gif_frames array is empty.");
    } else if (gif_frames.length > 0) {
        // console.log("GIF frames loaded:", gif_frames.length);
    }
}

function getBrightness(r, g, b) {
    return (r + g + b) / 3;
}

function getBrightnessCharacter(brightness) {
    let index = map(brightness, 0, 255, 0, characters_by_brightness.length - 1);
    index = Math.floor(constrain(index, 0, characters_by_brightness.length - 1));
    return characters_by_brightness.charAt(index);
}

function setup() {
    if (!gif || gif.width === 0 || gif.height === 0) {
        console.error("p.setup: GIF not loaded properly. Aborting setup.");
        createCanvas(windowWidth, windowHeight);
        background(0);
        fill(255);
        textAlign(CENTER, CENTER);
        text("Error: GIF not loaded.", width/2, height/2);
        return;
    }
    
    gif.resize(800, 0);

    canvas_width = gif.width;
    canvas_height = gif.height;
    
    load_gif_frames();

    if (gif_frames.length === 0) {
        console.error("p.setup: No GIF frames loaded. Aborting further setup.");
        createCanvas(canvas_width || 400, canvas_height || 400);
        background(0);
        fill(255);
        textAlign(CENTER, CENTER);
        text("Error: No GIF frames.", width/2, height/2);
        return;
    }

    grid_columns = Math.floor(canvas_width / canvasTextSize);
    grid_rows = Math.floor(canvas_height / canvasTextSize);
    
    let display_canvas_width = grid_columns * canvasTextSize;
    let display_canvas_height = grid_rows * canvasTextSize;

    createCanvas(display_canvas_width, display_canvas_height);

    pixelDensity(1);
    textFont(custom_font);
}

function draw_character_rectangle(x_col, y_row, character, r, g, b) {
    let x_pos = x_col * canvasTextSize;
    let y_pos = y_row * canvasTextSize;

    fill(r, g, b);
    textSize(canvasTextSize);
    textAlign(LEFT, TOP);
    text(character, x_pos, y_pos + canvasTextSize - (canvasTextSize/4));
}

function draw_grid() {
    if (gif_frames.length === 0) return;

    let frame = gif_frames[gif_frame_number];

    for (let row = 0; row < grid_rows; row++) {
        for (let col = 0; col < grid_columns; col++) {
            let src_x = Math.floor(map(col, 0, grid_columns, 0, frame.width));
            let src_y = Math.floor(map(row, 0, grid_rows, 0, frame.height));

            src_x = constrain(src_x, 0, frame.width - 1);
            src_y = constrain(src_y, 0, frame.height - 1);

            let pixel_index = (src_x + src_y * frame.width) * 4;
            let r = frame.pixels[pixel_index];
            let g = frame.pixels[pixel_index + 1];
            let b = frame.pixels[pixel_index + 2];

            let brightness = getBrightness(r, g, b);
            let character = getBrightnessCharacter(brightness);
            draw_character_rectangle(col, row, character, r, g, b);
        }
    }
}

function draw() {
    if (gif_frames.length === 0) {
        return;
    }

    frameRate(fps);
    background(0);
    draw_grid();

    gif_frame_number = (gif_frame_number + 1) % gif_frames.length;
}
