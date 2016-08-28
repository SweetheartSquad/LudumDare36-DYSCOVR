function getArtifact(_seed){
	var rng=seed(_seed);

	var g = new PIXI.Graphics();

	var p=levyCurve(
		{start_size:5,
		iterations:5+rng()*5,
		degradation:0
	});
	var p=fractalCurve({
		start_path:[0,0,0,8],
		iterations:4+rng()*4,
		degradation:rng()*1,
		angle:90+10*rng()
	});


	// scale points
	var scale=[rng()+0.5,rng()+0.5];
	for(i=0;i<p.length-1;i+=2){
		p[i]*=scale[0];
		p[i+1]*=scale[1];
	}

	// get bounds
	var bounds=[999999,9999999,0,0];
	for(i=0;i<p.length-1;i+=2){
		bounds[0]=Math.min(bounds[0],p[i]);
		bounds[2]=Math.max(bounds[2],p[i+1]);
		bounds[1]=Math.min(bounds[1],p[i]);
		bounds[3]=Math.max(bounds[3],p[i+1]);
	}


	// offset points
	var offset=[rng()*64-rng()*64,rng()*64-rng()*64];

	for(i=0;i<p.length-1;i+=2){
		p[i]+=offset[0];
		p[i+1]+=offset[1];
	}

	// reflect points
	var reflect_count=Math.floor(rng()*3)+1;

	for(r=0;r<reflect_count;++r){
		var l=p.length;
		var reflection_ratio=Math.floor(1+rng()*15);
		var v=[
			p[Math.round(l/reflection_ratio)-2]-p[0],
			p[Math.round(l/reflection_ratio)-1]-p[1]
		];
		for(i=l-2;i>=0;i-=2){
			var t=reflect([p[i],p[i+1]],v)
			p.push(t[0]);
			p.push(t[1]);
		}
	}




	var center=[0,0];
	for(i=0;i<p.length-1;i+=2){
		center[0]+=p[i];
		center[1]+=p[i+1];
	}
	center[0]/=p.length/2;
	center[1]/=p.length/2;


	/*
	// lines
	g.beginFill(rgb(0,0,0),1);
	g.moveTo(p[0],p[1]);
	for(i=2;i<p.length-1;i+=2){
		g.lineStyle(1, rgb(80,50,40), 1);
		g.lineTo(p[i],p[i+1]);
		//g.drawCircle(p[i],p[i+1],2);
	}
	g.lineStyle(1, rgb(80,50,40), 1);
	g.lineTo(p[0],p[1]);
	g.endFill();
	*/


	/*g.beginFill(rgb(20,10,30),1);
	g.lineStyle(0, rgb(200,150,100), 1);
	g.drawPolygon(p);
	g.endFill();*/


	var triangles=[];
	for(i=0;i<p.length-2;i+=2){
		triangles.push([0,0,
			p[i],p[i+1],
			p[i+2],p[i+3]
		]);
	}
	
	g.beginFill(rgb(20,10,30),1);
	g.lineStyle(0, rgb(200,150,100), 1);
	for(i=0;i<triangles.length;++i){
		g.beginFill(rgb(20+triangles[i][2],10+triangles[i][3],30),1);
		g.drawPolygon(triangles[i]);
	}
	g.endFill()



	//start point
	g.beginFill(rgb(0,0,100),0.5);
	g.lineStyle(2, rgb(200,150,100), 0.5);
	g.drawCircle(p[0],p[1],5);
	g.endFill();
	//end point
	g.beginFill(rgb(0,0,100),0.5);
	g.lineStyle(2, rgb(200,150,100), 0.5);
	g.drawCircle(p[p.length-2],p[p.length-1],5);
	g.endFill();


	// points
	/*for(i=0;i<p.length-1;i+=2){
		g.beginFill(rgb((80+i)%128+128,50,40),1);
		g.lineStyle(0, rgb(40,50,20), 1);
		g.drawCircle(p[i],p[i+1],2);
		g.endFill();
	}*/


	g.pivot.x=center[0];
	g.pivot.y=center[1];
	//g.rotation=-0.5*Math.sin(Date.now()/1000);

	g.x=size[0]/2;
	g.y=size[1]/2;

	return g;
}