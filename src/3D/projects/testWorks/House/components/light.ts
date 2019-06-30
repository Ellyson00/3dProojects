import * as THREE from "three";

export default class Light {

	spotLight: THREE.SpotLight;
	pointLight: THREE.PointLight;

	constructor(currentColor) {
		this.spotLight = new THREE.SpotLight(currentColor.color, 4, 100, 0.5, 0.4, 0.2);
		this.pointLight = new THREE.PointLight(currentColor.color, 4, 30, 0.2);
		this.spotLight.position.set(1.1, 25, -22);
		this.pointLight.position.set(9, 12, -22);
		this.spotLight.target.position.set(32.5, 0, -22);
		this.spotLight.castShadow = this.pointLight.castShadow = true;
		this.spotLight.color = this.pointLight.color = currentColor.color;
		this.spotLight.target.updateMatrixWorld();
	}
}