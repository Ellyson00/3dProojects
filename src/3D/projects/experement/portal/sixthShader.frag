precision highp float;
precision highp int;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat3 normalMatrix;
uniform vec3 cameraPosition;
uniform float time;
uniform sampler2D frame1;
varying vec2 vUv;
vec2 transformUV(vec2 uv, float a[9]) {
    vec3 u = vec3(uv, 1.0);
    mat3 mo1 = mat3(1, 0, -a[7], 0, 1, -a[8], 0, 0, 1);
    mat3 mo2 = mat3(1, 0, a[7], 0, 1, a[8], 0, 0, 1);
    mat3 mt = mat3(1, 0, -a[0], 0, 1, -a[1], 0, 0, 1);
    mat3 mh = mat3(1, a[2], 0, a[3], 1, 0, 0, 0, 1);
    mat3 mr = mat3(cos(a[4]), sin(a[4]), 0, -sin(a[4]), cos(a[4]), 0, 0, 0, 1);
    mat3 ms = mat3(1.0 / a[5], 0, 0, 0, 1.0 / a[6], 0, 0, 0, 1);
    u = u * mt;
    u = u * mh;
    u = u * mo1;
    u = u * mr;
    u = u * mo2;
    u = u * mo1;
    u = u * ms;
    u = u * mo2;
    return u.xy;
}

vec2 rotateUV(vec2 uv, float r) {
    float a[9];
    a[0] = 0.0;
    a[1] = 0.0;
    a[2] = 0.0;
    a[3] = 0.0;
    a[4] = r;
    a[5] = 1.0;
    a[6] = 1.0;
    a[7] = 0.5;
    a[8] = 0.5;

    return transformUV(uv, a);
}

vec2 translateUV(vec2 uv, vec2 translate) {
    float a[9];
    a[0] = translate.x;
    a[1] = translate.y;
    a[2] = 0.0;
    a[3] = 0.0;
    a[4] = 0.0;
    a[5] = 1.0;
    a[6] = 1.0;
    a[7] = 0.5;
    a[8] = 0.5;
    return transformUV(uv, a);
}

vec2 scaleUV(vec2 uv, vec2 scale) {
    float a[9];
    a[0] = 0.0;
    a[1] = 0.0;
    a[2] = 0.0;
    a[3] = 0.0;
    a[4] = 0.0;
    a[5] = scale.x;
    a[6] = scale.y;
    a[7] = 0.5;
    a[8] = 0.5;
    return transformUV(uv, a);
}

vec2 scaleUV(vec2 uv, vec2 scale, vec2 origin) {
    float a[9];
    a[0] = 0.0;
    a[1] = 0.0;
    a[2] = 0.0;
    a[3] = 0.0;
    a[4] = 0.0;
    a[5] = scale.x;
    a[6] = scale.y;
    a[7] = origin.x;
    a[8] = origin.x;
    return transformUV(uv, a);
}

void main(){
    vec2 uv1 = rotateUV(vUv, time * 1.8);
    float f1 = texture2D(frame1, uv1).r;
    vec2 uv2 = rotateUV(vUv, -time * 1.25);
    float f2 = texture2D(frame1, uv2).g;
    vec2 uv3 = rotateUV(vUv, time * 2.7565);
    float f3 = texture2D(frame1, uv3).b;
    float f = min(1.0, f1 + f2 + f3);
    vec3 color = vec3(0.95) * f;
    gl_FragColor = vec4(color, f);
}
