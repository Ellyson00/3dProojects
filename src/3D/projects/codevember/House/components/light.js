import * as THREE from "three";

export default class Light {
	constructor(currentColor){
		console.log(currentColor)
		this.spotLight = new THREE.SpotLight( currentColor.color, 4, 80.0, 0.5 , 0.4, 0.2);
		this.pointLight = new THREE.PointLight( currentColor.color, 4, 30.0, 0.2);
		this.spotLight.position.set(1.1, 25.0, -22.0);
		this.pointLight.position.set(9.0, 12.0, -22.0);
		this.spotLight.target.position.set(32.5, 0, -22.0);
		this.spotLight.castShadow = this.pointLight.castShadow = true;
		this.spotLight.color = this.pointLight.color = currentColor.color;
		this.spotLight.target.updateMatrixWorld();
	}
}