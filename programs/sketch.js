// GLOBALS
let pause; // flag to toggle screen pause
let monsters; // Array of monsters created
let ID; // Generate unique ID for all monsters

// These are variables first declared so we aren't redeclaring them multiple times as 
// they are used quite often
let r, g, b; // red, green, blue values
let direction; // Heading direction
let velocity; // velocity
let aMonster; // For the creation of a Monster class


function setup() {
	createCanvas(windowWidth, windowHeight);
	background(240);
	frameRate(60);
	pause = false; // Initialize pause to false
	monsters = []; // Initialize the array of Monsters
	ID = 0;
}

function draw() {
	background(240);
	if (!pause) { // Movement not paused
		// Creates a monster every second (frameRate is set to 60fps)
		if (frameCount % 60 == 0) createMonster (random(0, width), random(0, height));
		detectCollision(); // Check for collision detection between all monsters
		moveMonsters(); // move the monsters
	}
	displayMonsters(); // Draw the monsters and basically the entire state
}

function moveMonsters() { // Move the monsters & make sure they're within the screen
	for (let aMonster of monsters) {
		for (let otherMonster of monsters) {
			if (aMonster != otherMonster) {
				for (let aTrail of otherMonster.allTrail) { // Going through all the paths
					if (circleLineCollision(aTrail[0], aTrail[1], aMonster.position, aMonster.width/2)) {
						switch (otherMonster.trailEffect) {
							case 1: // 1: Sluggy
								aMonster.slow();
								break;
							case 2: // 2: Sticky
								aMonster.stick();
								break;
							case 3: // 3: Toxic/Poison
								aMonster.poison(otherMonster.ID);
								break;
						}
					}
				}
			}
		}
		aMonster.move();
		aMonster.clearStatus();

		// Check if they've gone off screen
		if (aMonster.position.x > width + aMonster.width/2 || 
			aMonster.position.x < -aMonster.width/2 ||
			aMonster.position.y > height + aMonster.width/2 || 
			aMonster.position.y < -aMonster.width/2)
		{
			aMonster.reposition(); // Reposition them if they've gone off screen
		}
	}
}

function circleLineCollision(p1, p2, pCheck, radius) {
	let slopeVec = p5.Vector.sub(p2, p1); // Slope formula via vectors
	let m = slopeVec.y / slopeVec.x; // Finding slope: y = mx + b
	let b = p1.y - p1.x * m; // Finding y-interect: y = mx + b

	// Change y = mx +b into standard form Ax + By + C = 0 and calculate for A, B, C
	let A = -slopeVec.y;
	let B = slopeVec.x; 
	let C = -slopeVec.x * b;

	// Use point-line distance formula
	let dist = abs(A*pCheck.x + B*pCheck.y + C) / sqrt(A**2 + B**2) // distance to nearest point on line
	return dist < radius; // See if there is circle-line collision
}

function displayMonsters() { // Draw the monsters
	for (let aMonster of monsters) {
		aMonster.display();
	}
}

function detectCollision() { // Check for collisions between monsters
	let curr = 0; // Index for the monster being focused on
	while (curr < monsters.length) { // Loop through all the monsters to be focused
		let currMon = monsters[curr]; // Pick out the focused monster

		let incement = true; // Flag to see if we need to increment to the next monster to focus

		let other = curr + 1; // Index for the other monster we are checking against
		while (other < monsters.length) { // Loop through the rest of the monsters to check against
			let otherMon = monsters[other]; // Pick out the other monster
			// Check if they've collided
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

function checkCollision(p1, p2, w1, w2) { // Checks for collision between two objects (monsters)
	let distance = p1.dist(p2); // Euclidean distance
	let totalRad = (w1 - 10)/2 + (w2 - 10)/2; // Total radius of both (hitbox also made smaller)
	return distance < totalRad; // Distance < total radius means they've collided
}

function createMonster(x, y) { // Create a monster based on location x, y 
	// generate a random color
	r = random(0, 255);
	g = random(0, 255);
	b = random(0, 255);
	genVelocity(); // Generate a random velocity & direction
	aMonster = new Monster(ID++, createVector(x, y), velocity, direction, r, g, b, 255); // Create the monster
	monsters.push(aMonster); // Add it to the global array
}

function genVelocity() { // Generates a random velocity & distance
	direction = int(random(0,4)); // Random direction
	switch (direction) { // Random velocity based on the direction
		case 0:
			velocity = createVector(random(0,1), random(-1,1)); // Heading East
			break;
		case 1:
			velocity = createVector(random(-1,1), random(0,1)); // Heading South
			break;
		case 2:
			velocity = createVector(random(-1, 0), random(-1,1)); // Heading West
			break;
		case 3:
			velocity = createVector(random(-1,1), random(-1,0)); // Heading North
			break;
	}
	velocity.normalize(); // Normalize the velocity to standardize it within 1 length
}

