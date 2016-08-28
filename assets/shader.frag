precision mediump float;

varying vec2 vTextureCoord;
varying vec4 vColor;

uniform sampler2D uSampler;
uniform float time;
uniform vec2 camera;

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
	float t=time;
   vec2 uvs = vTextureCoord.xy;

   vec4 fg = texture2D(uSampler, uvs);




	vec4 fg = texture2D(uSampler, uvs);
	if(fg.rgb==vec3(0)){
		fg.rgb=terrain(-uvs+camera);
	}


	fg.a=1.0;
	gl_FragColor = fg;
}