varying vec4 mvPosition;
varying float height;
varying vec3 vNormal;

attribute vec3 boxPosition;
attribute float boxIndex;

uniform float freqData[1024];

void main() {
    vec3 cubePosition = boxPosition + position;
    float data = freqData[int(boxIndex)];
    vNormal = normal;
    cubePosition.y = cubePosition.y * (data / 256.) * 20.;
    height = cubePosition.y;
	mvPosition = vec4(cubePosition, 1.0);
	gl_Position = projectionMatrix * modelViewMatrix * mvPosition;
}