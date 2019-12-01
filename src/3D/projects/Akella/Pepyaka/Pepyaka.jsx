/**
 * Created by Ellyson on 5/11/2018.
 */

import TemplateFor3D from '../../../templates/mainTemplate3D';
import * as THREE from 'three';
import vertexShader from './vertexShader.vert';
import fragmentShader from './fragmentShader.frag';

export default class Pepyka extends TemplateFor3D {

	initControls() {
		super.initControls();
		this.camera.position.set(0, 0, 5);
	}

	addObject() {
		this.material = new THREE.ShaderMaterial({
			side: THREE.DoubleSide,
			uniforms: {
				time: {type:"f", value: 0},
				resolution: {type: "vec4", value: new THREE.Vector4()},
				uvRate1: {
					value: new THREE.Vector2(1,1)
				}
			},
			// wireframe: true,
			vertexShader,
			fragmentShader
		});
		this.geometry = new THREE.SphereBufferGeometry(1,62,62);
		this.plane = new THREE.Mesh(this.geometry, this.material);
		this.scene.add(this.plane);
	}

	componentDidMount() {
		super.componentDidMount();
		this.initControls();
		this.addObject();
		this.animate();
	}

	animate() {
		if (!this.looped) return;
		if (this.plane) {
			this.time += 0.05;
			this.plane.material.uniforms.time.value = this.time;

		}
		super.animate();
	}
}
