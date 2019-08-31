varying vec4 mvPosition;
varying float height;
varying vec3 vNormal;

void main() {
	vec3 light = vec3(0.5, 0.2, 1.0);
    light = normalize(light);
    float dProd = max(0.0, dot(vNormal, light));
    float blue = (1.5 - (height / 1.3) * 0.13 + 0.6) * dProd;
	vec3 color = vec3(0.  ,dProd * (height / 1.3) * 0.13 + 0.4,  blue > 0.6 ? 0.6 : blue);
    gl_FragColor = vec4(color,1.0);
}