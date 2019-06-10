/**
 * Created by Ellyson on 5/11/2018.
 */

import React from 'react';
import * as THREE from 'three';

const OrbitControls = require('three-orbit-controls')(THREE);

export default class TemplateFor3D extends React.Component {
	constructor() {
		super();
		this.state = {
			checked: false
		};
		this.time = 0;
		this.looped = true;
		this.clock = new THREE.Clock();
		this.mouse = new THREE.Vector2();
		this.resolution = new THREE.Vector2(window.innerWidth,window.innerHeight);
		this.HEIGHT = window.innerHeight;
		this.WIDTH = window.innerWidth;
	}

	initScene() {
		this.scene = new THREE.Scene();
	}

	initRenderer(param) {
		this.renderer = new THREE.WebGLRenderer(param);
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize( window.innerWidth, window.innerHeight);
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		this.refs.anchor.appendChild(this.renderer.domElement);
	}

	initCamera() {
		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000000);
	}

	initLight() {
		this.light = new THREE.DirectionalLight(0xffffff, 1.);
		this.ambientLight = new THREE.AmbientLight(0xffffff, .2);
		this.scene.add(this.light, this.ambientLight);
	}

	initControls(dom = this.renderer.domElement) {
		this.controls = new OrbitControls(this.camera, dom);
	}

	componentDidMount(param) {
		this.initRenderer(param);
		this.initScene();
		this.initCamera();
		window.addEventListener('resize', this.handleWindowResize.bind(this), false);
		this.looped = true;
	}

	componentWillUnmount() {
		this.renderer = null;
		this.looped = false;
	}

	animate() {
		requestAnimationFrame( this.animate.bind(this));
		this.time++;
		this.renderer.render( this.scene, this.camera );
	}

	handleWindowResize() {
		this.HEIGHT = window.innerHeight;
		this.WIDTH = window.innerWidth;
		this.renderer && this.renderer.setSize(this.WIDTH, this.HEIGHT);
		this.camera.aspect = this.WIDTH / this.HEIGHT;
		this.camera.updateProjectionMatrix();
	}

	attachMouseMoveEvent() {
		this.renderer.domElement.addEventListener("mousemove", this.onMouseMove.bind(this));
	}

	attachKeydownEvent() {
		window.addEventListener("keydown", this.onKeydown.bind(this));
	}

	attachMouseClickEvent() {
		this.renderer.domElement.addEventListener("click", this.onClick.bind(this));
	}



	onMouseMove(e) {
		this.getMousePosition(e);
	}

	onClick(e) {
		this.getMousePosition(e);
	}

	getMousePosition(e){
		this.mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
		this.mouse.y = -( e.clientY / window.innerHeight ) * 2 + 1;
	}

	initRaycaster(){
		this.raycaster = new THREE.Raycaster();
	}

	render() {
		return <div>
			<header/>
			<div ref="anchor" className="canvasDiv"/>
		</div>
	}
}
