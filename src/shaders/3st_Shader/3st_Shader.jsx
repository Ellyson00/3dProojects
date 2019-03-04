/**
 * Created by Ellyson on 5/11/2018.
 */

import * as THREE from 'three';
import fragmentShader from './shader.frag';
import vertexShader from './shader.vert';
import TemplateFor3D from '../../template3D/temp';

export default class Shader3 extends TemplateFor3D {
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

		for (let v = 0; v < geometry.attributes.position.array.length/3; v++) {
			array.push(Math.random() * 3);
		}
		geometry.addAttribute("displacement",new THREE.Float32BufferAttribute(array, 1).setDynamic(true));
		const customMaterial = new THREE.ShaderMaterial(
			{
				uniforms: {
				},
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