class Car{
    constructor(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.speed = 0;
        this.acceleration = 0.2;
        this.maxSpeed = 3;
        this.friction = 0.05;
        this.angle = 0;

        this.sensor = new Sensor(this);
        this.controls = new Controls();
    }

    update(roadBorders){
        this.#move();
        this.sensor.update(roadBorders);
    }

    #move(){
        //lets the car move forward/backwards
        if(this.controls.forward){
            this.speed += this.acceleration;
        }
        if(this.controls.reverse){
            this.speed -= this.acceleration;
        }

        // caps the maximum speed of the car
        if(this.speed > this.maxSpeed){
            this.speed = this.maxSpeed;
        }
        if(this.speed < -this.maxSpeed/2){
            this.speed = -this.maxSpeed/2;
        }

        //adds the friction when speeding up/braking
        if(this.speed > 0){
            this.speed -= this.friction;
        }
        if(this.speed < 0){
            this.speed += this.friction;
        }
        //so that the car doesn't ALWAYS move
        if(Math.abs(this.speed) < this.friction){
            this.speed = 0;
        }

        //if the speed is negative, flip the controls ("if the car moves back, and you press right, it would go left")
        if(this.speed != 0){
            const flip = this.speed>0?1:-1;
            //"physics/unit circle", the car would move faster if going up diagonally
            if(this.controls.left){
                this.angle += 0.03*flip;
            }
            if(this.controls.right){
                this.angle -= 0.03*flip;
            }
        }

        //the car can now drive up diagonally, etc ("feels like a car")
        this.x -= Math.sin(this.angle)*this.speed;
        this.y -= Math.cos(this.angle)*this.speed;
        
    }

    //to draw the car
    draw(ctx){

        //needed for the rotation of the car
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(-this.angle);

        ctx.beginPath();
        ctx.rect(
            -this.width/2,
            -this.height/2,
            this.width/2,
            this.height/2,
        )
        ctx.fill();

        ctx.restore();

        this.sensor.draw(ctx);
    }
}