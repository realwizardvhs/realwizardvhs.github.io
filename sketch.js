var canvas;


function setup() {
    textAlign(CENTER,CENTER);
    canvas = createCanvas(600,600);
    canvas.parent('sketch-holder');
}

function draw(){
    background(0);
    fill(255);
    text("Hello World", 100,10);
}



/*var BG;
var fontSize;
var font;


var links= []

class RectLink{
    constructor(x,y,w,h,text){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.text = text;
        this.angle = floor(random(-4,4))
        this.c = color(random(0,360), 60, 100)
    }

    draw(){
        push();
        translate(this.x, this.y)
        rotate(this.angle)
        fill(this.c)
        rect(0,0, this.w, this.h)
        fill(0);
        //center text in rect
        text(this.text, this.w/2, this.h/2)
        pop();
    }
}



function setup(){
    createCanvas(windowWidth, windowHeight);

    //--
    fontSize = 32;
    font ='Monospace';
    jitter = 1.5

    //--
    colorMode(HSB);
    textSize(fontSize);
    textFont(font);
    strokeCap(PROJECT);
    angleMode(DEGREES)

    textAlign(CENTER,CENTER)

    //--
    BG = color(0, 0, 100)

    //--
    for(let i = 0; i < 10; i++){
        links.push(new RectLink(fontSize, fontSize*i*1.4 + floor(random(-15,15)), 150, 30, "Link " + i))
    }




}

function draw(){
    background(BG)
    for (let i = 0; i < links.length; i++) {
        links[i].draw()
    }
}*/