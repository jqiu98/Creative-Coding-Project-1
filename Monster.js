class Monster {
	constructor(x, y, r, g, b, a, speed) {
		this.title = "master";
		this.x = x;
		this.y = y;
		this.timestamp = frameCount;
		this.tick = 0;

		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a;

		this.width = 60;
		this.height = 35;

		this.buddy = null;

		this.currTrail = [this.x, this.y + this.height/2, this.x, this.y + this.height/2];
		this.allTrail = [];
		this.allTrail.push(this.currTrail);

		this.speed = speed;
	}

	displayTrail() {
		fill(0);
		strokeWeight(1.5);
		console.log(this.allTrail);
		for (let aTrail of this.allTrail) {
			line(aTrail[0], aTrail[1], aTrail[2], aTrail[3]);
		}
	}

	display() {
		push();
		translate(this.x, this.y);
		fill(this.r, this.g, this.b, this.a);
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
		this.currTrail = [this.x, this.y + this.height/2, this.x, this.y + this.height/2];
		this.allTrail.push(this.currTrail);
		++this.tick;
	}

	createBuddy() {
		this.buddy = new Monster(this.allTrail[0][0], this.allTrail[0][1], random(0,255), random(0, 255), random(0, 255), 100, this.speed * 2);
		this.buddy.title = "slave"
	}

	updateBuddy() {
		if (this.buddy.a < 255) this.buddy.a += 1;
		else this.eatTrail();
	}

	eatTrail() {
		this.buddy.walk();
		this.allTrail[0][0] = this.buddy.x;
		if (this.allTrail[0][0] > this.allTrail[0][2]) {
			this.allTrail.shift();
			this.buddy.x = this.allTrail[0][0];
			this.buddy.y = this.allTrail[0][1];
		}
	}

	walk() {
		this.x += this.speed;
		this.currTrail[2] = this.x;
		if (this.buddy != null) this.updateBuddy();

	}
}