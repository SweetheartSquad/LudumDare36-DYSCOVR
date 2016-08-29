$(window).on("keyup",keys.on_up.bind(keys));
$(window).on("keydown",keys.on_down.bind(keys));

var startTime=Date.now();
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


// create a new render texture..
var brt = new PIXI.BaseRenderTexture(size[0], size[1], PIXI.SCALE_MODES.NEAREST, 1);
var renderTexture = new PIXI.RenderTexture(brt);
 
// create a sprite that uses the new render texture...
// and add it to the stage
var renderContainer = new PIXI.Container();
var renderSprite = new PIXI.Sprite(renderTexture);
renderContainer.addChild(renderSprite);

function CustomFilter(fragmentSource){
    PIXI.Filter.call(this,
        // vertex shader
        null,
        // fragment shader
        fragmentSource
    );
}

CustomFilter.prototype = Object.create(PIXI.Filter.prototype);
CustomFilter.prototype.constructor = CustomFilter;



PIXI.loader
	.add("player", "assets/img/player.png")
	.add("bg", "assets/img/bg.png")
	.add("overlayScreen", "assets/img/overlay-screen.png")
	.add("overlay", "assets/img/overlay.png")
	.add('shader','assets/shader.frag');

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
	gamepads.init();

	// called when loader completes
	console.log("All files loaded");

	//game
	game.bg = new PIXI.Sprite(PIXI.loader.resources.bg.texture);
	game.bg.width = size[0];
	game.bg.height = size[1];
	game.addChild(game.bg);

	game.player = new PIXI.Container();

	game.player.w=size[0]/15;
	game.player.h=size[1]/25;
	game.player.s=[size[0]/500,size[1]/500];

	game.player.x=size[0]/2.0;
	game.player.y=size[1]/2.0;
	game.player.v=[0,0];


	game.player.treads = new PIXI.Graphics();
	game.player.treads.advance=0;
	
	var player_chasis = new PIXI.Graphics();
	player_chasis.beginFill(0xBBBBBB,1);

	player_chasis.drawRect(-game.player.w/2,-game.player.h/2,game.player.w,game.player.h);
	player_chasis.drawRect(-game.player.w/4,-game.player.h/4,game.player.w,game.player.h/2);
	player_chasis.endFill();

	game.player.addChild(game.player.treads);
	game.player.addChild(player_chasis);

	game.addChild(game.player);

	var overlay = new PIXI.Sprite(PIXI.loader.resources.overlay.texture);
	overlay.width = size[0];
	overlay.height = size[1];




	var style = {
	    fontFamily: 'font',
	    fontSize:size[0]/25.0,
	    fill : '#000000',
	    stroke : '#FFFFFF',
	    strokeThickness : 0,
	    dropShadow : true,
	    dropShadowColor : '#BBBBBB',
	    dropShadowAngle : Math.PI / 2,
	    dropShadowDistance : size[1]/300.0,
	    wordWrap : false
	};
	var basicText = new PIXI.Text('TextArea',style);
	basicText.x = size[0]/15.0;
	basicText.y = size[1]/15.0;

	game.uiText=basicText;
	overlay.addChild(basicText);


	scene.addChild(game);
	scene.addChild(overlay);



	// shader
	var fragmentSrc = PIXI.loader.resources.shader.data;
    filter = new CustomFilter(fragmentSrc);
    renderSprite.filters = [filter];




	renderContainer.overlayScreen1 = new PIXI.Sprite(PIXI.loader.resources.overlayScreen.texture);
	renderContainer.overlayScreen1.width = size[0];
	renderContainer.overlayScreen1.height = size[1];
	renderContainer.overlayScreen1.blendMode = PIXI.BLEND_MODES.MULTIPLY;
	renderContainer.overlayScreen1.alpha=0.5;
	renderContainer.addChild(renderContainer.overlayScreen1);


	renderContainer.overlayScreen2 = new PIXI.Sprite(PIXI.loader.resources.overlayScreen.texture);
	renderContainer.overlayScreen2.width = size[0];
	renderContainer.overlayScreen2.height = size[1];
	renderContainer.overlayScreen2.blendMode = PIXI.BLEND_MODES.SCREEN;
	renderContainer.overlayScreen2.alpha=0.75;
	renderContainer.addChild(renderContainer.overlayScreen2);

	onResize();
	main();
}

function main(){
	//renderer.resize((Math.sin(Date.now()/500)+1)*32,128);


	// get inputs
	var inputMove=[0,0];
	var inputCam=[0,0];

	if(keys.isDown(keys.LEFT)){
		inputMove[0]=-1;
	}if(keys.isDown(keys.RIGHT)){
		inputMove[0]=1;
	}if(keys.isDown(keys.UP)){
		inputMove[1]=-1;
	}if(keys.isDown(keys.DOWN)){
		inputMove[1]=1;
	}

	if(keys.isJustDown(keys.SPACE)){
		if(seed(game.player.x+game.player.y)()>0.01){
			var artifact = new PIXI.Graphics();
			artifact = getArtifact(game.player.x+game.player.y);
			artifact.x = game.player.x;
			artifact.y = game.player.y;
			game.addChild(artifact);

			$('input').val(game.player.x+game.player.y)
		}
	}

	if(gamepads.connected){
		var stick = gamepads.getStick();
		inputMove[0]+=stick[0];
		inputMove[1]+=stick[1];
		inputCam[0]+=stick[2];
		inputCam[1]+=stick[3];

		var dpad = gamepads.getDpad();
		inputMove[0]+=dpad[0];
		inputMove[1]+=dpad[1];
	}

	inputMove[0]=Math.min(1,Math.max(inputMove[0],-1));
	inputMove[1]=Math.min(1,Math.max(inputMove[1],-1));

	game.player.a=[
		inputMove[0]*game.player.s[0],
		inputMove[1]*game.player.s[1]
	];

	game.player.v=v_add(game.player.v,game.player.a);

	game.player.v[0]*=0.8;
	game.player.v[1]*=0.8;

	game.player.x+=game.player.v[0];
	game.player.y+=game.player.v[1];

	game.player.treads.advance+=len(game.player.v);

	if(len(game.player.a) > 0){
		game.player.rotation = slerp(game.player.rotation, Math.atan2(game.player.v[1],game.player.v[0]), 0.25);
	}


	game.x=lerp(game.x,-(game.player.x-size[0]/2+game.player.v[0]*size[0]/16 + inputCam[0]*size[0]/3 ),0.1);
	game.y=lerp(game.y,-(game.player.y-size[1]/2+game.player.v[1]*size[1]/16 + inputCam[1]*size[1]/3 ),0.1);


	/*if(game.artifact!==null){
		game.removeChild(game.artifact);
		game.artifact=null;
	}
	game.artifact = getArtifact(Math.floor(Date.now()/1600));
	game.addChild(game.artifact);*/

	// redraw player treads
	var a=-game.player.w*2/3;
	var b=game.player.w*4/3;

	game.player.treads.clear();

	game.player.treads.beginFill(0xBBFFBB,1);
	game.player.treads.drawRect(a,-game.player.h*2/3,b,game.player.h*4/3);
	
	game.player.treads.beginFill(0x004444,1);
	for(var i=game.player.treads.advance/(game.player.w)%1;i<3.5;i+=1){
		var t=a+b*((i-0.5)/3);
		var c=Math.max(t,a);
		var d=Math.min(t+b/6,a+b);
		game.player.treads.drawRect(c,-game.player.h*2/3,d-c,game.player.h*4/3);
	}
	game.player.treads.endFill();

	var rng=seed(game.player.x+game.player.y);
	game.uiText.text="DYSCOVR-v0.1.25b\nx."+Math.floor(game.x)+".y."+Math.floor(game.y)
	+"\ns."+Math.floor(rng()*999)+".t."+Math.floor(rng()*999)
	+"\nd."+(Math.floor(Date.now()/1000)+1.577e+9);

	renderContainer.overlayScreen1.alpha=0.6*(Math.sin(Date.now()/7657+(game.player.x)/1111.0))+0.25;
	renderContainer.overlayScreen2.alpha=0.2*(Math.sin(Date.now()/4567+(game.y)/666.0));

	// shader

    filter.uniforms.time = (Date.now()-startTime)/1000;
    filter.uniforms.camera = [game.x/size[0]/2.0,game.y/size[1]/2.0];
    filter.uniforms.speed = game.player.v;

	renderer.render(scene,renderTexture);
	renderer.render(renderContainer);
	requestAnimationFrame(main);

	keys.clear();
}

function onResize() {
	var s=Math.min($("#display").innerWidth(),$("#display").innerHeight());
	renderer.view.style.width = s + 'px';
	renderer.view.style.height = s + 'px';
}