let flag;
let creatures;

function setup() {
	createCanvas(windowWidth-100, windowHeight-100);
	background(220);
	flag = true;
	creatures = [];
}

function draw() {
	background(240);
	if (flag) {
		for (let aCreature of creatures) {
			aCreature.walk();
			if (aCreature.position.x > width+50 || aCreature.position.x < -50 ||
				aCreature.position.y > height+50 || aCreature.position.y < -50) {

				aCreature.reposition();
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
	let aCreature = new Monster(createVector(mouseX, mouseY), color(144, 130, 233, 255), 
								createVector(random(0,2), random(0,2)).normalize(), 0, "master");
	creatures.push(aCreature);
}