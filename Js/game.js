const canvas = document.querySelector('canvas');
canvas.width = window.innerWidth-6;
canvas.height = window.innerHeight/1.5;
const ctx = canvas.getContext("2d");
let g_counter = 0;
let g_entities = [];
let g_elapsedSeconds = 0;
let setObst;
let start;

class Ball {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y
        this.radius = 20;
        this.dx = 0;
        this.dy = -2;

        this.isDead = false;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        ctx.fillStyle = "green";
        ctx.fill();
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

        for (const entity of g_entities) {
        	if (!(entity instanceof Obstacle))
        		continue;

        	if (this.isCollidingWith(entity)) {
        		// game over!
        		gameOver();
        		return;
        	}
        }
	}

	isCollidingWith(rect) {
		let distX = Math.abs(this.x - rect.x - rect.w/2);
		let distY = Math.abs(this.y - rect.y - rect.h/2);

	    let xD = distX - rect.w/2;
	    let yD = distY - rect.h/2;

		if (xD * xD + yD * yD <= (this.radius * this.radius)) {
	   		return true;
	    } else {
	    	return false;
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
	static spawnNew() {
		const newObstacle = new Obstacle(canvas.width, Math.random() * canvas.height);
		g_entities.push(newObstacle);
		return newObstacle;
	}

    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = 40;
        this.h = 40;
        this.dx = -5;
        this.dy = 0;

        this.isDead = false;
    }

    draw() {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.w, this.h);
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }

    update() {
        this.draw();

        this.x += this.dx;
        this.y += this.dy;

        if (this.x <= -this.w) {
        	// obstacle has disappeared, clean it up
        	this.isDead = true;
        }
    }
}

let player = new Ball(canvas.width/16, canvas.height/2);
g_entities.push(player);

player.draw();

document.getElementById('startBtn').addEventListener("click", () => {
    document.getElementById('startModal').style.display = "none";
	start = setInterval(() => {
	    ctx.clearRect(0, 0, canvas.width, canvas.height);
	    player.direction();
	    for (const entity of g_entities) {
	        entity.update();
	    };

	    // clean up dead entities
	    for (let i = g_entities.length - 1; i >= 0; i--) {
	    	const entity = g_entities[i];
	    	if (entity.isDead) {
	    		g_entities.splice(i, 1);
	    	}
	    }
	}, 10);

    setObst = setInterval(() => {
    	g_elapsedSeconds++;

    	// every 5 seconds, increase the number of obstacles spawned
    	for (let i = 1; i <= Math.floor(g_elapsedSeconds / 5) + 1; i++) {
    		Obstacle.spawnNew();
    		console.log("I'm drawing bitch");
    	}
	}, 1000);
});

function gameOver() {
	clearInterval(start);
	clearInterval(setObst);
	document.getElementById("endModal").style.display = "block";
};

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