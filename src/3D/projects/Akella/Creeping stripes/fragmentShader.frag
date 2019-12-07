varying vec3 vColor;
varying vec2 vUv;
varying float vOffset;

uniform float time;

void main() {
    float opacity = fract(time / 200. + vOffset / 10.);
    float length = 0.3;
    if (abs(vUv.x - opacity) > length && abs(vUv.x - opacity - 1.) > length && abs(vUv.x - opacity + 1.) > length) {
        discard;
    }
     gl_FragColor = vec4(gl_FrontFacing ? vColor : vColor * 0.5 ,1.);
}