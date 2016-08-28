


// setup inputs
var keys={
	down:[],
	justDown:[],
	up:[],

	LEFT: 37,
	UP: 38,
	RIGHT: 39,
	DOWN: 40,

	clear:function(){
		this.justDown=[];
		this.up=[];
	},


	on_down:function(event){
		if(this.down[event.keyCode]!==true){
			this.down[event.keyCode]=true;
			this.justDown[event.keyCode]=true;
		}
	},
	on_up:function(event){
		this.down[event.keyCode]=false;
		this.justDown[event.keyCode]=false;
		this.up[event.keyCode]=true;
	},

	isDown:function(_key){
		return this.down[_key]===true;
	},
	isJustDown:function(_key){
		return this.justDown[_key]===true;
	},
	isUp:function(_key){
		return this.up[_key]===true;
	}
};

$(window).on("keyup",keys.on_up.bind(keys));
$(window).on("keydown",keys.on_down.bind(keys));


var bgm = new Howl({
	urls:["assets/audio/song.wav"],
	autoplay:true,
	loop:true,
	volume:0
});
bgm.fadeIn(1,3000);

// create renderer
var size = [256, 256];
var renderer = PIXI.autoDetectRenderer(
	size[0],size[1],
	{antiAlias:false, transparent:false, resolution:1,
		roundPixels:true}
);
PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
renderer.backgroundColor = 0x375949;
renderer.view.style.position = "absolute";
renderer.view.style.display = "block";
window.onresize = onResize;

// add the canvas to the html document
$("#display").append(renderer.view);

// create stage a container object 
var scene = new PIXI.Container();


PIXI.loader
	.add("player", "assets/img/player.png")
	.add("bg", "assets/img/bg.png");

PIXI.loader
	.on("progress", loadProgressHandler)
	.load(setup);


function loadProgressHandler(loader, resource){
	// called during loading

	console.log("loading: " + resource.url);
	console.log("progress: " + loader.progress+"%");
}

var game = new PIXI.Container();

function setup(){
	// called when loader completes
	console.log("All files loaded");

	//game
	game.bg = new PIXI.Sprite(PIXI.loader.resources.bg.texture);
	game.bg.width = size[0];
	game.bg.height = size[1];
	game.addChild(game.bg);

	game.player= new PIXI.Sprite(PIXI.loader.resources.player.texture);
	game.player.width=32;
	game.player.height=32;
	game.player.x=10;
	game.player.y=10;
	game.addChild(game.player);


	scene.addChild(game);

	
	var g = new PIXI.Graphics();
	game.g=g;
	game.addChild(g);

	onResize();
	main();
}

function main(){
	//renderer.resize((Math.sin(Date.now()/500)+1)*32,128);

	if(keys.isDown(keys.LEFT)){
		game.player.x-=1;
	}
	if(keys.isDown(keys.RIGHT)){
		game.player.x+=1;
	}
	if(keys.isDown(keys.UP)){
		game.player.y-=1;
	}
	if(keys.isDown(keys.DOWN)){
		game.player.y+=1;
	}


	

	rng=seed(Math.floor(Date.now()/500)*500+1);
	//rng=function(){return (Math.sin(Date.now()/1000)+1)/2};


	game.g.clear();

	var p=levyCurve(
		{start_size:5,
		iterations:5+rng()*5,
		degradation:0
	});
	var p=fractalCurve({
		start_path:[0,0,0,8],
		iterations:4+rng()*5,
		degradation:rng()*1,
		angle:90+10*rng()
	});


	// scale points
	/*var scale=[r(8)+0.5,r(7)+0.5];
	for(i=0;i<p.length-1;i+=2){
		p[i]*=scale[0];
		p[i+1]*=scale[1];
	}*/

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


	game.g.beginFill(rgb(0,0,0),1);
	game.g.moveTo(p[0],p[1]);
	for(i=2;i<p.length-1;i+=2){
		game.g.lineStyle(1, rgb(80,50,40), 1);
		game.g.lineTo(p[i],p[i+1]);
		//game.g.drawCircle(p[i],p[i+1],2);
	}
	game.g.lineStyle(1, rgb(80,50,40), 1);
	game.g.lineTo(p[0],p[1]);
	game.g.endFill();

	game.g.beginFill(rgb(20,10,30),1);
	game.g.lineStyle(0, rgb(200,150,100), 1);
	game.g.drawPolygon(p);
	game.g.endFill();



	//start point
	game.g.beginFill(rgb(0,0,100),0.5);
	game.g.lineStyle(2, rgb(200,150,100), 0.5);
	game.g.drawCircle(p[0],p[1],5);
	game.g.endFill();
	//end point
	game.g.beginFill(rgb(0,0,100),0.5);
	game.g.lineStyle(2, rgb(200,150,100), 0.5);
	game.g.drawCircle(p[p.length-2],p[p.length-1],5);
	game.g.endFill();

	for(i=0;i<p.length-1;i+=2){
		game.g.beginFill(rgb((80+i)%128+128,50,40),1);
		game.g.lineStyle(0, rgb(40,50,20), 1);
		game.g.drawCircle(p[i],p[i+1],1);
		game.g.endFill();
	}


	game.g.pivot.x=center[0];
	game.g.pivot.y=center[1];
	//game.g.rotation=-0.5*Math.sin(Date.now()/1000);

	game.g.x=size[0]/2;
	game.g.y=size[1]/2;


	renderer.render(scene);
	requestAnimationFrame(main);

	keys.clear();
}

function onResize() {
	var s=Math.min($("#display").innerWidth(),$("#display").innerHeight());
	renderer.view.style.width = s + 'px';
	renderer.view.style.height = s + 'px';
}