/**
 * Created by Ellyson on 5/11/2018.
 */

import React from 'react';
import * as THREE from 'three';

const threeSky = require('three-sky');


const OrbitControls = require('three-orbit-controls')(THREE);

export default class Sky extends React.Component {
	constructor(){
		super();
		this.state = {
			checked: false
		};
		this.time = 0;
	}

	initScene(){
		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color(0xffffff);
		this.light = new THREE.DirectionalLight( 0xffffff, 0.8 );
		this.scene.add( this.light );
		this.ambiantLight = new THREE.AmbientLight(0xffffff, 0.1)
		this.scene.add( this.ambiantLight );
	}

	initRenderer(){
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize( window.innerWidth, window.innerHeight);
		this.refs.anchor.appendChild(this.renderer.domElement);

	}
	initCamera(){
		this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight , 0.1, 2000 );
	}

	initControls(){
		this.controls = new OrbitControls(this.camera, this.renderer.domElement);
		this.camera.position.set(0, 0, 5);
		// this.controls.target.set(0, 0, 0);
	}

	initSky(){
		this.sky =  new threeSky();
		console.log(this.sky);
		this.sky.scale.setScalar( 300 );
		this.scene.add(this.sky);

		let sunSphere = new THREE.Mesh(
			new THREE.SphereBufferGeometry( 20000, 16, 8 ),
			new THREE.MeshBasicMaterial( { color: 0xffffff } )
		);
		sunSphere.position.y = - 700000;
		sunSphere.visible = false;
		this.scene.add( sunSphere );

		this.effectController  = {
			turbidity: 10,
			rayleigh: 2,
			mieCoefficient: 0.005,
			mieDirectionalG: 0.8,
			luminance: 1,
			inclination: 0.49, // elevation / inclination
			azimuth: 0.25, // Facing front,
			sun: ! true
		};
		this.distance = 180;
		this.uniforms = this.sky.material.uniforms;
		this.uniforms.turbidity.value = this.effectController.turbidity;
		this.uniforms.rayleigh.value = this.effectController.rayleigh;
		this.uniforms.luminance.value = this.effectController.luminance;
		this.uniforms.mieCoefficient.value = this.effectController.mieCoefficient;
		this.uniforms.mieDirectionalG.value = this.effectController.mieDirectionalG;
		this.theta = Math.PI * ( this.effectController.inclination - 0.5 );
		this.phi = 2 * Math.PI * ( this.effectController.azimuth - 0.5 );
		this.light.position.x = this.distance * Math.cos( this.phi );
		this.light.position.y = this.distance * Math.sin( this.phi ) * Math.sin( this.theta );
		this.light.position.z = this.distance * Math.sin( this.phi ) * Math.cos( this.theta );
		sunSphere.position.x = this.distance * Math.cos( this.phi );
		sunSphere.position.y = this.distance * Math.sin( this.phi ) * Math.sin( this.theta );
		sunSphere.position.z = this.distance * Math.sin( this.phi ) * Math.cos( this.theta );
		sunSphere.visible = this.effectController.sun;
		this.uniforms.sunPosition.value.copy( sunSphere.position );


		var geometry = new THREE.BoxGeometry( 1, 1, 1 );
		var material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
		var cube = new THREE.Mesh( geometry, material );
		cube.position.set(0,0,0);
		this.scene.add( cube );
	}

	componentDidMount() {

		this.initRenderer();
		this.initScene();
		this.initCamera();
		this.initSky();
		this.initControls();

		this.looped = true;
		this.animate();

	}
	componentWillUnmount(){
		this.renderer = null;
		this.looped = false;
		// window.cancelAnimationFrame(requestId);
	}
	animate() {
		if(!this.looped) return;
		requestAnimationFrame( this.animate.bind(this));
		this.time++;
		this.updateSun();
		this.renderer.render( this.scene, this.camera );
	}

	updateSun() {
		var theta = Math.PI * ( this.effectController.inclination - 0.5 );
		var phi = 2 * Math.PI * ( this.effectController.azimuth - 0.5 );
		document.getElementById("sky").innerHTML = "sun posiition:\n "+this.light.position.y;
		if(this.distance * Math.sin( phi ) * Math.sin( theta + this.time/1000 ) < -20) {
			this.time+=10;
		}
		this.light.position.x = this.distance * Math.cos( phi );
		this.light.position.y = this.distance * Math.sin( phi ) * Math.sin( theta + this.time/1000 );
		this.light.position.z = this.distance * Math.sin( phi ) * Math.cos( theta );
		this.uniforms.sunPosition.value.copy( this.light.position );


	}


	render() {
		return (
			<div>
				<header id="sky" style={{position:"fixed",left:"15px",top:"15px",background: "rgba(0, 0, 0, 0.33)",
					padding: "21px",
					color: "white"}} className="">
				</header>
				<div ref="anchor" style={{
					width: "100%",
					height: "100%",
					overflow: "hidden"}} />
			</div>)
	}
}
