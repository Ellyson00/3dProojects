/**
 * Created by Ellyson on 5/11/2018.
 */

import * as React from 'react';
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"

export default class TemplateFor3D extends React.Component<any, any>{
	time: number;
	looped: boolean;
	clock: THREE.Clock;
	mouse: THREE.Vector2;
	HEIGHT: number;
	WIDTH: number;
	resolution: THREE.Vector2;
	renderer: THREE.WebGLRenderer;
	camera: THREE.PerspectiveCamera;
	scene: THREE.Scene;
	light: THREE.DirectionalLight;
	ambientLight: THREE.AmbientLight;
	controls: OrbitControls;
	raycaster: THREE.Raycaster;
	canvas: any;

	constructor(props) {
		super(props);
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

	initRenderer() {
		this.renderer = new THREE.WebGLRenderer({alpha: true,antialias: true, preserveDrawingBuffer: true});
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setClearColor(0x000000);
		this.renderer.setSize( window.innerWidth, window.innerHeight);
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		this.canvas.appendChild(this.renderer.domElement);
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

	componentDidMount() {
		this.initRenderer();
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
		requestAnimationFrame(this.animate.bind(this));
		this.time++;
		this.renderer.render(this.scene, this.camera);
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

	onKeydown(e) {
	}

	onMouseMove(e) {
		this.getMousePosition(e);
	}

	onClick(e) {
		this.getMousePosition(e);
	}

	getMousePosition(e) {
		this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
		this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
	}

	initRaycaster() {
		this.raycaster = new THREE.Raycaster();
	}

	render(): any {
		return <div>
			<header/>
			<div ref={(ref) => this.canvas = ref} className="canvasDiv"/>
		</div>
	}
}
