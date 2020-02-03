varying float vHeight;

uniform float time;
uniform sampler2D t1;
uniform sampler2D t2;

void main() {
    vec4 white = vec4(1.,1.,1.,1.);
    vec4 red = vec4(1.,0.16,0.32,1.);
    vec4 blue = vec4(0.16,0.,.0,1.);
    vec4 finalColor = mix(blue, red, smoothstep(0.0,0.7, vHeight));
    finalColor = mix(finalColor, white, smoothstep(0.7,0.9, vHeight));
    gl_FragColor = finalColor;
}