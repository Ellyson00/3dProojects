varying vec3 vNormal;
varying vec3 vColor;

uniform float time;

void main() {
    vec3 light = vec3(0.);
    vec3 skyColor = vec3(1.,1.,0.547);
    vec3 groundColor = vec3(0.562,0.275,0.211);
    vec3 lightDirection = normalize(vec3(0.,-1.,-1.));
    light += dot(lightDirection, vNormal);
    light = mix(skyColor, groundColor, dot(lightDirection, vNormal));
    gl_FragColor = vec4((light * vColor),1.);
}