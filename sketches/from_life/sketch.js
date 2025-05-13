let canvas;
let active_polygon;
let polygons = [];
let vanishing_timers = [];

class Polygon {
    constructor() {
        this.points = [];
        this.fill_color = color(0); // p.color -> color
    }
}

function setup() { // p.setup -> function setup()
    canvas = createCanvas(800, 600); // p.createCanvas -> createCanvas
    
    polygons = [new Polygon()]; 
    active_polygon = 0; 
    vanishing_timers = [[0, null]];

    load_polygon_file();
}

function load_polygon_file() {
    loadJSON('/assets/data/polygon.json', function (jsonData) { // p.loadJSON -> loadJSON
        if (jsonData && Array.isArray(jsonData) && jsonData.length > 0) {
            let tempPolygons = [];
            let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

            for (const entry of jsonData) {
                let fill_color = color(entry.fill_color.levels); // p.color -> color
                let points = [];
                for (const point_data of entry.points) {
                    let vector = createVector(point_data.x, point_data.y); // p.createVector -> createVector
                    points.push(vector);

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

            if (tempPolygons.length > 0 && isFinite(minX) && isFinite(maxX) && isFinite(minY) && isFinite(maxY)) {
                const sceneCenterX = minX + (maxX - minX) / 2;
                const sceneCenterY = minY + (maxY - minY) / 2;
                const canvasCenterX = width / 2;   // p.width -> width
                const canvasCenterY = height / 2;  // p.height -> height
                offsetX = canvasCenterX - sceneCenterX;
                offsetY = canvasCenterY - sceneCenterY;
            }

            polygons = []; 
            vanishing_timers = []; 

            for (const tempPoly of tempPolygons) {
                for (const point of tempPoly.points) {
                    point.x += offsetX;
                    point.y += offsetY;
                }
                polygons.push(tempPoly);

                let new_polygon_index = polygons.length - 1;
                if (tempPoly.animated) {
                    vanishing_timers.push([new_polygon_index, random(1000, 5000)]); // p.random -> random
                } else {
                    vanishing_timers.push([new_polygon_index, null]);
                }
            }
            
            if (polygons.length === 0) {
                polygons.push(new Polygon());
                vanishing_timers.push([0, null]);
            }

        } else {
            // Placeholder used
        }

        if (polygons.length > 0) {
            active_polygon = polygons.length - 1; 
        } else {
            active_polygon = 0; 
        }
    });
}

function draw() { // p.draw -> function draw()
    background('lightblue'); // p.background -> background

    for (let i = 0; i < vanishing_timers.length; i++) {
        let timer_entry = vanishing_timers[i];
        if (!timer_entry || timer_entry[1] == null) {
            continue;
        }
        timer_entry[1] -= deltaTime; // p.deltaTime -> deltaTime
        if (timer_entry[1] <= 0) {
            timer_entry[1] = random(1000, 5000); // p.random -> random
        }
    }

    for (let i = 0; i < polygons.length; i++) {
        let polygon = polygons[i];
        if (!polygon) continue; 

        let r = red(polygon.fill_color); // p.red -> red
        let g = green(polygon.fill_color); // p.green -> green
        let b = blue(polygon.fill_color); // p.blue -> blue
        let base_alpha = alpha(polygon.fill_color); // p.alpha -> alpha
        let current_alpha = base_alpha > 0 ? base_alpha : 255;

        if (polygon.animated) {
            let timer_entry = vanishing_timers[i];
            if (timer_entry && timer_entry[1] != null) {
                 current_alpha = map(timer_entry[1], 0, 5000, 0, current_alpha); // p.map -> map
            } else { 
                 current_alpha = 0; 
            }
        }
        
        fill(r, g, b, current_alpha); // p.fill -> fill
        noStroke(); // p.noStroke -> noStroke

        beginShape(); // p.beginShape -> beginShape
        for (let j = 0; j < polygon.points.length; j++) {
            let pt = polygon.points[j];
            let draw_p_x = pt.x;
            let draw_p_y = pt.y;
            if (polygon.animated) {
                let dTime = min(deltaTime, 100); // p.min, p.deltaTime -> min, deltaTime
                draw_p_x += (random(-0.25, 0.25) * dTime); // p.random -> random
                draw_p_y += (random(-0.25, 0.25) * dTime); // p.random -> random
            }
            vertex(draw_p_x, draw_p_y); // p.vertex -> vertex
        }
        endShape(CLOSE); // p.endShape, p.CLOSE -> endShape, CLOSE
    }
}

