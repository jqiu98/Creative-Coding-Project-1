class Monster {
	constructor(xpos, ypos) {
		this.x = xpos;
		this.y = ypos
	}

	display() {
		fill(144, 130, 233);
		ellipse(this.x, this.y, 60, 35);
		fill(255);
		ellipse(this.x-12, this.y-5, 7, 14);
		ellipse(this.x+12, this.y-5, 7, 14);
	}

	walk() {
		this.x += 3;
	}
}