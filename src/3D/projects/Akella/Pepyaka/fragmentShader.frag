varying vec2 vUv;
varying vec3 vPos;
varying vec3 vNormal;
varying vec3 vColor;

uniform float time;
uniform vec2 uvRate1;
uniform vec4 resolution;

void main() {
    vec2 newUV = (vUv - vec2(0.5)) * resolution.zw + vec2(0.5);
    gl_FragColor = vec4(vColor,1.);
}