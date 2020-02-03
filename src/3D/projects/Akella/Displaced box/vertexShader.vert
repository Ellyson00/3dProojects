
varying vec2 vUv;
varying float vHeight;

uniform float time;
uniform sampler2D t1;
uniform sampler2D t2;

void main() {
	vec3 newPosition = position;
	vUv = uv;
	vec2 uv1 = position.xz + vec2(0.5, 0.5);
	vec2 vUv1 = uv1 + abs(time) *.001;
	vec2 vUv2 = uv1 - abs(time) *.001;
	vUv1 *= .5;
	vUv2 *= 0.3;
	float top = step(0., position.y);
	vec4 bump1 = texture2D(t1, vUv1);
	vec4 bump2 = texture2D(t2, vUv2);
	float height = (bump1.x + bump2.x)/ 2.;
	vHeight = height;
	newPosition.y += top * height / 2.5;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition , 1.);
}