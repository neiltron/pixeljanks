function Molecule(x,y,r) {
	this.x = this._x = (x==undefined) ? 0 : x;
	this.y = this._y = (y==undefined) ? 0 : y;
	
	this.radius = (r==undefined) ? Settings.particle.shape.maxSize : r;
	this._radius = this.radius;

	this._velocityX = 0;
	this._velocityY = 0;

	this.offsetX = 0;
	this.offsetY = 0;

	this.behavior = null;
}

//Molecule inherits from Particle.
Molecule.prototype = new Particle();

//Reroute the particle render functionality. Required
//when we are using behaviors to modify it's properties.
Molecule.prototype.particleRender = Molecule.prototype.render;

//New render method will apply behaviors.
Molecule.prototype.render = function() {
	if(this.behavior) {
		if(this.behavior.length!==undefined) {
			for (var i = 0; i<this.behavior.length; i++) {
				this.behavior[i].behave(this);
			};
		} else {
			this.behavior.behave(this);
		}
	}

	//call particle render method.
	this.particleRender();
}

Molecule.prototype.target = function(x,y, r) {
	this._x = (x!==null&&x!==undefined) ? x : this._x;
	this._y = (y!==null&&y!==undefined) ? y : this._y;
	this._radius = (r!==null&&r!==undefined) ? r : this._radius;
}

Molecule.prototype.die = function() {
	this.stage.removeChild(this);
}