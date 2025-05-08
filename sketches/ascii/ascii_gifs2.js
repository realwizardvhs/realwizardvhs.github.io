window.asciiGifs2Sketch = (p) => {
    let custom_font;
    let canvasTextSize = 8;
    let characters_by_brightness = `.- \':_,^=;><+!rc*/z?sLTv)J7(|Fi{C}fI31tlu[neoZ5Yxjya]2ESwqkP6h9d4VpOGbUAKXHm8RD#$Bg0MNWQ%&@`;

    let canvas_width;
    let canvas_height;
    let grid_rows;
    let grid_columns;

    let gif_path = 'assets/gifs/car_1.gif'; // Adjusted path
    let gif;
    let gif_frames = [];
    let fps = 8;
    let gif_frame_number = 0;

    p.preload = function() {
        custom_font = p.loadFont('assets/fonts/square.ttf'); // Adjusted path
        gif = p.loadImage(gif_path);
    };

    function load_gif_frames() {
        // Ensure gif is loaded and has frames
        if (!gif || gif.width === 0 || gif.height === 0) {
            console.error("GIF not loaded properly or has no dimensions.");
            return;
        }
        // Resize before extracting frames if that's the intent for processing
        // The original script resizes in setup before this, let's stick to that for now.
        // If gif.resize was meant for display frames, it should be here or on copies.

        for (let i = 0; i < gif.numFrames(); i++) {
            gif.setFrame(i);
            // Create a copy of the frame to store, as gif object is animated
            let frameCopy = p.createImage(gif.width, gif.height);
            frameCopy.copy(gif, 0, 0, gif.width, gif.height, 0, 0, gif.width, gif.height);
            frameCopy.loadPixels(); // Load pixels for the copy
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
        let index = p.map(brightness, 0, 255, 0, characters_by_brightness.length - 1);
        // Clamp index to be safe
        index = Math.floor(p.constrain(index, 0, characters_by_brightness.length - 1));
        return characters_by_brightness.charAt(index);
    }

    p.setup = function() {
        if (!gif || gif.width === 0 || gif.height === 0) {
            console.error("p.setup: GIF not loaded properly. Aborting setup.");
            // Fallback canvas in case gif is broken
            p.createCanvas(p.windowWidth, p.windowHeight);
            p.background(0);
            p.fill(255);
            p.textAlign(p.CENTER, p.CENTER);
            p.text("Error: GIF not loaded.", p.width/2, p.height/2);
            return;
        }
        
        // Resize the main gif object. Frames will be extracted from this resized version.
        gif.resize(800, 0); // Resize width to 200, height adjusts maintaining aspect ratio

        canvas_width = gif.width;
        canvas_height = gif.height;
        
        load_gif_frames(); // Load frames after gif is potentially resized and ready

        if (gif_frames.length === 0) {
            console.error("p.setup: No GIF frames loaded. Aborting further setup.");
             p.createCanvas(canvas_width || 400, canvas_height || 400); // Use resized gif dimensions or fallback
            p.background(0);
            p.fill(255);
            p.textAlign(p.CENTER, p.CENTER);
            p.text("Error: No GIF frames.", p.width/2, p.height/2);
            return;
        }

        // grid_columns and grid_rows are based on the resized gif dimensions and fixed canvasTextSize
        grid_columns = Math.floor(canvas_width / canvasTextSize);
        grid_rows = Math.floor(canvas_height / canvasTextSize);
        
        // The actual canvas size should be determined by the characters and text size
        let display_canvas_width = grid_columns * canvasTextSize;
        let display_canvas_height = grid_rows * canvasTextSize;

        p.createCanvas(display_canvas_width, display_canvas_height);
        // canvas.parent("sketch-holder") is handled by main.js

        p.pixelDensity(1);
        p.textFont(custom_font);
    };

    function draw_character_rectangle(x_col, y_row, character, r, g, b) {
        // x_col, y_row are grid indices
        let x_pos = x_col * canvasTextSize;
        let y_pos = y_row * canvasTextSize;

        p.fill(r, g, b);
        p.textSize(canvasTextSize);
        p.textAlign(p.LEFT, p.TOP); // Align text properly within its "cell"
        p.text(character, x_pos, y_pos + canvasTextSize - (canvasTextSize/4)); // Adjusted y_pos for better baseline alignment
    }

    function draw_grid() {
        if (gif_frames.length === 0) return;

        let frame = gif_frames[gif_frame_number];
        // frame.loadPixels(); // Pixels for copied frames should already be loaded

        for (let row = 0; row < grid_rows; row++) {
            for (let col = 0; col < grid_columns; col++) {
                // Calculate the source x, y from the original (resized) GIF frame
                // This needs to map grid col/row to pixel coordinates in the 'frame'
                // (which is a copy of a frame from the resized `gif` object)
                let src_x = Math.floor(p.map(col, 0, grid_columns, 0, frame.width));
                let src_y = Math.floor(p.map(row, 0, grid_rows, 0, frame.height));

                src_x = p.constrain(src_x, 0, frame.width - 1);
                src_y = p.constrain(src_y, 0, frame.height - 1);

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

    p.draw = function() {
        if (gif_frames.length === 0) {
            // If setup failed to load frames, this prevents errors in draw.
            // A message should have been shown on the canvas already by setup.
            return;
        }

        p.frameRate(fps);
        p.background(0);
        // fill(255) was here, but draw_character_rectangle sets fill for each char
        draw_grid();

        gif_frame_number = (gif_frame_number + 1) % gif_frames.length;
    };
};
