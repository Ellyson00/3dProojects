uniform sampler2D texBenares;
uniform float screenRatio;
uniform float time;
uniform sampler2D soundData;

varying vec2 vUv;

void main() {
	vec2 uv = vUv;
	vec3 col = vec3(0);

	float ratio = screenRatio * 0.5;
	vec2 bUv = vUv;
	bUv.x *= ratio;
	bUv.x += 0.5 * (1. - ratio);
	bUv.y *=2.;
	bUv.y -=1.;

	float s = sign(bUv.y);
	bUv.y = abs(bUv.y);
	vec2 offset = vec2(0);
	if (s < 0.) {
		float m2 = (pow(bUv.y, 0.5));
		offset.x = cos( time  * -2. + bUv.y * 30. * m2) * 0.013 + sin( time  * -2.3 + bUv.x * 45. * m2) * 0.01;
		offset.y = sin( time  * -3. + bUv.x * 15. * m2) * 0.01 + cos( time  * -2.7 + bUv.y * 7. * m2) * 0.025;
	}

	// sound spectrum https://www.shadertoy.com/view/Mlj3WV

	vec2 sUv = uv - 0.5;
	sUv *= vec2(4., 3);
	sUv = abs(sUv);

	sUv.x *= ratio;

	// quantize coordinates
	const float bands = 64.0;
	const float segs = 45.0;
	vec2 p = vec2(0);
	p.x = floor(sUv.x*bands)/bands;
	p.y = floor(sUv.y*segs)/segs;

	// read frequency data from first row of texture
	float fft  = texture2D( soundData, vec2(0.1 + p.x * 0.5,0.0) ).x;

	float mask = (p.y < fft) ? 1.0 : 0.025;



	// led shape
	vec2 d = fract((sUv - p) * vec2(bands, segs)) - 0.5;
	float led = smoothstep(0.45, 0.25, abs(d.x)) *
	smoothstep(0.45, 0.25, abs(d.y));
	//

	vec4 benares = texture2D(texBenares, bUv + offset * (0.5 + bUv.y));
	float bStencil = benares.r;

	float m = s < 0. ? 0.95 : 1.;
	col = vec3(1, 0.5, 0.25) * m;

	if (s < 0.) col = mix(col, vec3(0.375, 0.375, 1.), led * mask);
	col = mix(col, vec3(1, 0.75, 0.5) * m, bStencil);
	if (s >= 0.) col = mix(col, vec3(0.45, 0.45, 1.), led * mask);


	gl_FragColor = vec4(col, 1.0);
}