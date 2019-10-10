let r, g, b;
let direction;
let velocity;
let flag;
let aMonster;
let monsters;

function setup() {
	createCanvas(windowWidth-100, windowHeight-100);
	background(220);
	frameRate(60);
	flag = true;
	monsters = [];
}

function draw() {
	background(240);
	if (flag) {
		if (frameCount % 60 == 0) createMonster (random(0, width), random(0, height));
		detectCollision();
		borderControl();
		displayMonsters();
	}
}

function keyPressed() {
	if (key == ' ') flag = !flag;
}

function mousePressed() {
	createMonster(mouseX, mouseY);
}

function borderControl() {
	for (let aMonster of monsters) {
		aMonster.walk();
		if (aMonster.position.x > width+50 || aMonster.position.x < -50 ||
			aMonster.position.y > height+50 || aMonster.position.y < -50) {

			aMonster.reposition();
		}
	}
}

function displayMonsters() {
	for (let aMonster of monsters) {
		aMonster.display();
	}
}

function detectCollision() {
	let curr = 0;
	while (curr < monsters.length) {
		let currMon = monsters[curr];

		let incement = true;

		let other = curr + 1;
		while (other < monsters.length) {
			let otherMon = monsters[other];

			if (checkCollision(currMon.position, otherMon.position, currMon.width, otherMon.width)) {

				let isHigherRank;
				if (currMon.rank == otherMon.rank) 
					isHigherRank = currMon.timestamp > otherMon.timestamp;
				else 
					isHigherRank = currMon.rank > otherMon.rank;

				if (isHigherRank) {
					currMon.devour(otherMon);
					monsters.splice(other,1);
					continue;
				}
				else {
					otherMon.devour(currMon);
					monsters.splice(curr,1);
					break;
				}
			}
			++other;
		}
		if (incement) ++curr;
	}
}

function checkCollision(p1, p2, w1, w2) {
	let distance = p1.dist(p2);
	let totalRad = (w1 - 10)/2 + (w2 - 10)/2;
	return distance < totalRad;
}

function createMonster(x, y) {
	r = random(0, 255);
	g = random(0, 255);
	b = random(0, 255);
	genVelocity();
	aMonster = new Monster(createVector(x, y), velocity, direction, r, g, b, 255);
	monsters.push(aMonster);
}

function genVelocity() {
	direction = int(random(0,4));
	if (direction == 0) velocity = createVector(random(0,1), random(-1,1)); // Heading East
	else if (direction == 1) velocity = createVector(random(-1,1), random(0,1)); // Heading South
	else if (direction == 2) velocity = createVector(random(-1, 0), random(-1,1)); // Heading West
	else velocity = createVector(random(-1,1), random(-1,0)); // Heading North
	velocity.normalize();
}



