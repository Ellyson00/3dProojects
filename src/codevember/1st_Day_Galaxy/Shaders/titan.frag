
	uniform sampler2D texture;
	uniform vec2 tile;
	uniform sampler2D textureNormal;

	varying vec4 currentPostion;
	varying vec2 vUv;
	varying vec3 p;
	varying vec3 vNormal;

	void main() {

	float R = 0.68 + (cos(vUv.y/10.0))/6.0;
	float G = 0.78 + (cos(vUv.y/10.0))/6.0;
	float B = 0.78 + (cos(vUv.y/10.0))/6.0;


	//mix merge textures
	vec4 baseColor = mix(texture2D( texture , vUv.xy ) , texture2D( textureNormal , vUv.xy ), .6);

	vec4 theColor = baseColor+ vec4(vNormal.zzz * 0.04, 1.0);

	if(p.z < 0.0 && p.x < 80.0 && p.x > -100.){
		theColor.x += p.z/100.0;
		theColor.y += p.z/100.0;
		theColor.z += p.z/100.0;
	}
	theColor.a = 1.0;
	if(theColor.z > 0.9){
		theColor  = vec4(theColor.x - 0.2, theColor.y - 0.2, theColor.z - 0.2, 1.);
	}
	gl_FragColor = vec4(theColor.xyz, 1.0);
}