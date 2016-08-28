
// levy C curve fractal
function levyCurve(options){
	options.start_path=[0,0,options.start_size];
	options.angle=90;
	return fractalCurve(options);
}

// 1. copies start_path
// 2. rotates copy by angle
// 3. appends copy to end of path
// each iteration
// 
// points are degraded during rotation
function fractalCurve(options){
	var rng=seed(10);

	var p=options.start_path.slice();
	for(i=1;i<options.iterations;++i){
		var end=p.length;

		for(j=0;j<end-1;j+=2){
			var a=[p[j],p[j+1]];
			var b=rotate(a,options.angle);
			
			p.push(p[end-2]+b[0]+rng()*options.degradation);
			p.push(p[end-1]+b[1]+rng()*options.degradation);
		}
	}

	return p;
}