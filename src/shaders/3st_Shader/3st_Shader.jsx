/**
 * Created by Ellyson on 5/11/2018.
 */

import React from 'react';
//import {Button} from 'react-bootstrap';
import * as THREE from 'three';
import {vertexShader, fragmentShader} from './shaders';

const OrbitControls = require('three-orbit-controls')(THREE);
export default class Shader3 extends React.Component {
	constructor(){
		super();
		this.mouse=new THREE.Vector2(0,0);
		this.resolution= new THREE.Vector2(window.innerWidth,window.innerHeight);
		this.state = {
			checked: false
		};
		this.time = 0;
	}

	initScene(){
		this.scene = new THREE.Scene();
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
		this.camera.position.set(0, 0, 10);
	}

	initShader(){

		const geometry = new THREE.SphereBufferGeometry(4, 30, 30);
		let array = [];

		for (let v = 0; v < geometry.attributes.position.array.length/3; v++) {
			array.push(Math.random() * 3);
		}
		geometry.addAttribute("displacement",new THREE.Float32BufferAttribute( array, 1 ).setDynamic( true ));
		const customMaterial = new THREE.ShaderMaterial(
			{
				uniforms: {
				},
				vertexShader: vertexShader,
				fragmentShader: fragmentShader,
			}   );

		this.sphere = new THREE.Mesh(geometry, customMaterial );
		console.log(geometry.vertices,this.sphere)
		//
		this.scene.add( this.sphere );
	}

	componentDidMount() {

		this.initRenderer();
		this.initScene();
		this.initCamera();
		this.initShader();
		this.initControls();
		this.renderer.domElement.addEventListener("mousemove",this.onMouseMove.bind(this));
		this.looped = true;
		this.animate();

	}
	onMouseMove(e){
		this.mouse=new THREE.Vector2(e.offsetX / window.innerWidth,e.offsetY/window.innerHeight);
	}
	componentWillUnmount(){
		this.renderer = null;
		this.looped = false;
		// window.cancelAnimationFrame(requestId);
	}
	animate() {
		if(!this.looped) return;
		requestAnimationFrame( this.animate.bind(this));
		this.time+= 0.02;
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