varying vec4 mvPosition;
varying float height;
varying vec3 vNormal;

attribute vec3 boxPosition;
attribute float boxIndex;
attribute float frequencyData;

void main() {
    vec3 cubePosition = boxPosition + position;
    vNormal = normal;
    cubePosition.y = cubePosition.y * (frequencyData / 256.) * 20.;
    height = cubePosition.y;
	mvPosition = vec4(cubePosition, 1.0);
	gl_Position = projectionMatrix * modelViewMatrix * mvPosition;
}