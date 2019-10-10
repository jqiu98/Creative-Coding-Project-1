class Monster extends Ghost {
	constructor(position, velocity, direction, r, g, b, a) {
		super(position, velocity, direction, r, g, b, a);

		this.init_velocity = velocity;
		this.speed = 15;
		this.rank = 1;

		this.updateVelocity();
		this.updateSize();

		this.timestamp = frameCount;
		this.lap = 0;
		this.ghost = null;

		this.currTrail = [this.position.copy(), this.position.copy(), this.velocity.copy().mult(2), this.direction];
		this.allTrail = [];
		this.allTrail.push(this.currTrail);
	}

	walk() {
		super.walk();
		this.currTrail[1].x += this.velocity.x;
		this.currTrail[1].y += this.velocity.y;
		if (this.ghost != null) this.updateGhost();
	}

	display() {
		super.display();
		this.displayTrail();
		if (this.lap == 2 && this.ghost == null) this.createGhost();
		if (this.ghost != null) this.ghost.display();
	}

	displayTrail() {
		strokeWeight(1.5);
		stroke(this.r, this.g, this.b, 50);
		for (let aTrail of this.allTrail) {
			line(aTrail[0].x, aTrail[0].y, aTrail[1].x, aTrail[1].y);
		}
	}

	updateVelocity() {
		this.velocity = p5.Vector.mult(this.init_velocity, this.speed);
	}

	updateSize() {
		this.size = 14 + this.rank;
		this.width = 4 * this.size;
		this.height = 3 * this.size;
	}

	addTrail() {
		this.currTrail = [this.position.copy(), this.position.copy(), this.velocity.copy().mult(2), this.direction];
		this.allTrail.push(this.currTrail);
		++this.lap;
	}

	reposition() {
		this.direction = int(random(0,4));
		switch (this.direction) {
			case 0: // Left Screen
				this.position.x = 0;
				this.position.y = random(0, height);
				this.init_velocity = createVector(random(0,1), random(-1,1));
				break;
			case 1: // Top Screen
				this.position.x = random(0, width);
				this.position.y = 0;
				this.init_velocity = createVector(random(-1,1), random(0,1));
				break;
			case 2: // Right Screen
				this.position.x = width;
				this.position.y = random(0, height);
				this.init_velocity = createVector(random(-1, 0), random(-1,1));
				break;
			case 3: // Bottom Screen
				this.position.x = random(0, width);
				this.position.y = height;
				this.init_velocity = createVector(random(-1,1), random(-1,0));
				break;
		}
		this.init_velocity.normalize();
		this.updateVelocity();
		this.addTrail();
	}

	createGhost() {
		this.ghost = new Ghost(this.allTrail[0][0], this.allTrail[0][2], this.allTrail[0][3], 
								this.r, this.g, this.b, 0);
	}

	updateGhost() {
		if (this.ghost.a < 50) ++this.ghost.a;
		else this.eatTrail();
	}

	eatTrail() {
		this.ghost.walk();
		if (this.checkTrail()) {
			if (this.allTrail.length > 1) {
				this.allTrail.shift();
				this.ghost.position = this.allTrail[0][0];
				this.ghost.velocity = this.allTrail[0][2];
				this.ghost.direction = this.allTrail[0][3];
			}
			else this.rankUp();
		}
	}

	checkTrail() {
		if (this.ghost.direction == 0) return (this.allTrail[0][0].x > this.allTrail[0][1].x);
		else if (this.ghost.direction == 1) return (this.allTrail[0][0].y > this.allTrail[0][1].y);
		else if (this.ghost.direction == 2) return (this.allTrail[0][0].x < this.allTrail[0][1].x);
		else return (this.allTrail[0][0].y < this.allTrail[0][1].y);
	}

	rankUp() {
		this.lap = 0;
		++this.rank;
		this.updateSize();
		if (this.speed > 7) {
			this.speed -= 0.5;
			this.updateVelocity;
		}

		this.currTrail = [this.position.copy(), this.position.copy(), this.velocity.copy().mult(2), this.direction];
		this.allTrail.push(this.currTrail);

		delete this.ghost;
		this.ghost = null;
	}

	devour(enemy) {
		this.rank += enemy.rank;
	}
}



// class Monster {
// 	constructor(position, velocity, direction, r, g, b, a,) {
// 		this.position = position;
// 		this.velocity = velocity;
// 		this.direction = direction;
// 		this.r = r;
// 		this.g = g;
// 		this.b = b;
// 		this.a = a;


// 		this.init_velocity = velocity;
// 		this.speed = 20;
// 		this.updateVelocity();

// 		this.rank = 1;

// 		this.timestamp = frameCount;
// 		this.lap = 0;

// 		this.size = 0;
// 		this.width = 0;
// 		this.height = 0;
// 		this.updateSize();

// 		this.ghost = null;

// 		this.currTrail = [this.position.copy(), this.position.copy(), this.velocity.copy().mult(2), this.direction];
// 		this.allTrail = [];
// 		this.allTrail.push(this.currTrail);
// 	}

// 	updateSize() {
// 		this.size = 14 + this.rank;
// 		this.width = 4 * this.size;
// 		this.height = 3 * this.size;
// 	}

// 	updateVelocity() {
// 		this.velocity = p5.Vector.mult(this.init_velocity, this.speed/this.rank);
// 	}

// 	displayTrail() {
// 		strokeWeight(1.5);
// 		stroke(this.r, this.g, this.b, 100);
// 		for (let aTrail of this.allTrail) {
// 			// push();
// 			// translate(aTrail[0], aTrail[1]);
// 			// rotate(this.velocity.heading());

// 			// let xdiff = (aTrail[2] - aTrail[0])**2;
// 			// let ydiff = (aTrail[3] - aTrail[1])**2;
// 			// let d = (xdiff + ydiff)**(1/2);
// 			// line(0, 0, d, 0);
// 			// pop();
// 			line(aTrail[0].x, aTrail[0].y, aTrail[1].x, aTrail[1].y);
// 		}
// 	}

// 	display() {
// 		fill(this.r, this.g, this.b, this.a);
// 		stroke(0);
// 		push();
// 		translate(this.position);
// 		rotate(this.velocity.heading());
// 		ellipse(0, 0, this.width, this.height);
// 		fill(255);
// 		ellipse(-this.width/5, -this.height/7, this.height/7, this.height/7 * 2.5);
// 		ellipse(this.width/5, -this.height/7, this.height/7, this.height/7 * 2.5);
// 		pop();

// 		if (this.title == "real") this.displayTrail();
// 		if (this.lap == 2 && this.ghost == null) this.createGhost();
// 		if (this.ghost != null) this.ghost.display();
// 	}

// 	addTrail() {
// 		this.currTrail = [this.position.copy(), this.position.copy(), this.velocity.copy().mult(2), this.direction];
// 		this.allTrail.push(this.currTrail);
// 		++this.lap;
// 	}

// 	reposition() {
// 		this.direction = int(random(0,4));
// 		switch (this.direction) {
// 			case 0: // Left Screen
// 				this.position.x = 0;
// 				this.position.y = random(0, height);
// 				this.init_velocity = createVector(random(0,2), random(-2,2));
// 				break;
// 			case 1: // Top Screen
// 				this.position.x = random(0, width);
// 				this.position.y = 0;
// 				this.init_velocity = createVector(random(-2,2), random(0,2));
// 				break;
// 			case 2: // Right Screen
// 				this.position.x = width;
// 				this.position.y = random(0, height);
// 				this.init_velocity = createVector(random(-2, 0), random(-2,2));
// 				break;
// 			case 3: // Bottom Screen
// 				this.position.x = random(0, width);
// 				this.position.y = height;
// 				this.init_velocity = createVector(random(-2,2), random(-2,0));
// 				break;
// 		}
// 		this.init_velocity.normalize();
// 		this.
// 		this.addTrail();
// 	}

// 	createGhost() {
// 		this.ghost = new Monster(this.allTrail[0][0], this.allTrail[0][2], this.allTrail[0][3], 
// 								this.r, this.g, this.b, 0);
// 	}

// 	updateGhost() {
// 		if (this.ghost.a < 100) ++this.ghost.a;
// 		else this.eatTrail();
// 	}

// 	eatTrail() {
// 		this.ghost.position.add(this.ghost.velocity);

// 		if (this.checkTrail()) {
// 			console.log(this.ghost.direction);
// 			if (this.allTrail.length > 1) {
// 				this.allTrail.shift();
// 				this.ghost.position = this.allTrail[0][0];
// 				this.ghost.velocity = this.allTrail[0][2];
// 				this.ghost.direction = this.allTrail[0][3];
// 			}
// 			else this.rankUp();
// 		}
// 	}

// 	checkTrail() {
// 		if (this.ghost.direction == 0) return (this.allTrail[0][0].x > this.allTrail[0][1].x);
// 		else if (this.ghost.direction == 1) return (this.allTrail[0][0].y > this.allTrail[0][1].y);
// 		else if (this.ghost.direction == 2) return (this.allTrail[0][0].x < this.allTrail[0][1].x);
// 		else return (this.allTrail[0][0].y < this.allTrail[0][1].y);
// 	}

// 	walk() {
// 		this.position.add(this.velocity);
// 		this.currTrail[1].x += this.velocity.x;
// 		this.currTrail[1].y += this.velocity.y;
// 		if (this.ghost != null) this.updateGhost();
// 	}

// 	devour(enemy) {
// 		this.rank += enemy.rank;
// 	}

// 	rankUp() {
// 		this.lap = 0;
// 		this.speed -= 0.5;
// 		++this.rank;
// 		this.updateSize();

// 		this.currTrail = [this.position.copy(), this.position.copy(), this.velocity.copy().mult(2), this.direction];
// 		this.allTrail.push(this.currTrail);

// 		delete this.ghost;
// 		this.ghost = null;
// 	}
// }