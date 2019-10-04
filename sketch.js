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
			if (aCreature.x > width+50) {
				aCreature.x = 0;
				startY = random(0, height);
				aCreature.y = startY;
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
	let aCreature = new Monster(mouseX, mouseY, 144, 130, 233, 255, int(random(2,4)));
	creatures.push(aCreature);
}