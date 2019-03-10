/**
 * Created by Ellyson on 5/11/2018.
 */

import TemplateFor3D from '../../../templates/mainTemplate3D';
import * as THREE from 'three';
import vertexShader from "./shaders/vertexShader.vert";
import fragmentShader from "./shaders/fragmentShader.frag";
const spark = require("./spark1.png");

const particles = 100000;

export default class PointLights extends TemplateFor3D {
	initControls(){
		super.initControls();
		this.camera.position.set(0, 0, 770);
	}

	componentDidMount() {
		super.componentDidMount();
		const uniforms = {
			texture: {value: new THREE.TextureLoader().load(spark)}
		};
		const shaderMaterial = new THREE.ShaderMaterial({
			uniforms: uniforms,
			vertexShader: vertexShader,
			fragmentShader: fragmentShader,
			blending: THREE.AdditiveBlending,
			depthTest: false,
			transparent: true,
			vertexColors: true
		});

		const radius = 200;
		this.geometry = new THREE.BufferGeometry();
		const positions = [];
		const colors = [];
		const sizes = [];
		const color = new THREE.Color();
		for (let i = 0; i < particles; i++) {
			positions.push((Math.random() * 2 - 1) * radius);
			positions.push((Math.random() * 2 - 1) * radius);
			positions.push((Math.random() * 2 - 1) * radius);
			color.setHSL(i / particles, 1.0, 0.5);
			colors.push(color.r, color.g, color.b);
			sizes.push(20);
		}
		this.geometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
		this.geometry.addAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
		this.geometry.addAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
		this.particleSystem = new THREE.Points(this.geometry, shaderMaterial);
		this.scene.add(this.particleSystem);
		this.initControls();
		this.animate();
	}

	animate() {
		if (!this.looped) return;
		const time = Date.now() * 0.005;
		let sizes = this.geometry.attributes.size.array;
		for (let i = 0; i < particles; i++ ) {
			sizes[i] = 10 * (1 + Math.sin(0.1 * i + time));
		}
		this.geometry.attributes.size.needsUpdate = true;
		super.animate();
	}
}
