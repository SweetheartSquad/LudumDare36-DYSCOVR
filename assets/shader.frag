precision mediump float;

varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform float time;
uniform vec2 camera;
uniform vec2 speed;

// that GLSL one-liner from http://stackoverflow.com/questions/12964279/whats-the-origin-of-this-glsl-rand-one-liner
float rand(vec2 co){
	return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}



// 2D noise from https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
float noise(vec2 p){
    vec2 ip = floor(p);
    vec2 u = fract(p);
    u = u*u*(3.0-2.0*u);

    float res = mix(
        mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
        mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
    return res*res;
}



vec3 terrain(vec2 pos){
	vec3 result = vec3(0.0);

	float n=
	(noise(pos*512.23450)/3.0+noise(pos*256.05435)/2.0*noise(pos*64.234350)
	-(noise(pos*10.3450)/noise(pos*20.02345)+noise(pos*30.23450))/20.0
	+noise(pos*50.23450)
	+0.1)*0.9;

	result.rgb = vec3(n);
	result.r+=(noise(pos*0.532)*sin(pos.x*0.01123)*sin(pos.y*0.1234))/4.0+0.5
	+(noise(pos*12.5430) > sin(pos.x*0.614) ? sin(pos.x+noise(pos*0.7123))/4.0+0.5 : 0.0);
	result.g+=(noise(pos*0.5123)*sin(pos.x*0.1232)*sin(pos.y*0.0463))/4.0+0.5
	+(noise(pos*12.1230) > sin(pos.y*0.397) ? sin(pos.x+noise(pos*0.234523))/4.0+0.5 : 0.0);
	result.b+=(noise(pos*0.5435)*sin(pos.x*0.33123)*sin(pos.y*0.11123))/4.0+0.5
	+(noise(pos*12.34260) > sin(pos.x*0.1274) ? sin(pos.y+noise(pos*0.6744123))/4.0+0.5 : 0.0);


	n=(result.r+result.b+result.g)/3.0;
	result.r=result.r+(n-result.r)*(noise(pos*0.654)/4.0+0.5);
	result.g=result.g+(n-result.g)*(noise(pos*0.245)/4.0+0.5);
	result.b=result.b+(n-result.b)*(noise(pos*0.165)/4.0+0.5);

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

	
	uvs=uvs+(center-uvs)*(1.0-vignette)/5.0;


	float alignment=sin(time*0.88+uvBlock.y)/30.0;
	uvs.x+=alignment*(rand(uvBlock+vec2(uvBlock.x,floor(time*uvBlock.y))) > vignetteBlock/10.0 ? (sin(time*0.12)+1.0)/4.0+0.2 : 1.0);

	alignment=cos(time*1.3+uvBlock.x)/30.0;
	uvs.y+=alignment*(rand(uvBlock+vec2(uvBlock.y,floor(time*uvBlock.x))) > vignetteBlock/10.0 ? (sin(time*0.33)+1.0)/4.0+0.2 : 1.0);

	uvs+=rand(uvBlock)*length(speed)/100.0*vignetteBlock;

	vec4 fg = texture2D(uSampler, uvs);
	vec2 pos=-uvs+camera;
	fg.rgb=mix(terrain(pos),fg.rgb,fg.a);
	fg.rgb=mix(vec3(noise(pos*64.0)*noise(pos*56.0)),fg.rgb,1.0-fg.a/4.0);
	vec4 fgBlock = texture2D(uSampler, uvBlock);
	fgBlock.rgb=mix(terrain(-uvBlock+camera),fgBlock.rgb,fg.a);

	uvs = vTextureCoord.xy;

	vec2 inset=vec2(1.0)-abs(vec2(0.5)-(uvBlock-uvs)*blockSize)*2.0;
	inset.x+=abs(fg.b-fg.g)/2.0;
	inset.t+=abs(fg.b-fg.r)/2.0;

	t=time+vignetteBlock+rand(uvBlock);
	fg.rgb=fg.rgb+(pow(inset.x,vignetteBlock)*fg.rgb-fg.rgb)*vignette;
	fg.rgb=fg.rgb+(pow(inset.y,vignetteBlock)*fg.rgb-fg.rgb)*vignette;

	fgBlock.g=abs(fgBlock.r*sin(uvBlock.x*16.0)*center.x-vignetteBlock);
	fgBlock.r=abs(fgBlock.g*sin(uvBlock.y*16.0)*center.y-vignetteBlock);
	fgBlock.b=1.0-fgBlock.r-fgBlock.g;

	fg.r+=fgBlock.r*vignette*sin(time*0.23);
	fg.g+=fgBlock.g*vignette*sin(time*0.3243);
	fg.b+=fgBlock.b*vignette*sin(time*0.1234);

	fg.a=1.0;

	gl_FragColor = fg;
}