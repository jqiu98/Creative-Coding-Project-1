let creature;
let startY;

function setup() {
	createCanvas(500, 500);
	background(220);
	startY = height/2;
	creature = new Monster(0, height/2);
}

function draw() {
	background(220);
	strokeWeight(2.2);
	creature.walk();
	creature.display();
	fill(0);
	line(0, startY + 17.5, creature.x, creature.y + 17.5);
	if (creature.x > width) {
		creature.x = 0;
		startY = random(0, height);
		creature.y = startY;
	}
}