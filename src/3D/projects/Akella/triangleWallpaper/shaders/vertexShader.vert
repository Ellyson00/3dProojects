varying vec2 vUv;
varying vec3 vecPos;
varying vec3 v_position;

void main(){
    vUv = uv;
    vecPos = (modelViewMatrix * vec4(position, 1.0)).xyz;
    v_position = position.xyz;
    gl_Position = projectionMatrix * vec4(vecPos, 1.0);
}
