class Ghost {
	constructor(position, velocity, direction, r, g, b, a,) {
		this.position = position;
		this.velocity = velocity;
		this.direction = direction;
		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a;

		this.width = 60;
		this.height = 45;
	}

	display() {
		fill(this.r, this.g, this.b, this.a);
		stroke(0);
		push();
		translate(this.position);
		rotate(this.velocity.heading());
		ellipse(0, 0, this.width, this.height);
		fill(255);
		ellipse(-this.width/5, -this.height/7, this.height/7, this.height/7 * 2.5);
		ellipse(this.width/5, -this.height/7, this.height/7, this.height/7 * 2.5);
		pop();
	}
	walk() {
		this.position.add(this.velocity);
	}
}