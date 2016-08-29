precision mediump float;

varying vec2 vTextureCoord;
varying vec4 vColor;

uniform sampler2D uSampler;
uniform float time;
uniform vec2 camera;
uniform vec2 speed;

// that GLSL one-liner from http://stackoverflow.com/questions/12964279/whats-the-origin-of-this-glsl-rand-one-liner
float rand(vec2 co){
	return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float rand(float x,float y){
	return rand(vec2(x,y));
}



vec3 terrain(vec2 pos){
	vec3 result = vec3(0.0);

	result.r = sin(pos.x*100.0);
	result.g = sin(pos.y*100.0);
	result.b = result.r+result.g;

	return result;
}


void main(void)
{

	vec2 blockSize=vec2(32.0,64.0);

	float t=time;

	vec2 uvs = vTextureCoord.xy;
	vec2 uvBlock=floor(uvs*blockSize)/blockSize+1.0/vec2(blockSize);

	vec2 center=vec2(0.25+sin(time*0.124)/20.0,0.25+sin(time*0.133)/20.0);
	float vignette=distance(uvs,center);
	float vignetteBlock=distance(uvBlock,center);

	

	float alignment=sin(time*0.88+uvBlock.y)/30.0;
	uvs.x+=alignment*(rand(uvBlock+vec2(uvBlock.x,floor(time*uvBlock.y))) > vignetteBlock/10.0 ? (sin(time*0.12)+1.0)/4.0+0.2 : 1.0);

	alignment=cos(time*1.3+uvBlock.x)/30.0;
	uvs.y+=alignment*(rand(uvBlock+vec2(uvBlock.y,floor(time*uvBlock.x))) > vignetteBlock/10.0 ? (sin(time*0.33)+1.0)/4.0+0.2 : 1.0);

	uvs+=rand(uvBlock)*length(speed)/100.0*vignetteBlock;

	uvs.x=mod(uvs.x,0.5);
	uvs.y=mod(uvs.y,0.5);




	vec4 fg = texture2D(uSampler, uvs);
	if(fg.rgb==vec3(0)){
		fg.rgb=terrain(-uvs+camera);
	}
	vec4 fgBlock = texture2D(uSampler, uvBlock);
	if(fgBlock.rgb==vec3(0)){
		fgBlock.rgb=terrain(-uvBlock+camera);
	}


	uvs = vTextureCoord.xy;

	vec2 inset=vec2(1.0)-abs(vec2(0.5)-(uvBlock-uvs)*blockSize)*2.0;
	inset.x+=fg.b-fg.g;
	inset.t+=fg.b-fg.r;

	t=time+vignetteBlock+rand(uvBlock);
	fg.rgb*=pow(inset.x,vignetteBlock);
	fg.rgb*=pow(inset.y,vignetteBlock/2.0);

	fgBlock.g=abs(fgBlock.r*sin(uvBlock.x*16.0)*center.x-vignetteBlock);
	fgBlock.r=abs(fgBlock.g*sin(uvBlock.y*16.0)*center.y-vignetteBlock);
	fgBlock.b=1.0-fgBlock.r-fgBlock.g;

	fg.r+=fgBlock.r*vignette*sin(time*0.23);
	fg.g+=fgBlock.g*vignette*sin(time*0.3243);
	fg.b+=fgBlock.b*vignette*sin(time*0.1234);

	fg.a=1.0;

	gl_FragColor = fg;
}


/*
//no post-processing
void main(void)
{

	vec2 blockSize=vec2(32.0,64.0);

	float t=time;

	vec2 uvs = mod(vTextureCoord.xy,0.5);
	vec4 fg = texture2D(uSampler, uvs);
	if(fg.rgb==vec3(0)){
		fg.rgb=terrain(-uvs+camera);
	}

	fg.a=1.0;

	gl_FragColor = fg;
} */