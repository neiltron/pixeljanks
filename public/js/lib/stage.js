function Stage(canvas) {
	this.canvas = canvas;
	this.context = canvas.getContext('2d');
	this.displayObjects = [];

	this.width = 0;
	this.height = 0;
	this.numChildren = 0;
	this.trailing = 0;

	this.responsiveScale=-1;

	this.animationFrame = 0;
	this.animationFrameRate = 0;
	this.animationLastRun;
	this.showFps = false;

	this.init();
}

Stage.prototype = {
	init: function() {
		this.fps = 60;
		this.displayMax = 600;
		this.engine();
	},

	engine: function() {
		var that = this;

		if(!that.animationLastRun) {
			that.animationLastRun = new Date().getTime();
			requestAnimationFrame(function(){that.engine()});
			return;
		}

		var delta = (new Date().getTime() - that.animationLastRun)/1000;
        that.animationLastRun = new Date().getTime();
        that.animationFrameRate = 1/delta;

		setTimeout(function() {
	        that.animationFrame = requestAnimationFrame(function(){that.engine()});
	        that.render();

	        if(that.showFps) {
	        	document.getElementById('framerateDiv').innerHTML = 'frame: ' + Math.floor(that.animationFrame);
	        	document.getElementById('framerateDiv').innerHTML += '<br/>' + 'fps: ' + Math.floor(that.animationFrameRate);
	        	document.getElementById('framerateDiv').innerHTML += '<br/>' + 'w: ' + that.width;
	        	document.getElementById('framerateDiv').innerHTML += '<br/>' + 'h: ' + that.height;
	        }
	    }, 1000 / this.fps);

	},

	frameHandler: function(e) {
		e.stage.render();
	},

	render: function() {
		this.width = this.canvas.width;
		this.height = this.canvas.height;

		if(this.responsiveScale==-1){
	    	this.setScale();
	    	this.getAverages();

	    	Settings.particle.lines.range *= this.responsiveScale;
	    }

		if(this.trailing==0||this.trailing>1) {
			this.context.clearRect(0, 0, this.width, this.height);
		} else {
			this.context.globalAlpha = 1-this.trailing;
			this.context.fillStyle = Settings.canvas.color;
		    this.context.fillRect(0,0,this.width,this.height);
		    this.context.globalAlpha = 1;
		}

		if(this.displayObjects.length>0) {
			for (var i=0; i<this.displayObjects.length ; i++) {
				var dO = this.displayObjects[i];
				if (typeof dO.render == 'function') {
				    dO.render();
				}
			};
		}
	},

	setScale: function() {
		if(this.width>640) {
			this.responsiveScale = 1;
		} else if(this.width<640 && this.width>320) {
			this.responsiveScale = this.width/900;
		} else if(this.width<=320) {
			this.responsiveScale = this.width/640;
		}
	},

	getAverages: function(){
		if(canvas.width>1000) {
	        averageMoleculesOnScreen = 200;
	        extraMoleculesOnScreen = 100;
	    } else if(canvas.width<1000 && canvas.width>640) {
	        averageMoleculesOnScreen = 120;
	        extraMoleculesOnScreen = 800;
	    } else if(canvas.width<640) {
	        averageMoleculesOnScreen = 60;
	        extraMoleculesOnScreen = 60;
	    }
	},

	flash: function() {
		this.context.globalAlpha = 0.2;
		this.context.fillStyle = '#b03271';
		this.context.fillRect(0,0,this.width,this.height);
		this.context.globalAlpha = 1;
	},

	addChild: function(displayObject) {
		if(this.displayObjects.length>this.displayMax && console && console.warn){
			console.warn("Warning: There are currently more elements on the stage than reccomended.");
		}

		displayObject.registerStage(this);
		this.displayObjects.push(displayObject);
		this.numChildren = this.displayObjects.length;
	},

	indexOf: function(child) {
		return stage.displayObjects.indexOf(child);
	},

	removeChild: function(child) {
		var index = this.indexOf(child);
		if(index!==-1) {
			this.removeChildildrenAt(index,1);
		}
	},

	removeChildildrenAt: function(index, range) {
		stage.displayObjects.splice(index,range);
		this.numChildren = this.displayObjects.length;
	},

	dieSome: function(amount, f) {
		var from = (f==undefined) ? 0 : f;

		for (var i = from; i < from+amount-1 ; i++) {
			var randomMolecule = this.getChildAt(i);
			//this.removeChild(randomMolecule);
			randomMolecule.behavior = new DieOutBehavior();
			//randomMolecule.die();
		};
	},

	getChildAt: function(index) {
		return this.displayObjects[index];
	},

	setBehavior: function(behavior) {
		for (var i = 0 ; i < this.displayObjects.length ; i++) {
			this.displayObjects[i].behavior = behavior;
		};
	},

	//Set in wich shape the molecules should morph.
	// * shape: A Molecule Scanner approved Shape.
	// * leftOver: how many particles should stay on the stage after morphing.
	setShape: function(shape, leftOver, startFromBottom, speed) {
		//Get the data of the future molecules from the param object.
		var moleculeData = shape.molecules;

		//If there are still molecules on the stage, pending to
		//be destroyed, they should be so now.
		for (var i = stage.numChildren - 1; i >= 0; i--) {
		 	var checkMolecule = stage.getChildAt(i);

		 	console.log(checkMolecule.behavior.name);
		 	if(checkMolecule.behavior.name="explode") {
		 		if(checkMolecule.behavior.mustDie) {
		 			checkMolecule.die();
		 			console.log('fixed a molecule to die');
		 		}
		 	}
		 };

		//Calculate the difference between current molecules and the target count.
		var diff = (this.numChildren-leftOver) - moleculeData.length;

		if(diff>0) {
			//If there are too many molecules, we'll remove them so they don't
			//end up wondering about, doing nothing.
	        this.removeChildildrenAt(leftOver+shape.molecules.length, diff);

	    } else if(diff<0) {
	    	//When there are too few molecules on the stage we'll calculate how many
	    	//more are needed to get things started, and then create them on the spot.
	        diff = Math.abs(diff);
	        for (var i=0; i<(diff); i++) {
	            this.createShapeMolecule(leftOver);
	        }
	    } else if(diff==0) {
	    	//If there is no difference, then no molecules
	    	//should be added or deleted.
	    }

	    //This&That scope-fix.
	    var that = this;

    	var statement ;
	    var i = 0;

	    //Whatever the starting index is we'll be using,
	    //depends on wich starting side the user chose in the params.
	    if(startFromBottom) {
	    	i = (moleculeData.length+leftOver);
	    } else {
	    	i = leftOver;
	    }

	    //Initiate the first frame of the animation rundown.
	    //(This will automatically trigger the requestAnimationFrame loop.)
	    animate();

	    function animate() {
	    	//Whatever the condition is to be true for looping the animationLoop
	    	//depends on wich starting side the user chose in the params.
	    	if(startFromBottom) {
				statement = i>leftOver;
			} else {
				statement = i<(moleculeData.length+leftOver);
			}

			// ... when that statement is true ...
	        if(statement) {
	        	//the range is the speed we'll affect molecules by.
	        	//It holds how many molecules we'll modify per frame.
	        	var range = speed;

	        	//Adjust the range when we run towards the end of the
	        	//molecule data array. It could be the case we don't have enough
	        	//so we'll need to work with what we still have left in the array.
	        	if(startFromBottom) {
	        		if((i-range)<(leftOver)) {
		        		range = leftOver-i;
		        	}
	        	} else {
		        	if((i+range)>(moleculeData.length+leftOver)) {
		        		range = (moleculeData.length+leftOver) - i;
		        	}
		        }

	        	//We'll need to add/substract the range, we just used, to the loop index.
		        //It should know we handled off a few molecules simultaniously.
	        	if(startFromBottom){
	        		i-= range;
	        	}
	        	//For every step in the range we set, we'll modify a molecule.
	        	for (var k=0; k < range ; k++) {
		        	var data = moleculeData[(i+k)-leftOver];
		            var m = that.getChildAt(i+k);

		            var targetX = (data.x*900)*that.responsiveScale;
		            var targetY = (data.y*600)*that.responsiveScale;

		            //targetY -= 20*that.responsiveScale;

		            m.target(targetX,targetY);

		           	m.behavior = [];

		            m.behavior.push(new MorphBehavior());
		          	m.behavior.push(new GrowBehavior());
		            m.behavior.push(new ViberBehavior(Math.round(8*that.responsiveScale)));
		            m.behavior.push(new ColorBehavior(Settings.particle.shape.color, 15));

		            m.radius = 8 - distance({x:data.x*900, y:data.y*600},{x:0,y:0})/40;
		            m.radius *= that.responsiveScale;

		        }

		        //We'll need to add/substract the range, we just used, to the loop index.
		        //It should know we handled off a few molecules simultaniously.
	            if(!startFromBottom) {
	            	i += range;
	            }

	        	requestAnimationFrame(function(){animate()});
	        } else {
	        	return;
	        }
	    }
	},

	createShapeMolecule: function(searchFrom) {
		//Pick a random number starting from the position you are allowed to search in,
		//to the maximum that is defined by the stage size (minus the allowed start position).
		var scope = searchFrom + Math.floor(Math.random() *(this.numChildren-searchFrom-1));

		//Select that specific molecule from the stage.
		var searcher = this.getChildAt(scope);

		//Use the searched molecule's data to create a new molecule with the same appearence,
		//by setting the constructor variables like so.
	    var newShapeMolecule = new Molecule(searcher.x,searcher.y, searcher.radius);

	    //The new molecule should have the same appearence and behavior so it doesn't look
	    //like a molecule was split (duplicated).
	    newShapeMolecule.behavior = searcher.behavior;
	    newShapeMolecule.color = searcher.color;
	    newShapeMolecule.alpha = searcher.alpha;

	    //All new shape molecules shouldn't be allowed to draw lines.
	    //They are foreground material.
	    newShapeMolecule.drawLines = false;

	    //We can now finally trust this suspicious molecule to the stage.
	    this.addChild(newShapeMolecule);
	},

	setTimeout: function(frames, callback) {
		var timer = 0;
		function tick() {
			if(timer<frames) {
				timer++;
				requestAnimationFrame(function(){tick()});
			} else {
				callback();
			}
		}
		tick();
	}
}