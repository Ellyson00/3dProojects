/**
 * Created by Ellyson on 5/11/2018.
 */

import React from 'react';
import {Button} from 'react-bootstrap';
import Delaunator from 'delaunator';
import * as THREE from 'three';
import TemplateFor3D from '../../../templates/mainTemplate3D';
import Mouse from "../../../plugins/mouse.js";
import Particle from "../../../plugins/particles.js";
import Perlin from "../../../plugins/perlin.js";
import vertexShader from "./shaders/vertexShader.vert";
import fragmentShader from "./shaders/fragmentShader.frag";

let dots = [];
let myDots = [];

dots.push([0, 0]); //left-top corner
dots.push([1366,0]); //right-top corner
dots.push([1366,768]); //right-bottom corner
dots.push([0, 768]); //left-bottom corner

for (let i = 0; i < 3050; i++) { // simple dots
	dots.push([Math.random() * 1366, Math.random() * 768])
}

dots.forEach((d) => { // dots with physics
	myDots.push(new Particle(d[0], d[1], 0))
});

const delaunay = Delaunator.from(dots);
const triangles = delaunay.triangles;
const image = require('../../../img/image.jpg');

export default class TriangleWallpaper extends TemplateFor3D {
	constructor() {
		super();
		this.raycaster = new THREE.Raycaster();
	}

	onDocumentMouseDown(event) {
		const mouse = new THREE.Vector2();
		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
		this.raycaster.setFromCamera(mouse, this.camera.clone());
		if(this.state.checked) this.intersects = this.raycaster.intersectObject(this.planeMesh);
	}

	initScene() {
		super.initScene();
		this.scene.background = new THREE.Color(0xffffff);
	}

	initControls() {
		super.initControls();
		this.camera.position.set(1366/2, 768/2, 770);
		this.controls.target.set(1366/2, 768/2, 0);
	}

	initPlateMesh() {
		let loader = new THREE.TextureLoader();
		loader.load(image, (texture) => {
			this.geometry = new THREE.Geometry();
			const material = new THREE.ShaderMaterial({
				extensions: {
					derivatives: "#extension GL_OES_standard_derivatives : enable"
				},
				uniforms: {
					textureSampler:{type: "t", value: texture}
				},
				vertexShader: vertexShader,
				fragmentShader: fragmentShader,
				side: THREE.DoubleSide,
			});

			dots.forEach((d) => {
				this.geometry.vertices.push(new THREE.Vector3(d[0], d[1], 0));
			});

			for (let i = 0; i < triangles.length; i = i + 3) {
				this.geometry.faces.push(new THREE.Face3(triangles[i], triangles[i + 1], triangles[i + 2]));
			}
			this.geometry.computeBoundingBox();
			//--------------------------- for adapting image texture ------------------
			const max = this.geometry.boundingBox.max,
				 min = this.geometry.boundingBox.min;
			const offset = new THREE.Vector2(0 - min.x, 0 - min.y);
			const range = new THREE.Vector2(max.x - min.x, max.y - min.y);
			const faces = this.geometry.faces;

			this.geometry.faceVertexUvs[0] = [];

			for (let i = 0; i < faces.length ; i++) {
				const v1 = this.geometry.vertices[faces[i].a],
					v2 = this.geometry.vertices[faces[i].b],
					v3 = this.geometry.vertices[faces[i].c];
				this.geometry.faceVertexUvs[0].push([
					new THREE.Vector2((v1.x + offset.x) / range.x , (v1.y + offset.y) / range.y),
					new THREE.Vector2((v2.x + offset.x) / range.x , (v2.y + offset.y) / range.y),
					new THREE.Vector2((v3.x + offset.x) / range.x , (v3.y + offset.y) / range.y)
				]);
			}
			this.geometry.uvsNeedUpdate = true;
			//--------------------------- end  ------------------------
			this.planeMesh = new THREE.Mesh(this.geometry, material);
			this.scene.add(this.planeMesh);
		});
	}
	handleWindowResize() {
		this.HEIGHT = window.innerHeight;
		this.WIDTH = window.innerWidth;
		this.renderer && this.renderer.setSize(this.WIDTH, this.HEIGHT);
		this.camera.aspect = this.WIDTH / this.HEIGHT;
		this.camera.updateProjectionMatrix();
	}


	componentDidMount() {
		super.componentDidMount();
		this.initControls();
		this.initPlateMesh();
		this.pos = new Mouse(this.renderer.domElement);
		window.addEventListener('mousemove', this.onDocumentMouseDown.bind(this), false);
		window.addEventListener('resize', this.handleWindowResize.bind(this), false);
		this.animate();
	}

	animate() {
		if (!this.looped) return;
		super.animate();
		if (this.geometry) {
			myDots.forEach((d, i) => {
				if (this.state.checked) {
					if (this.intersects && this.intersects.length > 0) d.think(this.intersects[0].point);
					this.geometry.vertices[i].z = d.z;
				} else this.geometry.vertices[i].z = 60 * Perlin(d.x / 50, d.y / 50,this.time / 100);
			});
			this.geometry.verticesNeedUpdate = true;
		}
	}


	render() {
		return <div>
			<header>
				<Button onClick={() => this.setState({checked: !this.state.checked})}>
					{!this.state.checked ? "MouseMod" : "Perlin Noise"}
				</Button>
			</header>
			<div ref="anchor" className="canvasDiv"/>
		</div>
	}
}
