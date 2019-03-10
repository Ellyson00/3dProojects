/**
 * Created by Ellyson on 5/11/2018.
 */

import TemplateFor3D from '../../../templates/mainTemplate3D';
import * as THREE from 'three';
import fragmentShader from './shader.frag';
import vertexShader from './shader.vert';

export default class Shader2 extends TemplateFor3D {
	initControls() {
		super.initControls();
		this.camera.position.set(0, 0, 10);
	}

	initShader() {
		const geometry = new THREE.SphereBufferGeometry(4, 30, 30);
		const customMaterial = new THREE.ShaderMaterial({
			uniforms: {},
			vertexShader: vertexShader,
			fragmentShader: fragmentShader
		});
		this.sphere = new THREE.Mesh(geometry, customMaterial);
		this.scene.add(this.sphere);
	}

	componentDidMount() {
		super.componentDidMount();
		this.initShader();
		this.initControls();
		this.animate();
	}

	animate() {
		if (!this.looped) return;
		super.animate();
	}
}