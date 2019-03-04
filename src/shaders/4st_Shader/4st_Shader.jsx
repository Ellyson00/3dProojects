/**
 * Created by Ellyson on 5/11/2018.
 */

import TemplateFor3D from '../../template3D/temp';
import * as THREE from 'three';
import {vertexShader, fragmentShader} from './shaders';

export default class Shader4 extends TemplateFor3D {
	constructor(){
		super();
	}

	initControls(){
		super.initControls();
		this.camera.position.set(0, 0, 10);
	}

	initShader(){

		const geometry = new THREE.SphereBufferGeometry(4, 30, 30);
		let array = [];

		for (let v = 0; v < geometry.attributes.position.array.length / 3; v++) {
			array.push(Math.random() * 3);
		}
		geometry.addAttribute("displacement", new THREE.Float32BufferAttribute(array, 1).setDynamic(true));
		const customMaterial = new THREE.ShaderMaterial(
			{
				uniforms: {
					amplitude: {
						type: 'f', // a float
						value: 0
					}
				},
				vertexShader: vertexShader,
				fragmentShader: fragmentShader,
			});

		this.sphere = new THREE.Mesh(geometry, customMaterial);
		this.scene.add( this.sphere );
	}

	componentDidMount() {
		super.componentDidMount();
		this.initShader();
		this.initControls();
		this.animate();

	}
	onMouseMove(e){
		this.mouse = new THREE.Vector2(e.offsetX / window.innerWidth, e.offsetY / window.innerHeight);
	}

	animate() {
		super.animate();
		this.sphere.material.uniforms.amplitude.value = Math.sin(this.time / 50);
	}
}
