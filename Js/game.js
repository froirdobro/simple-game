const canvas = document.querySelector('canvas');
canvas.width = window.innerWidth-6;
canvas.height = window.innerHeight/1.5;
const ctx = canvas.getContext("2d");
let scoreCounter = 0;

let g_entities = [];

class Ball {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y
        this.radius = 30;
        this.dx = 0;
        this.dy = -1;
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

        //Collision handling
        if(this.x + this.dx > canvas.width-this.radius || this.x + this.dx < this.radius) {
            this.dx = this.dx * -1;
        }
        if(this.y + this.dy > canvas.height-this.radius || this.y + this.dy < this.radius) {
            this.dy = this.dy * -1;
        }
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
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.dx = -5;
        this.dy = 0;
        this.obstacles = [];
    }

    draw() {
        ctx.beginPath();
        ctx.rect(this.x, this.y, 50, 150);
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
g_entities.push();

player.draw();

document.getElementById('startBtn').addEventListener("click", () => {
    document.getElementById('myModal').style.display = "none";
    setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        player.direction();
        for (const entity of g_entities) {
            entity.update();
        }
    }, 10);
});

setInterval(() => {
    const newObstacle = new Obstacle(canvas.width, Math.random() * canvas.height);
    g_entities.push(newObstacle);
}, 1000);