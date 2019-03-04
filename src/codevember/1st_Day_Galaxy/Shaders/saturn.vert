	uniform float delta;
uniform float radius;
uniform float time;
uniform sampler2D texture;

varying vec2 vUv;
varying vec4 currentPostion;

void main()
{
	vUv = uv;
	vec3 newPosition = position;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
	currentPostion =  projectionMatrix * modelMatrix * vec4(newPosition, 1.0);
}