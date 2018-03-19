const canvas = document.querySelector('canvas');
canvas.width = window.innerWidth-6;
canvas.height = window.innerHeight/1.5;
const ctx = canvas.getContext("2d");
let g_counter = 0;
let g_entities = [];

class Ball {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y
        this.radius = 30;
        this.dx = 0;
        this.dy = -2;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        ctx.stroke();
        ctx.closePath();
    }

    update() {
        this.draw();

        this.x += this.dx;
        this.y += this.dy;

        //Collision with the borders of canvas
        if(this.x + this.dx > canvas.width-this.radius || this.x + this.dx < this.radius) {
            this.dx = this.dx * -1;
        };

        if(this.y + this.dy > canvas.height-this.radius || this.y + this.dy < this.radius) {
            this.dy = this.dy * -1;
        };
	}

	collision(rect, start) {
		let distX = Math.abs(this.x - rect.x-rect.w/2);
		let distY = Math.abs(this.y - rect.y-rect.h/2);

	    let xD = distX - rect.w/2;
	    let yD = distY - rect.h/2;

	    if (xD * xD + yD * yD <= (this.radius * this.radius)) {
	    	clearInterval(start);	
	    };
	}

    direction() {
        document.body.onkeyup = (e) => {
            if(e.keyCode === 32) {
                this.dy = this.dy * -1
            };
        };

        this.update();
    }
}

class Obstacle {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = 50;
        this.h = 50;
        this.dx = -5;
        this.dy = 0;
    }

    draw() {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.w, this.h);
        ctx.stroke();
        ctx.closePath();
    }

    update() {
        this.draw();

        this.x += this.dx;
        this.y += this.dy;
    }
}

let player = new Ball(canvas.width/16, canvas.height/2);
g_entities.push(player);

player.draw();

document.getElementById('startBtn').addEventListener("click", () => {
    document.getElementById('startModal').style.display = "none";
    //game starts
    let start = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        player.direction();
        for (const entity of g_entities) {
            entity.update();
            player.collision(entity, start);
        };
    }, 10);

    //draws first set of obstacles
    setInterval(() => {
    	const newObstacle = new Obstacle(canvas.width, Math.random() * canvas.height);
    	g_entities.push(newObstacle);
	}, 1000);

    //draws second set of obstacles
	setInterval(() => {
    	const newObstacle2 = new Obstacle(canvas.width, Math.random() * canvas.height);
    	g_entities.push(newObstacle2);
	}, 1500)
});

/*  (0,0)        y < 0      (width,0)
      /----------------------\
      |                      |
      |                      |
x < 0 |                      | x > width
      |                      |
      |                      |
      \----------------------/
   (0,height)              (width,height)

              y > height
*/