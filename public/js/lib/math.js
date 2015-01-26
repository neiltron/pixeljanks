//Get Distance between two points. Point(x,y) -> Z.
function distance(e,t){var n=0;var r=0;n=t.x-e.x;n=n*n;r=t.y-e.y;r=r*r;return Math.sqrt(n+r)}

//Convert a color hex to rgb. "#FFFFFF" -> '255,255,255'
function hexToRgb(e){var t=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);return t?String(parseInt(t[1],16) + ',' + parseInt(t[2],16) + ',' + parseInt(t[3],16)):null}

//Get the Angle between two Points. Point(x,y), Point(x,y) -> Z.
function angle(p1,p2){return Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;}

//Determins whether or not a value is odd. Value -> True/False.
function isOdd(num) { return num % 2;}