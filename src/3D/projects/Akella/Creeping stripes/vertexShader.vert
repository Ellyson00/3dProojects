varying vec3 vColor;
varying vec2 vUv;
varying float vOffset;

uniform float time;

attribute float offsetPos;
attribute vec3 color;

void main() {
	vUv = uv;
	vOffset = offsetPos;
	vColor = color;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x, position.y + offsetPos, position.z , 1.);
}