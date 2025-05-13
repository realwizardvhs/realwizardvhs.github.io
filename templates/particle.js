class Particle {
    constructor(x,y,radius = 10,color = 'black',lifespan = Infinity){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.lifespan = lifespan;
    }

    is_alive(){
        return this.lifespan > 0;
    }

    display(){
        fill(this.color);
        circle(this.x,this.y,this.radius);
    }

    update(){
        this.lifespan--;
    }
}