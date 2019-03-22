precision highp float;
precision highp int;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat3 normalMatrix;
uniform vec3 cameraPosition;
varying vec2 vUv;
uniform sampler2D tScene;
void main(){
    gl_FragColor = texture2D(tScene, vUv);
}
