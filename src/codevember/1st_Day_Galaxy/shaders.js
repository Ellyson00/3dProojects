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
	gl_FragColor = vec4(gl_FragColor.xyz * .1, 0.5);

}`;

export const vert_titan = `
	uniform float delta;
	uniform float radius;
	uniform float time;
	uniform sampler2D texture;
	varying vec3 vNormal;

	varying vec2 vUv;
	varying vec3 p;

	void main()
	{
		p = position;
		
		// Specify the axis to rotate about:
		float x = 0.0;
		float y = 1.0;
		float z = 0.0;
		
		vNormal = normal;
		
		// Specify the angle in radians:
		float angle = 90.0 * 3.14 / 180.0 + time * 15.; // 90 degrees, CCW
		
		// rotate 
		vec3 q;
		vNormal.x = q.x = p.x * (x*x * (1.0 - cos(angle)) + cos(angle))
    	+ p.y * (x*y * (1.0 - cos(angle)) + z * sin(angle))
    	+ p.z * (x*z * (1.0 - cos(angle)) - y * sin(angle));

		vNormal.y = q.y = p.x * (y*x * (1.0 - cos(angle)) - z * sin(angle))
			 + p.y * (y*y * (1.0 - cos(angle)) + cos(angle))
			 + p.z * (y*z * (1.0 - cos(angle)) + x * sin(angle));
		
		vNormal.z = q.z = p.x * (z*x * (1.0 - cos(angle)) + y * sin(angle))
			 + p.y * (z*y * (1.0 - cos(angle)) - x * sin(angle))
			 + p.z * (z*z * (1.0 - cos(angle)) + cos(angle));
				
		vUv = uv;
		
		p.x = q.x += (time*0.03+200.0)*cos(time) + 50.;
		p.z = q.z += (time*0.03+200.0)*sin(time);
		p.y = q.y += 70.0 + 60. * cos(time);

		gl_Position = projectionMatrix * modelViewMatrix * vec4(q, 1.0);
	}`;
export const frag_titan =`
	uniform sampler2D texture;
	uniform vec2 tile;
	uniform sampler2D textureNormal;
	
	varying vec4 currentPostion;
	varying vec2 vUv;
	varying vec3 p;
	varying vec3 vNormal;

	void main() {
	
	float R = 0.68 + (cos(vUv.y/10.0))/6.0;
	float G = 0.78 + (cos(vUv.y/10.0))/6.0;
	float B = 0.78 + (cos(vUv.y/10.0))/6.0;
	
	
	//mix merge textures
	vec4 baseColor = mix(texture2D( texture , vUv.xy ) , texture2D( textureNormal , vUv.xy ), .6);

	vec4 theColor = baseColor+ vec4(vNormal.zzz * 0.04, 1.0);
	
	if(p.z < 0.0 && p.x < 80.0 && p.x > -100.){
		theColor.x += p.z/100.0;
		theColor.y += p.z/100.0;
		theColor.z += p.z/100.0;
	}
	theColor.a = 1.0;
	if(theColor.z > 0.9){
		theColor  = vec4(theColor.x - 0.2, theColor.y - 0.2, theColor.z - 0.2, 1.);
	}
	gl_FragColor = vec4(theColor.xyz, 1.0);
}`;
