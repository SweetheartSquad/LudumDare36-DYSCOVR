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
renderer.visible=false;
PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
renderer.backgroundColor = 0x375949;
renderer.view.style.position = "absolute";
renderer.view.style.display = "none";

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
	.add("siteMarker", "assets/img/site marker.png")
	.add("overlayEffects", "assets/img/overlayEffects.png")
	.add("overlayDigital", "assets/img/overlayDigital.png")
	.add("overlayHardware", "assets/img/overlayHardware.png")
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
	keys.init();
	gamepads.init();
	window.onresize = onResize;

	// called when loader completes
	console.log("All files loaded");

	//game
	game.bg = new PIXI.Sprite(PIXI.loader.resources.bg.texture);
	game.bg.width = size[0];
	game.bg.height = size[1];

	game.site = new PIXI.Sprite(PIXI.loader.resources.siteMarker.texture);
	game.site.gap=Math.max(size[0],size[1])/5;
	game.site.x=size[0]/2.0;
	game.site.y=size[1]/2.0;
	game.site.width=game.site.gap;
	game.site.height=game.site.gap;

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

	game.addChild(game.bg);
	game.addChild(game.player);
	game.addChild(game.site);

	var overlayDigital = new PIXI.Sprite(PIXI.loader.resources.overlayDigital.texture);
	overlayDigital.width = size[0];
	overlayDigital.height = size[1];




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
	overlayDigital.addChild(basicText);


	scene.addChild(game);
	scene.addChild(overlayDigital);



	// shader
	var fragmentSrc = PIXI.loader.resources.shader.data;
    filter = new CustomFilter(fragmentSrc);
    renderSprite.filters = [filter];




	renderContainer.overlayEffects1 = new PIXI.Sprite(PIXI.loader.resources.overlayEffects.texture);
	renderContainer.overlayEffects1.width = size[0];
	renderContainer.overlayEffects1.height = size[1];
	renderContainer.overlayEffects1.blendMode = PIXI.BLEND_MODES.MULTIPLY;
	renderContainer.overlayEffects1.alpha=0.5;
	renderContainer.addChild(renderContainer.overlayEffects1);


	renderContainer.overlayEffects2 = new PIXI.Sprite(PIXI.loader.resources.overlayEffects.texture);
	renderContainer.overlayEffects2.width = size[0];
	renderContainer.overlayEffects2.height = size[1];
	renderContainer.overlayEffects2.blendMode = PIXI.BLEND_MODES.SCREEN;
	renderContainer.overlayEffects2.alpha=0.75;
	renderContainer.addChild(renderContainer.overlayEffects2);


	var overlayHardware = new PIXI.Sprite(PIXI.loader.resources.overlayHardware.texture);
	overlayHardware.width = size[0];
	overlayHardware.height = size[1];
	renderContainer.addChild(overlayHardware);

	onResize();
	main();


	// unhide the renderer
	renderer.view.style.display = "block";
}

var artifacts=[];

function main(){
	//renderer.resize((Math.sin(Date.now()/500)+1)*32,128);

	for(i in artifacts){
		artifacts[i].rotate((Math.sin(Date.now()/500)+1)/45);
	}

	// get inputs
	var inputMove=[0,0];
	var inputCam=[0,0];
	var inputArtifact=false;

	if(keys.isDown(keys.LEFT)){
		inputMove[0]=-1;
	}if(keys.isDown(keys.RIGHT)){
		inputMove[0]=1;
	}if(keys.isDown(keys.UP)){
		inputMove[1]=-1;
	}if(keys.isDown(keys.DOWN)){
		inputMove[1]=1;
	}if(keys.isJustDown(keys.SPACE)){
		inputArtifact=true;
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

		if(navigator.getGamepads()[0].buttons[0].pressed){
			inputArtifact=true;
		}
	}

	// update excavation site
	game.site.x = Math.round(game.player.x / game.site.gap - 0.5) * game.site.gap;
	game.site.y = Math.round(game.player.y / game.site.gap - 0.5) * game.site.gap;
	game.artNum = Math.round(game.site.x + game.site.y*size[0]*game.site.gap)>>>0;
	var rng=seed(game.artNum);
	game.artifactVisible=rng()<0.1;
	
	if(game.artifactVisible){
		game.site.tint=0xFFFFFF;
	}else{
		game.site.tint=0x000000;
	}

	if(inputArtifact){
		// check if an artifact should be here
		if(game.artifactVisible){

			// check if an artifact is already here
			if(artifacts[game.artNum] == null){
				// if not, make one
				var artifact = new PIXI.Graphics();
				artifact = getArtifact(game.artNum);
				artifact.x = game.site.x+game.site.gap/2;
				artifact.y = game.site.y+game.site.gap/2;
				game.addChild(artifact);
				artifacts[game.artNum] = artifact;
			}

			// get the messages for the artifact
			getMessages(game.artNum);
		}else{
			displayMessage("Excavation failed; no artifacts in range");
		}
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

	renderContainer.overlayEffects1.alpha=0.6*(Math.sin(Date.now()/7657+(game.player.x)/1111.0))+0.25;
	renderContainer.overlayEffects2.alpha=0.2*(Math.sin(Date.now()/4567+(game.y)/666.0));

	// shader

    filter.uniforms.time = (Date.now()-startTime)/1000;
    filter.uniforms.camera = [game.x/size[0]/2.0,game.y/size[1]/2.0];
    filter.uniforms.speed = game.player.v;

    // render
	renderer.render(scene,renderTexture);
	renderer.render(renderContainer);
	requestAnimationFrame(main);

	// clear inputs for next frame
	keys.clear();

	// update DOM
	updateMessages();
}

function onResize() {
	var s=Math.min($("#display").innerWidth(),$("#display").innerHeight());
	renderer.view.style.width = s + 'px';
	renderer.view.style.height = s + 'px';
}
