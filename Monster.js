class Monster {
	constructor(position, c, velocity, direction, title) {
		this.position = position;
		this.velocity = velocity;
		this.direction = direction;

		this.speed = 4;
		this.velocity.mult(this.speed);

		this.color = c;
		this.title = title;

		this.timestamp = frameCount;
		this.tick = 0;
		this.width = 60;
		this.height = 35;

		this.buddy = null;

		this.currTrail = [this.position.copy(), this.position.copy(), this.velocity.copy().mult(2), this.direction];

		this.allTrail = [];
		this.allTrail.push(this.currTrail);
	}

	displayTrail() {
		strokeWeight(1.5);
		stroke(this.color);
		for (let aTrail of this.allTrail) {
			// push();
			// translate(aTrail[0], aTrail[1]);
			// rotate(this.velocity.heading());

			// let xdiff = (aTrail[2] - aTrail[0])**2;
			// let ydiff = (aTrail[3] - aTrail[1])**2;
			// let d = (xdiff + ydiff)**(1/2);
			// line(0, 0, d, 0);
			// pop();
			line(aTrail[0].x, aTrail[0].y, aTrail[1].x, aTrail[1].y);
		}
	}

	display() {
		fill(this.color);
		stroke(0);
		push();
		translate(this.position);
		rotate(this.velocity.heading());
		ellipse(0, 0, this.width, this.height);
		fill(255);
		ellipse(-this.width/5, -this.height/7, 7, 14);
		ellipse(this.width/5, -this.height/7, 7, 14);
		pop();

		if (this.title == "master") this.displayTrail();
		if (this.tick == 3 && this.buddy == null) this.createBuddy();
		if (this.buddy != null) this.buddy.display();
	}

	addTrail() {
		this.currTrail = [this.position.copy(), this.position.copy(), this.velocity.copy().mult(2), this.direction];
		this.allTrail.push(this.currTrail);
		++this.tick;
	}

	reposition() {
		this.direction = int(random(0,4));
		switch (this.direction) {
			case 0: // Left Screen
				this.position.x = 0;
				this.position.y = random(0, height);
				this.velocity = createVector(random(0,2), random(-2,2));
				break;
			case 1: // Top Screen
				this.position.x = random(0, width);
				this.position.y = 0;
				this.velocity = createVector(random(-2,2), random(0,2));
				break;
			case 2: // Right Screen
				this.position.x = width;
				this.position.y = random(0, height);
				this.velocity = createVector(random(-2, 0), random(-2,2));
				break;
			case 3: // Bottom Screen
				this.position.x = random(0, width);
				this.position.y = height;
				this.velocity = createVector(random(-2,2), random(-2,0));
				break;
		}
		this.velocity.normalize();
		this.velocity.mult(this.speed);
		this.addTrail();
	}

	createBuddy() {
		let c = color(random(0,255), random(0, 255), random(0, 255), 100);
		this.buddy = new Monster(this.allTrail[0][0], c, this.allTrail[0][2], this.allTrail[0][3], "slave");
		this.buddy.velocity.div(this.buddy.speed);
	}

	updateBuddy() {
		if (alpha(this.buddy.color) < 255) this.buddy.color.setAlpha(alpha(this.buddy.color)+1);
		else this.eatTrail();
	}

	eatTrail() {
		this.buddy.position.add(this.buddy.velocity);
		// this.allTrail[0][0].x += this.buddy.velocity.x;
		// this.allTrail[0][0].y += this.buddy.velocity.y;

		if (this.checkTrail()) {
			console.log(this.buddy.direction);
			if (this.allTrail.length > 1) {
				this.allTrail.shift();
				this.buddy.position = this.allTrail[0][0];
				this.buddy.velocity = this.allTrail[0][2];
				this.buddy.direction = this.allTrail[0][3];
			}
			else this.devour();
		}
	}

	checkTrail() {
		if (this.buddy.direction == 0) return (this.allTrail[0][0].x > this.allTrail[0][1].x);
		else if (this.buddy.direction == 1) return (this.allTrail[0][0].y > this.allTrail[0][1].y);
		else if (this.buddy.direction == 2) return (this.allTrail[0][0].x < this.allTrail[0][1].x);
		else return (this.allTrail[0][0].y < this.allTrail[0][1].y);
	}

	walk() {
		this.position.add(this.velocity);
		this.currTrail[1].x += this.velocity.x;
		this.currTrail[1].y += this.velocity.y;
		if (this.buddy != null) this.updateBuddy();
	}

	devour() {
		this.tick = 0;
		this.color = this.buddy.color;

		this.speed += 0.5;

		this.currTrail = [this.position.copy(), this.position.copy(), this.velocity.copy().mult(2), this.direction];
		this.allTrail.push(this.currTrail);

		delete this.buddy;
		this.buddy = null;
	}
}