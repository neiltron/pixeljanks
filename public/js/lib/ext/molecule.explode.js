function explodeBackground() {
    explode(30,0, initBackgroundMolecules);
}

function explodeForeground() {
    explode(30,initBackgroundMolecules);
}

function explode(v, f, t, c) {
    var force = (v==undefined) ? 30 : v;
    var from = (f==undefined) ? 0 : f;
    var till = (t==undefined) ? stage.numChildren : t;
    var center = (c==undefined) ? {x:0,y:0} : c;

    for (var i = from ; i <(till) ; i++) {
        var molecule = stage.getChildAt(i);
        var angleFromCenter = angle(center,molecule);
        molecule.behavior = new ExplodeBehavior(force/2 + Math.random()*(force/2), angleFromCenter, 280);
    };
}