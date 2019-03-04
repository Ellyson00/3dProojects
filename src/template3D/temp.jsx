/**
 * Created by Ellyson on 5/11/2018.
 */

import React from 'react';
import * as THREE from 'three';

const OrbitControls = require('three-orbit-controls')(THREE);

export default class TemplateFor3D extends React.Component {
	constructor(){
		super();
		this.state = {
			checked: false
		};
		this.time = 0;
		this.mouse = new THREE.Vector2(0,0);
		this.resolution = new THREE.Vector2(window.innerWidth,window.innerHeight);
		this.HEIGHT = window.innerHeight;
		this.WIDTH = window.innerWidth;
	}

	initScene(){
		this.scene = new THREE.Scene();
	}

	initRenderer(param) {
		this.renderer = new THREE.WebGLRenderer(param);
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize( window.innerWidth, window.innerHeight);
		this.renderer.shadowMap.enabled = true;
		this.refs.anchor.appendChild(this.renderer.domElement);

	}
	initCamera() {
		this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight , 0.1, 2000 );
	}

	initControls() {
		this.controls = new OrbitControls(this.camera, this.renderer.domElement);
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
		if(!this.looped) return;
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

	render() {
		return (
			<div>
				<header style={{position:"fixed",left:"15px",top:"15px"}} className="">
				</header>
				<div ref="anchor" style={{
					width: "100%",
					height: "100%",
					overflow: "hidden"}} />
			</div>)
	}
}
