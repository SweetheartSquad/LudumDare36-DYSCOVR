


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
	urls:["assets/audio/BG.ogg"],
	autoplay:true,
	loop:true,
	volume:0
});
bgm.fadeIn(1,3000);

// create renderer
var size = [512, 512];
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

	game.player= new PIXI.Graphics();
	
	game.player.beginFill(0xBBBBBB,1);

	game.player.w=size[0]/15;
	game.player.h=size[1]/25;
	game.player.drawRect(-game.player.w/2,-game.player.h/2,game.player.w,game.player.h);
	game.player.drawRect(-game.player.w/4,-game.player.h/4,game.player.w,game.player.h/2);
	game.player.endFill();

	game.player.v=[0,0];
	//game.player.width=32;
	//game.player.height=32;
	game.player.x=10;
	game.player.y=10;

	game.player.s=[size[0]/200,size[1]/200];

	game.addChild(game.player);


	scene.addChild(game);

	onResize();
	main();
}

function main(){
	//renderer.resize((Math.sin(Date.now()/500)+1)*32,128);

	game.player.a=[0,0];
	if(keys.isDown(keys.LEFT)){
		game.player.a[0]-=game.player.s[0];
	}
	if(keys.isDown(keys.RIGHT)){
		game.player.a[0]+=game.player.s[0];
	}
	if(keys.isDown(keys.UP)){
		game.player.a[1]-=game.player.s[1];
	}
	if(keys.isDown(keys.DOWN)){
		game.player.a[1]+=game.player.s[1];
	}

	game.player.v=v_add(game.player.v,game.player.a);

	game.player.v[0]*=0.7;
	game.player.v[1]*=0.7;

	game.player.x+=game.player.v[0];
	game.player.y+=game.player.v[1];

	if(len(game.player.a) > 0){
		game.player.rotation = slerp(game.player.rotation, Math.atan2(game.player.v[1],game.player.v[0]), 0.5);
	}

	if(game.artifact!==null){
		game.removeChild(game.artifact);
		game.artifact=null;
	}
	game.artifact = getArtifact(Math.floor(Date.now()/1600));
	game.addChild(game.artifact);


	renderer.render(scene);
	requestAnimationFrame(main);

	keys.clear();
}

function onResize() {
	var s=Math.min($("#display").innerWidth(),$("#display").innerHeight());
	renderer.view.style.width = s + 'px';
	renderer.view.style.height = s + 'px';
}