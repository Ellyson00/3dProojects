varying vec2 vUv;
varying vec3 vPos;
varying vec4 mvPosition;
varying vec3 vNormal;

attribute vec3 portalParticlesPos;
attribute vec4 portalParticlesRot;

vec3 applyQuaternionToVector(vec4 q, vec3 v){
	return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);
}

void main() {
	vUv = uv;
	vec3 vPosition = applyQuaternionToVector(portalParticlesRot, position);
	mvPosition = vec4(portalParticlesPos + vPosition, 1.0);
	vPos = (modelMatrix * modelViewMatrix * vec4(portalParticlesPos + position, 1.0)).xyz;
	vNormal = normalMatrix * normal;
	gl_Position = projectionMatrix * modelViewMatrix * mvPosition;
}