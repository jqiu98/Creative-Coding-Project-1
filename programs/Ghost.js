class Ghost {
	constructor(position, velocity, direction, r, g, b, a,) {
		this.position = position; // Vector for position
		this.velocity = velocity; // Vector for displacement
		this.direction = direction; // int value to decide which direction its heading (0:E,1:S,2:W,3:N)
		this.r = r; // red value
		this.g = g; // green value
		this.b = b; // blue value
		this.a = a; // alpha value

		this.width = 60; // ellipse width
		this.height = 45; // ellipse height
	}

	display() { // Draw on screen
		fill(this.r, this.g, this.b, this.a);
		stroke(0);
		push();
		translate(this.position); // Translate to the position in order to rotate in place
		rotate(this.velocity.heading()); // Rotate based on the velocity (basically direction)
		ellipse(0, 0, this.width, this.height); // Body
		fill(255);
		ellipse(-this.width/5, -this.height/7, this.height/7, this.height/7 * 2.5); // Left Eye
		ellipse(this.width/5, -this.height/7, this.height/7, this.height/7 * 2.5); // Right Eye
		pop();
	}

	move() { // Update the position
		this.position.add(this.velocity);
	}
}