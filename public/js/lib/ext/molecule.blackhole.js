function  setBlackHole(f, t, spd, callback){
    var from = (f==undefined) ? 0 : f;
    var till = (t==undefined) ? stage.numChildren : t;
    var speed = (spd==undefined) ? 1 : spd;
    var location = {x:0,y:0};

    var i = till;
    function animate() {
        if(i>from) {

            var range = speed;
            if((i-range)<from) {
                range = i-from;
            }

            i-= range;

            //For every step in the range we set, we'll modify a molecule.
            for (var k=0; k < range ; k++) {
                var molecule = stage.getChildAt(i+k);
                molecule.target(location.x,location.y);
                molecule.behavior = [];
                molecule.behavior.push(new MorphBehavior());
                molecule.behavior.push(new GrowBehavior());
                molecule.behavior.push(new ViberBehavior(Math.round(15*stage.responsiveScale)));
            }

            requestAnimationFrame(function(){animate()});
        } else {
            callback();
            return;
        }
    }
    animate();
}