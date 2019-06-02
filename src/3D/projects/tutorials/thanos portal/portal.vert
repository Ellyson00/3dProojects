varying vec2 vUv;
varying vec3 vPos;
varying vec3 vNormal;

attribute vec3 cubePos;
attribute vec4 cubeRot;

vec3 applyQuaternionToVector( vec4 q, vec3 v ){
	return v + 2.0 * cross( q.xyz, cross( q.xyz, v ) + q.w * v );
}

void main() {
	vUv = uv;
	vec3 vPosition = applyQuaternionToVector( cubeRot, position );
	vec4 mvPosition = vec4( cubePos + vPosition, 1.0 );
	vPos = (modelMatrix * vec4(cubePos + position, 1.0 )).xyz;
	vNormal = normalMatrix * normal;
	gl_Position = projectionMatrix * modelViewMatrix * mvPosition;
}