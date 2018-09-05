/**
 * Created by Ellyson on 9/5/2018.
 */
export const vertexShader =
	`
	varying vec3 vNormal;
	
	void main() {
		vNormal = normal;
		gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
	}`;

export const fragmentShader =
	`
	varying vec3 vNormal;
	
	void main() {
	
		vec3 light = vec3(0.5, 0.2, 1.0);
		light = normalize(light);
		float dProd = max(0.0, dot(vNormal, light));
		
  		gl_FragColor = vec4(dProd,dProd,dProd,1.0);
	}`;