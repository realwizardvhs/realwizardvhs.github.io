function fromLifeSketch(p) {
    class Polygon {
        constructor() {
            this.points = [];
            this.fill_color = p.color(0); // Prefixed with p.
        }
    }

    let canvas;
    let active_polygon; // Index of the active polygon
    let polygons = []; // Array to store Polygon objects
    let vanishing_timers = []; // Timers for animated polygons

    p.setup = function() {
        canvas = p.createCanvas(800, 600); // p5.js createCanvas, parent is handled by main.js
        
        // Initialize with a placeholder polygon, in case JSON loading fails or is empty
        polygons = [new Polygon()]; 
        active_polygon = 0; 
        vanishing_timers = [[0, null]]; // Timer for the placeholder

        load_polygon_file();
    };

    function load_polygon_file() {
        p.loadJSON('assets/data/polygon.json', function (jsonData) { 
            if (jsonData && Array.isArray(jsonData) && jsonData.length > 0) {
                let tempPolygons = [];
                let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

                // First pass: parse polygons from JSON and find scene bounds
                for (const entry of jsonData) {
                    let fill_color = p.color(entry.fill_color.levels); 
                    let points = [];
                    for (const point_data of entry.points) {
                        let vector = p.createVector(point_data.x, point_data.y); 
                        points.push(vector);

                        // Update bounds based on original coordinates from JSON
                        minX = Math.min(minX, vector.x);
                        maxX = Math.max(maxX, vector.x);
                        minY = Math.min(minY, vector.y);
                        maxY = Math.max(maxY, vector.y);
                    }

                    let new_polygon = new Polygon();
                    new_polygon.fill_color = fill_color;
                    new_polygon.points = points;
                    new_polygon.animated = !!entry.animated;
                    tempPolygons.push(new_polygon);
                }

                let offsetX = 0;
                let offsetY = 0;

                // Calculate offset if bounds are valid and polygons were found
                if (tempPolygons.length > 0 && isFinite(minX) && isFinite(maxX) && isFinite(minY) && isFinite(maxY)) {
                    const sceneCenterX = minX + (maxX - minX) / 2;
                    const sceneCenterY = minY + (maxY - minY) / 2;
                    const canvasCenterX = p.width / 2;   // p.width and p.height reflect current canvas size
                    const canvasCenterY = p.height / 2;
                    offsetX = canvasCenterX - sceneCenterX;
                    offsetY = canvasCenterY - sceneCenterY;
                }

                // If we successfully parsed polygons from JSON, replace the placeholder
                polygons = []; 
                vanishing_timers = []; 

                // Second pass: apply offset and build final polygons and timers arrays
                for (const tempPoly of tempPolygons) {
                    // Apply offset to this polygon's points
                    for (const point of tempPoly.points) {
                        point.x += offsetX;
                        point.y += offsetY;
                    }
                    polygons.push(tempPoly); // Add to the main polygons array

                    // Setup corresponding timer
                    let new_polygon_index = polygons.length - 1;
                    if (tempPoly.animated) {
                        vanishing_timers.push([new_polygon_index, p.random(1000, 5000)]);
                    } else {
                        vanishing_timers.push([new_polygon_index, null]);
                    }
                }
                
                // If, after processing JSON, polygons array ended up empty (e.g. JSON parsing issue not caught but resulted in no polys),
                // restore a default polygon to prevent errors.
                if (polygons.length === 0) {
                    polygons.push(new Polygon());
                    vanishing_timers.push([0, null]);
                }

            } else {
                // jsonData was null, empty, or not an array.
                // The initial placeholder polygon and timer set in p.setup() will be used.
                // No changes needed to polygons or vanishing_timers here.
            }

            // Set active_polygon, ensuring it's a valid index for the current state of 'polygons'
            if (polygons.length > 0) {
                active_polygon = polygons.length - 1; 
            } else {
                 // This case should ideally not be reached if p.setup always initializes one polygon
                active_polygon = 0; 
            }
        });
    }

    p.draw = function() {
        p.background('lightblue'); // Prefixed with p.

        for (let i = 0; i < vanishing_timers.length; i++) {
            let timer_entry = vanishing_timers[i];
            if (!timer_entry || timer_entry[1] == null) {
                continue;
            }
            timer_entry[1] -= p.deltaTime; // Prefixed
            if (timer_entry[1] <= 0) {
                timer_entry[1] = p.random(1000, 5000); // Prefixed
            }
        }

        for (let i = 0; i < polygons.length; i++) {
            let polygon = polygons[i];
            if (!polygon) continue; 

            let r = p.red(polygon.fill_color); 
            let g = p.green(polygon.fill_color); 
            let b = p.blue(polygon.fill_color); 
            let base_alpha = p.alpha(polygon.fill_color);
            let current_alpha = base_alpha > 0 ? base_alpha : 255;

            if (polygon.animated) {
                let timer_entry = vanishing_timers[i];
                if (timer_entry && timer_entry[1] != null) {
                     current_alpha = p.map(timer_entry[1], 0, 5000, 0, current_alpha); // Prefixed
                } else { 
                     current_alpha = 0; 
                }
            }
            
            p.fill(r, g, b, current_alpha); 
            p.noStroke(); 

            p.beginShape(); 
            for (let j = 0; j < polygon.points.length; j++) {
                let pt = polygon.points[j];
                let draw_p_x = pt.x;
                let draw_p_y = pt.y;
                if (polygon.animated) {
                    let dTime = p.min(p.deltaTime, 100); // Prefixed
                    draw_p_x += (p.random(-0.25, 0.25) * dTime); // Prefixed
                    draw_p_y += (p.random(-0.25, 0.25) * dTime); // Prefixed
                }
                p.vertex(draw_p_x, draw_p_y); 
            }
            p.endShape(p.CLOSE); 
        }
    };
}

