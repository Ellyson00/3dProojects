/**
 * Created by Ellyson on 5/11/2018.
 */

import TemplateFor3D from '../../../templates/mainTemplate3D';
import * as THREE from 'three';
import vertexShader from './vertexShader.vert';
import fragmentShader from './fragmentShader.frag';
import particalFragmentShader from './particalFragmentShader.frag';
import particalVertexShader from './particalVertexShader.vert';

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
			vertexShader,
			fragmentShader
		});

		this.geometry = new THREE.SphereBufferGeometry(1,362,362);
		this.sphere = new THREE.Mesh(this.geometry, this.material);

		this.material = new THREE.ShaderMaterial({
			uniforms: {
				time: {type:"f", value: 0},
				resolution: {type: "vec4", value: new THREE.Vector4()},
				uvRate1: {
					value: new THREE.Vector2(1,1)
				}
			},
			fragmentShader: particalFragmentShader,
			vertexShader: particalVertexShader
		});

		let N = 6000;

		const positions = new Float32Array(N*3);
		this.particalGeometry = new THREE.BufferGeometry();

		//Golden Section Spiral - http://www.softimageblog.com/archives/115 - https://bendwavy.org/pack/pack.htm

		let inc = Math.PI * (3 - Math.sqrt(5));
		let offset = 2/N;
		let rad = 1.7;
		for (let i = 0; i < N; i++) {

			let y = i * offset - 1 + (offset / 2);
			let r = Math.sqrt(1 - y*y);
			let phi = i * inc;
			positions[3*i] = rad * Math.cos(phi) * r;
			positions[3*i+1] = rad * y;
			positions[3*i+2] = rad * Math.sin(phi) * r;
		}
		this.particalGeometry.addAttribute("position", new THREE.BufferAttribute(positions, 3));
		this.particles = new THREE.Points(this.particalGeometry, this.material);

		this.scene.add(this.sphere, this.particles);
	}

	componentDidMount() {
		super.componentDidMount({antialias: true });
		this.initControls();
		this.addObject();
		this.animate();
	}

	animate() {
		if (!this.looped) return;
		if (this.sphere) {
			this.time += 0.05;
			this.sphere.material.uniforms.time.value = this.time;
			this.particles.material.uniforms.time.value = this.time;
			this.particles.rotation.y = this.time / 400;
		}
		super.animate();
	}
}
