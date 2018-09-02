/**
 * Created by Ellyson on 9/2/2018.
 */
export const vertex_saturn = `
	uniform float delta;
uniform float radius;
uniform float time;
uniform sampler2D texture;

varying vec2 vUv;
varying vec4 currentPostion;

void main()
{
	vUv = uv;
	vec3 newPosition = position;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
	currentPostion =  projectionMatrix * modelMatrix * vec4(newPosition, 1.0);
}`;

export const frag_saturn =`
	uniform sampler2D texture;

	varying vec2 vUv;
	varying vec4 currentPostion;

	void main() {
	vec4 baseColor = texture2D( texture, vUv.xy );

	vec4 theColor = baseColor ;
	theColor.a = 1.0;
	if(currentPostion.z > 0.0){
	theColor.x -= currentPostion.z/80.0;
	theColor.y -= currentPostion.z/80.0;
	theColor.z -= currentPostion.z/80.0;
}
	gl_FragColor = theColor;
}`;

export const vertex_derbis = `
	attribute float base_angle;
	attribute float offsetX;
	attribute float offsetZ;

	uniform vec3 stretch;
	uniform float time;

	varying vec4 vUv;
	varying vec2 offset;
	void main()
	{
		vec3 p = position;
		offset = vec2(offsetX, offsetZ);
		p.x = (stretch.x + offsetX)*cos( base_angle + time );
		p.z = (stretch.z + offsetZ)*sin( base_angle + time );
		p.y += (stretch.y + offsetX/10.0)*cos( base_angle + time );

		gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);

		vUv = projectionMatrix * vec4(p, 1.0);
		gl_PointSize = 1.0;
	}`;

export const frag_derbis = `
	varying vec4 vUv;
	varying vec2 offset;

	uniform float shadowType;

	void main() {
	if( abs(offset.x) >= 30.0 || abs(offset.y) >= 10.0)
	gl_FragColor = vec4(0.7, 0.7, 0.65, 0.90);
	else
	gl_FragColor = vec4(0.58, 0.49, 0.45, 0.90);

	if((shadowType == 0.0 && vUv.z > 0.0) || (shadowType == 1.0 && vUv.z > 0.0 && abs(vUv.x) < 64.0))
	gl_FragColor = gl_FragColor - vec4(vUv.zzz*0.0076, 0.0);

}`;

export const vert_titan = `
	uniform float delta;
	uniform float radius;
	uniform float time;

	varying vec4 vUv;

	void main()
	{
		vec3 p = position;

		p.x += (time*0.03+120.0)*cos(time);
		p.z += (time*0.03+120.0)*sin(time);
		p.y += 100.0;

		gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);

		vUv = vec4(p, 1.0);
	}`;
export const frag_titan =`
	uniform sampler2D texture;
	uniform vec2 tile;

	varying vec4 vUv;

	void main() {
	float R = 0.913 + (cos(vUv.y/10.0))/6.0;
	float G = 0.78 + (cos(vUv.y/10.0))/6.0;
	float B = 0.38 + (cos(vUv.y/10.0))/6.0;
	
	if(vUv.z > 0.0)
	gl_FragColor = vec4(R, G, B, 1.0);
	else
	gl_FragColor = vec4(R+vUv.z*0.05, G+vUv.z*0.05, B+vUv.z*0.05, 1.0);
}`;
