var bgm = new Howl({
	urls:["assets/audio/song.wav"],
	autoplay:true,
	loop:true,
	volume:0
});
bgm.fadeIn(1,3000);

// create renderer
var size = [512, 512];
var renderer = PIXI.autoDetectRenderer(
	size[0],size[1],
	{antiAlias:false, transparent:false, resolution:1}
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
	game.player.width=320;
	game.player.height=320;
	game.player.x=10;
	game.player.y=10;
	game.addChild(game.player);


	scene.addChild(game);

	onResize();
	main();
}

function main(){

	renderer.render(scene);
	requestAnimationFrame(main);
}

function onResize() {
	var s=Math.min($("#display").innerWidth(),$("#display").innerHeight());
	renderer.view.style.width = s + 'px';
	renderer.view.style.height = s + 'px';
}