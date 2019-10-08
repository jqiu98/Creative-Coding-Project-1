let startY;
let flag;
let creatures;

function setup() {
	createCanvas(500, 500);
	background(220);
	startY = height/2;
	flag = true;
	creatures = [];
}

function draw() {
	background(240);
	if (flag) {
		for (let aCreature of creatures) {
			aCreature.walk();
			if (aCreature.position.x > width+50) {
				aCreature.position.x = 0;
				startY = random(0, height);
				aCreature.position.y = startY;
				aCreature.addTrail();
			}
		}
	}
	for (let aCreature of creatures) {
			aCreature.display();
	}
}

function keyPressed() {
	flag = !flag;
}

function mousePressed() {
	let aCreature = new Monster(createVector(mouseX, mouseY), color(144, 130, 233, 255), createVector(int(random(2,4)), 0));
	creatures.push(aCreature);
}