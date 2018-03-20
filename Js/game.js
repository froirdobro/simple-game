const canvas = document.querySelector('canvas');
canvas.width = window.innerWidth-40;
canvas.height = window.innerHeight/1.32;
const ctx = canvas.getContext("2d");
const img = document.getElementById("image");
let g_counter = 0;
let g_entities = [];
let g_elapsedSeconds = 0;
let g_audios = [];
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
        ctx.fillStyle = "#306532";
        ctx.fill();
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
        ctx.fillStyle = "#CA9668";
        ctx.fill();
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

class Sound {
	constructor(filePath) {
		this.audio = new Audio(filePath);
	}

	play() {
		this.audio.play();
	}

	loopAudio() {
		this.audio.addEventListener("ended", () => {
			this.audio.currentTime = 0;
			this.audio.play();
		}, false);

		this.audio.play();
	}

	stop() {
		this.audio.pause();
    	this.audio.currentTime = 0;
	}
}

let player = new Ball(canvas.width/16, canvas.height/2);
g_entities.push(player);

let crash = new Sound("Audio/crash.mp3");
let mainSong = new Sound("Audio/The_Clergys_Lamentation.mp3");
let begSong = new Sound("Audio/title_song.mp3");
let endSong = new Sound("Audio/game_over.mp3");

player.draw();
begSong.loopAudio();

document.getElementById('startBtn').addEventListener("click", () => {
	document.getElementById('startModal').style.display = "none";
    document.getElementById('restContent').style.display = "block";
    begSong.stop();
    mainSong.loopAudio();
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
    	};

    	document.getElementById("score").innerText = g_elapsedSeconds;
	}, 1000);
});


function gameOver() {
	crash.play();
	clearInterval(start);
	clearInterval(setObst);
	mainSong.stop();
	endSong.loopAudio();
	document.getElementById("scoreText").innerText = "Final Score";
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