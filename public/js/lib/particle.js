function Particle(x,y,r) {
	this.x = (x==undefined) ? 0 : x;
	this.y = (y==undefined) ? 0 : y;
	
	this.radius = (r==undefined) ? Settings.particle.shape.maxSize : r;
	this._radius = this.radius;

	this.scale = 1;
	this.color = Settings.particle.shape.color;
	this._color = this.color;

	this.alpha = 1;
	this._alpha = this.alpha;

	this.stage = null;
	this.drawLines = false;
	this.drawToNext=false;
}

Particle.prototype = {
	render: function() {
		if(this.stage) {
			this.centerX = this.stage.canvas.width/2;
			this.centerY = this.stage.canvas.height/2;

			if(this.drawLines==true) {
				if(Settings.particle.lines.enabled) {
					for (var i = 0; i < this.stage.numChildren; i++) {
						var otherMolecule = this.stage.displayObjects[i];

						if(otherMolecule.drawLines==true) {
							var distanceFromMolecule = distance(this,otherMolecule);

							if(distanceFromMolecule<(Settings.particle.lines.range)) {
								//if(distanceFromMolecule<(Settings.particle.lines.range) && this.radius>=2 && otherMolecule.radius>2) {
					
								this.stage.context.strokeStyle = 'rgba(' + Settings.particle.lines.rgb + ','+0.1*(1-(distanceFromMolecule/(Settings.particle.lines.range)))+')';
								this.stage.context.lineWidth = 2;
								this.stage.context.beginPath();
								this.stage.context.moveTo(this.centerX+(this.x*this.scale),this.centerY+(this.y*this.scale));
								this.stage.context.lineTo(this.centerX+(otherMolecule.x*otherMolecule.scale),this.centerY+(otherMolecule.y*otherMolecule.scale));
								this.stage.context.stroke();
							}
						}
					};
				}
			}

			if(Settings.particle.shape.enabled) {
				this.stage.context.globalAlpha = this.alpha;
				this.stage.context.fillStyle = this.color;
				this.stage.context.beginPath();
				this.stage.context.arc(this.centerX+(this.x*this.scale),this.centerY+(this.y*this.scale),this.radius*this.scale,0,Math.PI*2,true);
				this.stage.context.closePath();
				this.stage.context.fill();
			}
		}
	},

	registerStage: function(stage) {
		if(!this.stage)
			this.stage = stage;
	}
}