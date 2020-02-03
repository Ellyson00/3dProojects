/**
 * Created by Ellyson on 5/11/2018.
 */

import TemplateFor3D from '../../../templates/mainTemplate3D';
import * as THREE from 'three';
import vertexShader from './vertexShader.vert';
import fragmentShader from './fragmentShader.frag';
const OrbitControls = require('three-orbit-controls')(THREE);

const image2 = require("./image.png");
const image = require("./image2.png");

export default class DisplacedBox extends TemplateFor3D {

	constructor(){
		super();
		this.speedX = 0;
		this.speedY = 0;
		this.fimalSpeed = 0;
	}

	initControls() {
		const frustumSize = 10;
		const aspect = this.WIDTH / this.HEIGHT;
		this.camera.position.set(0, 0, 4);
		this.controls = new OrbitControls(this.camera, this.renderer.domElement);
	}

	mouseVel(){
		let timestamp = null;
		let lastMouseX = null;
		let lastMouseY = null;

		document.body.addEventListener("mousemove", (e) => {
			if (timestamp === null) {
				timestamp = Date.now();
				lastMouseX = e.screenX;
				lastMouseY = e.screenY;
				return;
			}

			let now = Date.now();
			let dt =  now - timestamp > 0 ? now - timestamp : 0.1;
			let dx = e.screenX - lastMouseX;
			let dy = e.screenY - lastMouseY;
			this.speedX = Math.round(dx / dt * 100);
			this.speedY = Math.round(dy / dt * 100);

			timestamp = now;
			lastMouseX = e.screenX;
			lastMouseY = e.screenY;
		});
	}

	addObject() {
		const number = 11;

		const t1 =  new THREE.TextureLoader().load(image);
		const t2 =  new THREE.TextureLoader().load(image2);
		t1.wrapS = t1.wrapT = t2.wrapS = t2.wrapT = THREE.MirroredRepeatWrapping;

		this.material = new THREE.ShaderMaterial({
			side: THREE.DoubleSide,
			uniforms: {
				time: {type: "f", value: 0},
				t1: {type: "t", value: t1},
				t2: {type: "t", value: t2},
			},
			vertexShader,
			fragmentShader,
		});

		this.geometry = new THREE.BoxBufferGeometry(1, 1, 1, 200, 1, 200);
		const mesh = new THREE.Mesh(this.geometry, this.material);
		this.scene.add(mesh);
	}

	componentDidMount() {

		super.componentDidMount({antialias: true });
		this.initControls();
		this.mouseVel();
		this.addObject();
		this.animate();
	}

	animate() {
		if (!this.looped) return;
		this.time += 0.01 + this.fimalSpeed;
		this.fimalSpeed = Math.abs(this.speedX) / 100;
		super.animate();
		if (this.scene) {
			this.material.uniforms.time.value = this.time;
		}
	}
}
