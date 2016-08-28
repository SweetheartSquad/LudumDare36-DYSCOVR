// converts from rgb (0,255) to 0xRRGGBB
function rgb(r,g,b){
	return (r<<16)+(g<<8)+b;
}

// "random" number generator (replace this later with a proper RNG)
function seed(s) {
    return function() {
        s = Math.sin(s) * 10000;
        return Math.abs(s)%1;
    };
};


// rotates p, an array in the format [x,y] by deg
function rotate(p,deg){
	var radians=deg*Math.PI/180;
	var ca=Math.cos(radians);
	var sa=Math.sin(radians);
	return [ca*p[0]-sa*p[1], sa*p[0]+ca*p[1]];
}

// reflects p, and array in the format [x,y] across v
function reflect(p,v){
	var l=len(v);
	v[0]/=l;
	v[1]/=l;

	var d=dot(p,v);
	return [
		2*d*v[0]-p[0],
		2*d*v[1]-p[1]
	];
}

// vector dot product
function dot(a,b){
	return a[0]*b[0]+a[1]*b[1];
}

// vector length
function len(v){
	return Math.sqrt(v[0]*v[0]+v[1]*v[1]);
}