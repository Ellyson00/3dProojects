/**
 * Created by Ellyson on 5/11/2018.
 */

import React from 'react';
// import {Button} from 'react-bootstrap';
import * as THREE from 'three';

const spark = require("./spark1.png");

const vertex = `
		attribute float size;
		varying vec3 vColor;
		void main() {
		vColor = color;
		vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
		gl_PointSize = size * ( 300.0 / -mvPosition.z);
		gl_Position = projectionMatrix * mvPosition;
	}`;

const frag = `uniform sampler2D texture;
varying vec3 vColor;
void main() {
	gl_FragColor = vec4( vColor, 1.0 );
	gl_FragColor = gl_FragColor * texture2D( texture, gl_PointCoord );
}`;

const OrbitControls = require('three-orbit-controls')(THREE);
const particles = 100000;

export default class Galaxy extends React.Component {
	constructor(){
		super();
		this.state = {
			checked: false
		};
		this.time = 0;
	}

	initScene(){
		this.scene = new THREE.Scene();
		window["scene"] = this.scene;
		// this.scene.background = new THREE.Color(0xffffff);
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

		this.camera.position.set(0, 0, 770);
	}

	componentDidMount() {

		this.initRenderer();
		this.initScene();
		this.initCamera();

		const uniforms = {
			texture:   { value: new THREE.TextureLoader().load(spark) }
		};
		const shaderMaterial = new THREE.ShaderMaterial( {
			uniforms:       uniforms,
			vertexShader:   vertex,
			fragmentShader: frag,
			blending:       THREE.AdditiveBlending,
			depthTest:      false,
			transparent:    true,
			vertexColors:   true
		});
		const radius = 200;
		this.geometry = new THREE.BufferGeometry();
		const positions = [];
		const colors = [];
		const sizes = [];
		const color = new THREE.Color();
		for ( let i = 0; i < particles; i ++ ) {
			positions.push( ( Math.random() * 2 - 1 ) * radius );
			positions.push( ( Math.random() * 2 - 1 ) * radius );
			positions.push( ( Math.random() * 2 - 1 ) * radius );
			color.setHSL( i / particles, 1.0, 0.5 );
			colors.push( color.r, color.g, color.b );
			sizes.push( 20 );
		}
		this.geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
		this.geometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
		this.geometry.addAttribute( 'size', new THREE.Float32BufferAttribute( sizes, 1 ));
		this.particleSystem = new THREE.Points( this.geometry, shaderMaterial );
		this.scene.add( this.particleSystem );
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
		const time = Date.now() * 0.005;
		// this.particleSystem.position.z -=1;
		let sizes = this.geometry.attributes.size.array;
		for ( var i = 0; i < particles; i++ ) {
			sizes[ i ] = 10 * ( 1 + Math.sin( 0.1 * i + time ) );
		}
		this.geometry.attributes.size.needsUpdate = true;
		requestAnimationFrame( this.animate.bind(this));
		this.time++;
		this.renderer.render( this.scene, this.camera );
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
