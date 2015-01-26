function applyGravity(speed, f, t) {
    var speed = (speed==undefined) ? 1 : speed;
    var from = (f==undefined) ? 0 : f;
    var till = (t==undefined) ? stage.numChildren : t;

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
                molecule.behavior = new GravityBehavior(molecule.radius*2, molecule.radius*8);
                molecule._velocityX = -10 + Math.random()*20;
            }

            requestAnimationFrame(function(){animate()});
        } else {
            return;
        }
    }
    animate();
}