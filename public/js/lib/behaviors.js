/* Molecule Viber Behavior
 *
 * This Behavior makes the molecule wiggle within a certain scope of pixels around it's position.
*/

var ViberBehavior = function(scope, free) {
	this.name = 'viber';
	this.scope = (scope==undefined) ? 5 : scope;
	this.free = (free==undefined) ? false : true;
}

ViberBehavior.prototype = {
	behave: function(molecule) {

		molecule.offsetX = Math.floor((Math.random()*this.scope)-this.scope/2);
		molecule.offsetY = Math.floor((Math.random()*this.scope)-this.scope/2);
		
		if(this.free) {
			molecule.x = molecule._x + molecule.offsetX;
			molecule.y = molecule._y + molecule.offsetY;
		}
	}
}



/* Molecule Wind Behavior
 *
 * This Behavior makes the molecule move with the wind.
*/

var WindBehavior = function(speed, direction) {
	this.name = 'wind';
	this.speed = (speed==undefined) ? 3 : speed;
	this.direction = (direction==undefined) ? 45 : direction;

	this._direction = this.direction;
}

WindBehavior.prototype = {
	behave: function(molecule) {

		molecule._velocityX = (this.speed * Math.cos(this._direction * Math.PI / 180)+molecule.offsetX);
		molecule._velocityY = (this.speed * Math.sin(this._direction * Math.PI / 180)+molecule.offsetY);

		molecule.x +=   molecule._velocityX;
		molecule.y +=   molecule._velocityY;

		if(this.direction !== this._direction) {
			this._direction += (this.direction-this._direction)/40;
		}

		//Make him move between the very left and very right of the screen 
		//and then respawn on the other side if crossed over.
		if(molecule.x > (molecule.stage.width/2)+molecule.radius) {
			molecule.x -= (molecule.stage.width+molecule.radius*2);
		} else if(molecule.x < (molecule.stage.width/-2)) {
			molecule.x += (molecule.stage.width+molecule.radius*2);
		}

		//Make him move between the very top and very bottom of the screen 
		//and then respawn on the other side if crossed over.
		if(molecule.y > (molecule.stage.height/2)+molecule.radius) {
			molecule.y -= (molecule.stage.height+molecule.radius*2);
		} else if(molecule.y < (molecule.stage.height/-2)) {
			molecule.y += (molecule.stage.height+molecule.radius*2);
		}

		//Make the targets the same as the currently drawn position
		//for we don't need a target position.
		molecule._x = molecule.x;
		molecule._y = molecule.y;
	}
}



/* Molecule Gravity Behavior
 *
 * This Behavior makes the molecule fall according to the law of physics.
*/

var GravityBehavior = function(weight, bounceRate) {
	this.name = 'gravity';
	this.weight = (weight==undefined) ? 0.89 : weight;
	this.bounceRate = (bounceRate==undefined) ? 5 : bounceRate;
}

GravityBehavior.prototype = {
	behave: function(molecule) {
		
		if(molecule._velocityX >= 0.1) {
			molecule._velocityX -= 0.05;
		} else if (molecule._velocityX <= -0.1) {
			molecule._velocityX += 0.05;
		}

		if(molecule._velocityX!==0) {
			molecule.x += molecule._velocityX;
		}

		if( molecule._velocityY<this.bounceRate && this.bounceRate>this.weight) {
			molecule._velocityY += this.weight;
		}

		if(molecule._velocityY!==0) {
			molecule.y += molecule._velocityY;
		}

		if(molecule.y>((molecule.stage.height/2)+molecule.radius)) {
			molecule._velocityY *=-1;

			//molecule._velocityX += -1 + Math.random()*2;

			this.bounceRate /= 1.7;
		}

		if(this.bounceRate<=this.weight && molecule._velocityY!==0) {
			molecule._velocityY = 0;
			molecule.y = (molecule.stage.height/2)-molecule.radius;
		}

		if(molecule.x<(molecule.stage.width/-2)) {
			molecule._velocityX *= -1;
		} else if(molecule.x>(molecule.stage.width/2)) {
			molecule._velocityX *= -1;
		} 


		molecule._x = molecule.x;
		molecule._y = molecule.y;
	}
}

/* Molecule Beat Behavior
 *
 * This Behavior makes the molecule beat according to its radius.
*/

var BeatBehavior = function(radius) {
	this.name = 'beat';
	this.pike = (radius==undefined) ? 3 : radius/2;

	this.beatScale = this.pike;
	this.beatSpeed = this.pike/10 ;
	this._radius = radius;
}

BeatBehavior.prototype = {
	behave: function(molecule) {

		if(this.beatScale>1) {
			this.beatScale -= this.beatSpeed;
		} else if(this.beatScale!==1) {
			this.beatScale=1;
		}

		molecule.radius = this._radius*this.beatScale;
	}
}



/* Molecule Morph Behavior
 *
 * This Behavior makes the molecule morph to a specific place
 * that is part of a shape.
*/

var MorphBehavior = function() {
	this.name = 'morph';
	this.scale = 1;

	this.targetX = 0;
	this.targetY = 0;
}

MorphBehavior.prototype = {
	behave: function(molecule) {
		if(this.scale!==molecule.stage.responsiveScale) {
			this.scale = molecule.stage.responsiveScale;
		}
		
		this.targetX = (molecule._x) + molecule.offsetX;
		this.targetY = (molecule._y) + molecule.offsetY;

		if(distance(molecule, {x:this.targetX,y:this.targetY})>1*this.scale) { 
			molecule.x += (this.targetX-molecule.x)/5;
			molecule.y += (this.targetY-molecule.y)/5;
		}
	}
}

/* Molecule Grow Behavior
 *
 * This Behavior makes the molecule grow and shrink between values.
*/

var GrowBehavior = function(max, min, speed) {
	this.name = 'grow';

	this.maxSize = (max==undefined) ? 6 : max;
	this.minSize = (min==undefined) ? 1 : min;
	this.speed = (speed==undefined) ? 0.1 : speed;

	this.scale = -1;
}

GrowBehavior.prototype = {
	behave: function(molecule) {
		if(this.scale!==molecule.stage.responsiveScale) {
			this.scale = molecule.stage.responsiveScale;
			this.speed *= this.scale;
		}

		if(molecule.radius>this.maxSize*this.scale) {
			molecule.radius = this.maxSize*this.scale;
			this.speed *= -1;
		} else if(molecule.radius<this.minSize*this.scale) {
			molecule.radius = this.minSize*this.scale;
			this.speed *= -1;
		}

		molecule.radius += this.speed;
	}
}

/* Color Behavior
 *
 * This Behavior makes the molecule change after a specified amount of frames.
*/

var ColorBehavior = function(color, frames, alpha) {
	this.name = 'color';

	this.color = color;
	this.until = frames;
	this.elapsed = 0;

	this.alpha = (alpha==undefined) ? 1 : alpha;
}

ColorBehavior.prototype = {
	behave: function(molecule) {
		if(this.elapsed>=0) {
			this.elapsed++;
			
		}

		if(this.elapsed>this.until){
			molecule.color = this.color;
			molecule.alpha = this.alpha;
			this.elapsed = -1;
		}
	}
}

/* Explode Behavior
 *
 * This Behavior makes the fire off from it's start position and slowly
 * eases out to the position he'll be when the speed drops to zero.
*/

var ExplodeBehavior = function(value, direction, windDirection, mustDie) {
	this.name = 'explode';

	this.explode = (value!==undefined) ? value : 10;
	this.direction = (direction!==undefined) ? direction : Math.floor(Math.random()*360);
	this.windDirection = (windDirection!==undefined) ? windDirection : 280;
	this.scale = -1;
	this.deceleration = 0.2;
	this.randomRadius = 1 + Math.random()*2;
	this.mustDie = (mustDie!==undefined) ? mustDie : false;
}

ExplodeBehavior.prototype = {
	behave: function(molecule) {
		if(this.scale!==molecule.stage.responsiveScale) {
			this.scale = molecule.stage.responsiveScale;
			this.explode *= this.scale;
			this.deceleration *= this.scale;
		}

		molecule._velocityX = (this.explode * Math.cos(this.direction * Math.PI / 180));
		molecule._velocityY = (this.explode * Math.sin(this.direction * Math.PI / 180));

		molecule.x +=   molecule._velocityX;
		molecule.y +=   molecule._velocityY;


		if(this.explode>this.deceleration) {
			this.explode -= this.deceleration;
			molecule.radius += (molecule._radius-molecule.radius)/10;
		} else if(this.explode!==0) {
			this.explode = 0;
			molecule.radius = molecule._radius;

			if(this.mustDie==true) {
				molecule.die();
			} else {
				molecule.behavior = new WindBehavior(molecule.radius/3,this.windDirection);
			}
			

			//This code above seems to be the reason why the molecules start
			//to behave in a very nice random moving way.
			//
			//I have no idea why.
		}


		//Make him move between the very left and very right of the screen 
		//and then respawn on the other side if crossed over.
		if(molecule.x > (molecule.stage.width/2)+molecule.radius) {
			molecule.x -= (molecule.stage.width+molecule.radius*2);
		} else if(molecule.x < (molecule.stage.width/-2)) {
			molecule.x += (molecule.stage.width+molecule.radius*2);
		}

		//Make him move between the very top and very bottom of the screen 
		//and then respawn on the other side if crossed over.
		if(molecule.y > (molecule.stage.height/2)+molecule.radius) {
			molecule.y -= (molecule.stage.height+molecule.radius*2);
		} else if(molecule.y < (molecule.stage.height/-2)) {
			molecule.y += (molecule.stage.height+molecule.radius*2);
		}
	}
}

/* Line Behavior
 *
 * This Behavior will wiggle between two values and eventually die out.
 * This behavior is a part of the beat-line behavior.
*/

var LineBehavior = function(forceRelative) {
	this.name = 'line';

	this.forceRelative = forceRelative;
	this.level = 0;

	this.t = 0;
	this.e = 2.718281828459;
	this.gedempte = 89;

	this.isSet = false;
	this._amp = 550;
	this._cond = 400;
	this._feed = -10;

	this.step = 0;
}

LineBehavior.prototype = {
	behave: function(molecule) {
		//this.forceRelative = 1;

		if(!this.isSet) {
			this.amp = (this._amp*this.step)*molecule.stage.responsiveScale;
			this.cond = (this._cond*this.step)*molecule.stage.responsiveScale;
			this.feed = (this._feed*this.step)*molecule.stage.responsiveScale;

			//this.forceRelative = 1;
			this.isSet = true;
		}

		if(this.t>0) {
			this.t += 0.005;
			this.level =    -1 * Math.pow(this.e, (this.feed*this.t)) * ((this.amp*this.forceRelative) * Math.cos(this.gedempte*this.t) + (this.cond*this.forceRelative) * Math.sin(this.gedempte*this.t));
		}

		this.targetX = molecule._x + molecule.offsetX;
		this.targetY = molecule._y + molecule.offsetY + this.level;

		molecule.x += (this.targetX-molecule.x)/5;
		molecule.y += (this.targetY-molecule.y)/5;
	},

	pulse: function(step){
		if(step>=0 && step<=1) {
			this.step = step;
		} else {
			this.step = 0;
		}

		this.isSet = false;
		this.level = 0;
		this.t = 0.1;
	}
}

/* DieOut Behavior
 *
 * This Behavior makes the molecule fade out and die.
*/

var DieOutBehavior = function() {
	this.name = 'dieOut';
}

DieOutBehavior.prototype = {
	behave: function(molecule) {
		molecule.x +=   molecule._velocityX;
		molecule.y +=   molecule._velocityY;

		if(Number(molecule.radius.toFixed(1))>0){
			molecule.radius = Number(molecule.radius.toFixed(1)) - 0.1;
		}

		if(Number(molecule.alpha.toFixed(1))>0) {
			molecule.alpha -= 0.02;
		} else {
			molecule.die();
		}
	}
}