/**
 * Created by Ellyson on 5/11/2018.
 */

import TemplateFor3D from '../../template3D/temp';
import * as THREE from 'three';
import {vertexShader, fragmentShader} from './shaders';

export default class Shader2 extends TemplateFor3D {
	constructor(){
		super();
	}

	initControls(){
		super.initControls();
		this.camera.position.set(0, 0, 10);
	}

	initShader(){

		const geometry = new THREE.SphereBufferGeometry(4, 30, 30);
		const customMaterial = new THREE.ShaderMaterial(
			{
				uniforms: {  },
				vertexShader: vertexShader,
				fragmentShader: fragmentShader,
			});
		this.sphere = new THREE.Mesh(geometry, customMaterial);
		this.scene.add(this.sphere);
	}

	componentDidMount() {
		super.componentDidMount();
		this.initShader();
		this.initControls();
		this.renderer.domElement.addEventListener("mousemove", this.onMouseMove.bind(this));
		this.animate();
	}

	onMouseMove(e){
		this.mouse = new THREE.Vector2(e.offsetX / window.innerWidth, e.offsetY / window.innerHeight);
	}

	animate() {
		super.animate();
	}
}