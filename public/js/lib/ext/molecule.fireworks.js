var fireFireworks = false;

function fireWorks(callback) {
    var perFireworks = 100;
    fireFireworks = true;

    stage.setTimeout(30, createFireWork);

    function createFireWork() {
        lightning();

        var minSize = Settings.particle.shape.minSize;
        var maxSize = Settings.particle.shape.maxSize;

        var beforeFireworks = stage.numChildren;

        var x = Math.round(Math.random()*stage.width);
        var y = Math.round(Math.random()*stage.height);

        for(var i=0 ; i < perFireworks ; i++) {
            //Calculate random position on the stage.

            //Calculate randomSizedom size per molecule.
            var randomSize = (minSize+ Math.random()*(maxSize-minSize));
            randomSize *= stage.responsiveScale;
            randomSize = (randomSize<1) ? 1 : randomSize;

            //New Molecule with WindBehavior.
            var m = new Molecule(x,y, randomSize);
            m.behavior = [];
            m.behavior.push(new ViberBehavior(Math.round(28*stage.responsiveScale)));

            //Add molecule to the stage.
            stage.addChild(m);
        }  

        for (var i = 0 ; i <perFireworks ; i++) {
            var molecule = stage.getChildAt(beforeFireworks+i);
            var angle = (i/perFireworks)*360;
            molecule.color = "#9e2d65";
            molecule.behavior = [];
            molecule.behavior.push(new ExplodeBehavior(5+Math.round(Math.random()*15), angle, 45, true));
            molecule.behavior.push(new ColorBehavior('#2d1622', 10 + Math.round(Math.random()*15)));
        };

        var wait = 50 + (Math.random()*40);
        stage.setTimeout(wait, function(){
            if(fireFireworks==true){
                createFireWork();
            }
        });
    }

    stage.setTimeout(100, function(){
        callback();
    });
}

function lightning() {
    stage.flash();
    setTimeout(function() {
        stage.flash();
    },85);
}

function stopFireWorks(callback) {
    fireFireworks = false;
    stage.setTimeout(100, function(){
        callback();
    });
}