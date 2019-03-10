varying vec4 vUv;
varying vec2 offset;

uniform float shadowType;

void main() {
	if( abs(offset.x) >= 30.0 || abs(offset.y) >= 10.0)
	gl_FragColor = vec4(0.7, 0.7, 0.65, 0.90);
	else
	gl_FragColor = vec4(0.58, 0.49, 0.45, 0.90);

	if((shadowType == 0.0 && vUv.z > 0.0) || (shadowType == 1.0 && vUv.z > 0.0 && abs(vUv.x) < 64.0))
	gl_FragColor = vec4(gl_FragColor.xyz * .1, 0.5);
}