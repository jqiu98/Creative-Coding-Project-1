class Monster extends Ghost { // Inheritance from Ghost
	constructor(ID, position, velocity, direction, r, g, b, a) {
		super(position, velocity, direction, r, g, b, a); // Calls parent constructor
		this.ID = ID;
		this.init_velocity = velocity; // The inital velocity to used as a base for actual velocity
		this.speed = 10; // Multilier for the velocity
		this.rank = 1; // Level/Rank of the Monster
		this.trailEffect = int(random(0,4)); // Random innate effect for the trail left behind
											 // 0: Nothing
											 // 1: Sluggy - Slows enemies
											 // 2: Sticky - Stops enemies
											 // 3: Toxic/Poison - Decrements rank of enemies
		this.slowed = false; // Slow afflicted status
		this.stuck = false; // Stuck afflicted status

		// Two arrays are used below so we only decrement once per path intersect
		this.currPoisonID = []; // Array to hold all poison paths we are/was on
		this.newPoisonID = []; // Array to hold all poison paths we are/will be on

		this.updateVelocity(); // Update the velocity of the monster
		this.updateSize(); // update the Size of the monster

		this.timestamp = frameCount; // Time created
		this.lap = 0; // How many times the monster looped off screen
		this.ghost = null; // Dependant instance of parent Ghost: Used to help rank up the monster

		// Current path of the monster until it loops off screen
		this.currTrail = [this.position.copy(),  // Start position
						  this.position.copy(), // End position
						  this.velocity.copy().mult(1.5), // path's velocity
						  this.direction]; // Path's direction

		this.allTrail = []; // Array holding all the paths of the monster made thus far
		this.allTrail.push(this.currTrail); // Adding current path into all path
	}

	display() { // Draw the monster
		this.displayTrail(); // Draw the trails made thus far
		super.display(); // Call parent method
		if (this.ghost != null) this.ghost.display(); // Draw the ghost if it exists
	}

	displayTrail() { // Draws the monster's path
		let statusColor = color(240);
		switch (this.trailEffect) {
			case 1:
				statusColor = color(51, 48, 47, 30);
				break;
			case 2:
				statusColor = color(212, 155, 0, 30);
				break;
			case 3:
				statusColor = color(4, 186, 7, 30);
				break;
		}
		for (let aTrail of this.allTrail) { // Loops through all the paths made thus far
			push();
			translate(aTrail[0].x, aTrail[0].y);
			rotate(aTrail[2].heading());


			let dist = aTrail[0].dist(aTrail[1]);

			strokeWeight(3);
			stroke(statusColor);
			line(0, -3, dist, -3);
			line(0, 3, dist, 3);

			strokeWeight(3);
			stroke(this.r, this.g, this.b, 50);
			line(0, 0, dist, 0);
			pop();
		}
	}

	move() { // Update the position
		if (this.trailEffect != 3) this.checkPoison(); // Check for poison status
		if (!this.stuck) { // Not afflicted with stuck status
			super.move(); // Call parent method
			this.currTrail[1].x += this.velocity.x; // Update current path's end x-position
			this.currTrail[1].y += this.velocity.y; // Update current path's end y-position
		}
		if (this.ghost != null) this.updateGhost(); // Update ghost's position if exist
	}

	updateVelocity() { // Update velocity based on the current speed multiplier
		this.velocity = p5.Vector.mult(this.init_velocity, this.speed);
	}

	updateSize() { // Update the size based on the current rank
		this.size = 14 + this.rank;
		this.width = 4 * this.size;
		this.height = 3 * this.size;
	}


	poison(ID) { // Add the ID of a poison path we are currently on
		if (this.trailEffect != 3) this.newPoisonID.push(ID);
	}

	checkPoison() { // Checking if we got poisoned and updating accordingly
		if (this.newPoisonID.length > 0) { // If we are poisoned
			let i = 0; // Previously poisoned index
			let j = 0; // Currently poisoned index
			while (i < this.currPoisonID.length && j < this.newPoisonID.length) {
				if (this.currPoisonID[i] == this.newPoisonID[j]) { // Currently posioning so don't count it again
					++i;
					this.newPoisonID.shift();
				}
				else if (this.currPoisonID[i] < this.newPoisonID[j]) this.currPoisonID.shift(); // No longer on that poisoned path
				else ++j;
				}
			// Go back through the corrected new poisoning IDs and updating accordingly
			j = 0;
			while (j < this.newPoisonID.length) {
				this.currPoisonID.push(this.newPoisonID[j++]);
				this.rankDown();
			}
		}
		else this.currPoisonID = []; // Not on any poisoned paths anymore
	}

	rankDown() { // Decrements rank accordingly
		if (this.rank > 1) { // Cannot go lower than rank 1
			--this.rank;
			this.updateSize; // Update size since rank was changed
		}
	}

	slow() { // Update the slowed status
		if (this.trailEffect!= 1 && !this.slowed) { // If not already afflicted, update accordingly
			this.slowed = true;
			this.speed /= 2;
			this.updateVelocity(); // Update the velocity since speed was changed
		}
	}

	stick() { // Update the stuck status
		if (this.trailEffect != 2) this.stuck = true;
	}

	clearStatus() { // Clears all status afflictions and reset for the next draw loop
		if (this.slowed) {
			this.slowed = false;
			this.speed *= 2;
			this.updateVelocity();
		}
		if (this.stuck) this.stuck = false;
		if (this.trailEffect != 3) this.newPoisonID = [];
	}

	// Set up to keep track of a new path
	addTrail(isLap) { // isLap -> boolean to see if due to lapping off border or from ranking up
		this.currTrail = [this.position.copy(), // Start position
						  this.position.copy(), // End position
						  this.velocity.copy().mult(1.5), // Path velocity
						  this.direction]; // Path direction

		this.allTrail.push(this.currTrail); // Add into all paths
		
		if (isLap) ++this.lap; // Increment the times we've looped/repositioned

		// Creates a ghost based on the amount of times looped
		if (this.lap == 2 && this.ghost == null) this.createGhost();
	}

	reposition() { // Monster moved out of the window border, so we reposition
		this.direction = int(random(0,4)); // Pick a random direction to head
		switch (this.direction) {
			case 0: // Left Screen Start (Heading East)
				this.position.x = 0;
				this.position.y = random(0, height);
				this.init_velocity = createVector(random(0,1), random(-1,1));
				break;
			case 1: // Top Screen Start (Heading South)
				this.position.x = random(0, width);
				this.position.y = 0;
				this.init_velocity = createVector(random(-1,1), random(0,1));
				break;
			case 2: // Right Screen Start (Heading West)
				this.position.x = width;
				this.position.y = random(0, height);
				this.init_velocity = createVector(random(-1, 0), random(-1,1));
				break;
			case 3: // Bottom Screen Start (Heading North)
				this.position.x = random(0, width);
				this.position.y = height;
				this.init_velocity = createVector(random(-1,1), random(-1,0));
				break;
		}
		this.init_velocity.normalize(); // Normalize the velocity to standardize it within 1 length
		this.updateVelocity(); // Update current velocity
		this.addTrail(true); // Set up for the new path
	}

	createGhost() { // Creates a the dependant ghost
		this.ghost = new Ghost(this.allTrail[0][0], this.allTrail[0][2], this.allTrail[0][3], 
								this.r, this.g, this.b, 0);
		this.ghost.width = this.width; // Match the width for the ghost
		this.ghost.height = this.height; // Match the height for the ghost
	}

	updateGhost() { // Updates the ghost to move if ready
		if (this.ghost.a < 50) ++this.ghost.a; // See if ghost is ready to move based on alpha value
		else this.eatTrail(); // Ready to move, ghost starts to eat the trails/paths
	}

	eatTrail() { // Ghost eats up the paths created thus far
		this.ghost.move(); // Moves the ghost
		if (this.checkTrail()) { // Check if the ghost reached the end of a path
			if (this.allTrail.length > 1) { // If there are more paths left
				// Remove the eaten path and head to the next one - updating respective values
				this.allTrail.shift();
				this.ghost.position = this.allTrail[0][0];
				this.ghost.velocity = this.allTrail[0][2];
				this.ghost.direction = this.allTrail[0][3];
			}

			else this.rankUp(); // the ghost caught up to the real one so we rank up
		}
	}

	checkTrail() { // Returns boolean if the ghost has eaten to the end of a path
		if (this.ghost.direction == 0) return (this.allTrail[0][0].x > this.allTrail[0][1].x);
		else if (this.ghost.direction == 1) return (this.allTrail[0][0].y > this.allTrail[0][1].y);
		else if (this.ghost.direction == 2) return (this.allTrail[0][0].x < this.allTrail[0][1].x);
		else return (this.allTrail[0][0].y < this.allTrail[0][1].y);
	}

	rankUp() { // Rank up the monster & reset everything needed to make another ghost
		this.lap = 0; // Reset the counter used for the ghost creation
		++this.rank; // Increment the monster's rank
		this.updateSize(); // Update the size since rank has been changed
		if (this.speed > 5) { // Minimum speed of 5
			this.speed -= 0.5; // Decrement the speed since the monster is bigger
			this.updateVelocity; // Update the velocity since speed has been changed
		}

		this.ghost = null; // Point to null so garbage collector can delete the ghost
		this.addTrail(false); // Setup for a new path
	}

	devour(enemy) { // Eat another monster and take their rank
		this.rank += enemy.rank; // Increment our rank based on the enemy eaten
		this.updateSize(); // Update the size since rank has been changed
	}
}
