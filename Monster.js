class Monster {
	constructor(position, c, speed) {
		this.title = "master";

		this.position = position;
		this.speed = speed;

		this.timestamp = frameCount;
		this.tick = 0;

		this.color = c;

		this.width = 60;
		this.height = 35;

		this.buddy = null;

		this.currTrail = [this.position.x, this.position.y + this.height/2, this.position.x, this.position.y + this.height/2];
		this.allTrail = [];
		this.allTrail.push(this.currTrail);
	}

	displayTrail() {
		strokeWeight(1.5);
		stroke(this.color);
		console.log(this.allTrail);
		for (let aTrail of this.allTrail) {
			line(aTrail[0], aTrail[1], aTrail[2], aTrail[3]);
		}
	}

	display() {
		fill(this.color);
		stroke(0);
		push();
		translate(this.position);
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
		this.currTrail = [this.position.x, this.position.y + this.height/2, this.position.x, this.position.y + this.height/2];
		this.allTrail.push(this.currTrail);
		++this.tick;
	}

	createBuddy() {
		let c = color(random(0,255), random(0, 255), random(0, 255), 100);
		let position = createVector(this.allTrail[0][0], this.allTrail[0][1] - this.height/2);
		this.buddy = new Monster(position, c, p5.Vector.mult(this.speed, 2));
		this.buddy.title = "slave";
	}

	updateBuddy() {
		if (alpha(this.buddy.color) < 255) this.buddy.color.setAlpha(alpha(this.buddy.color)+1);
		else this.eatTrail();
	}

	eatTrail() {
		this.buddy.walk();
		this.allTrail[0][0] = this.buddy.position.x;
		if (this.allTrail[0][0] > this.allTrail[0][2]) {
			if (this.allTrail.length > 1) {
				this.allTrail.shift();
				this.buddy.position.x = this.allTrail[0][0];
				this.buddy.position.y = this.allTrail[0][1] - this.height/2;
			}
			else {
				this.devour();
			}
		}
	}

	walk() {
		this.position.add(this.speed);
		this.currTrail[2] = this.position.x;
		if (this.buddy != null) this.updateBuddy();
	}

	devour() {
		this.tick = 0;
		this.position = this.buddy.position;
		this.color = this.buddy.color;

		this.speed = this.speed.add(this.buddy.speed).div(2);

		this.currTrail = [this.position.x, this.position.y + this.height/2, this.position.x, this.position.y + this.height/2];
		this.allTrail = [];
		this.allTrail.push(this.currTrail);

		delete this.buddy;
		this.buddy = null;
	}
}