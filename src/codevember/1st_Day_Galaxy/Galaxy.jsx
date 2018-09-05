/**
 * Created by Ellyson on 5/11/2018.
 */

import React from 'react';
import * as THREE from 'three';
import {frag_titan, vert_titan, frag_derbis, vertex_derbis, frag_saturn, vertex_saturn} from "./shaders";

const saturn = require("./images/saturn.jpg");
const titano = require("./images/titano.jpg");

const dn = require(`./images/skyBox/dn.png`);
const up = require(`./images/skyBox/up.png`);
const lf = require(`./images/skyBox/lf.png`);
const rt = require(`./images/skyBox/rt.png`);
const ft = require(`./images/skyBox/ft.png`);
const bk = require(`./images/skyBox/bk.png`);

const OrbitControls = require('three-orbit-controls')(THREE);
const textureLoader = new THREE.TextureLoader();

let clock = new THREE.Clock(),
shadowType = 1,
time = 0,
speed = 0.002,
n = 500000;

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
	}

	initRenderer(){
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize( window.innerWidth, window.innerHeight);
		this.refs.anchor.appendChild(this.renderer.domElement);

	}
	initCamera(){
		this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight , 0.1, 2000 );
		this.camera.position.set(-285, 15, -115);
	}

	initControls(){
		this.controls = new OrbitControls(this.camera, this.renderer.domElement);
		this.controls.enableZoom = false;
		this.controls.enableRotate = false;
		this.controls.enablePan = false;
		this.controls.update();
	}

	initSaturn() {

		const saturnMaterial = new THREE.ShaderMaterial({
			uniforms: {
				texture: { type: 't', value: textureLoader.load(saturn)},
				time: {value: 1.0}
			},
			vertexShader: vertex_saturn,
			fragmentShader: frag_saturn,
		});

		this.saturn = new THREE.Mesh( new THREE.SphereBufferGeometry( 100, 64, 64 ), saturnMaterial);

		this.scene.add( this.saturn );

	}

	initTitano() {

		const titanoMaterial = new THREE.ShaderMaterial({
			uniforms: {
				texture: { type: 't', value: textureLoader.load(titano) },
				time: {value: 1.0}
			},
			vertexShader: vert_titan,
			fragmentShader: frag_titan,
		});
		this.titano = new THREE.Mesh( new THREE.SphereBufferGeometry( 20, 64, 64 ), titanoMaterial);
		this.scene.add( this.titano );

	}

	initRings(){

		let internalRingGeometry = new THREE.BufferGeometry();

		const externalRingMaterial= new THREE.ShaderMaterial({
			uniforms: {
				time: {value: 10.0},
				stretch: {value: new THREE.Vector3(290, 40, 180)},
				shadowType: {value: shadowType}
			},
			vertexShader: vertex_derbis,
			fragmentShader: frag_derbis,
		});

		const internalRingMaterial= new THREE.ShaderMaterial({
			uniforms: {
				time: {value: 10.0},
				stretch: {value: new THREE.Vector3(190, 30, 135)},
				shadowType: {value: 1.0}
			},
			vertexShader: vertex_derbis,
			fragmentShader: frag_derbis,
		});

		const thetas = new Float32Array(n);
		const delayX = new Float32Array(n);
		const delayZ = new Float32Array(n);

		for(let i = 0; i < n; i++){
			const theta = Math.random()*2*Math.PI;

			thetas[i] = theta;
			delayX[i] = (Math.random()-0.5)*80;
			delayZ[i] = (Math.random()-0.5)*30;
		}

		internalRingGeometry.addAttribute('base_angle', new THREE.BufferAttribute(thetas, 1))
			.addAttribute('offsetX', new THREE.BufferAttribute(delayX, 1))
			.addAttribute('offsetZ', new THREE.BufferAttribute(delayZ, 1))
			.addAttribute('position', new THREE.BufferAttribute(new Float32Array(n*3), 3));

		this.externalRing = new THREE.Points(internalRingGeometry, externalRingMaterial);
		this.internalRing = new THREE.Points(internalRingGeometry.clone(), internalRingMaterial);

		this.scene.add(this.internalRing);
		this.scene.add(this.externalRing);
	}

	Saturn(){
		this.initSaturn();
		this.initTitano();
		this.initRings();
		this.initSkyBox();
	}

	initSkyBox(){
		const skyGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );

		const imageURLs = [lf,rt, dn,up,bk,ft];
		const textureCube = THREE.ImageUtils.loadTextureCube( imageURLs );
		const shader = THREE.ShaderLib[ "cube" ];
		shader.uniforms[ "tCube" ].value = textureCube;
		const skyMaterial = new THREE.ShaderMaterial( {
			fragmentShader: shader.fragmentShader,
			vertexShader: shader.vertexShader,
			uniforms: shader.uniforms,
			depthWrite: false,
			side: THREE.BackSide
		});
		const skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
		this.scene.add( skyBox )
	}

	componentDidMount() {

		this.initRenderer();
		this.initScene();
		this.initCamera();
		this.Saturn();
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

		this.saturn.rotation.y -= speed ;

		time += 0.00001;

		this.saturn.material.uniforms.time.value += 0.3 * speed;
		this.titano.material.uniforms.time.value += 0.8 * speed;
		this.internalRing.material.uniforms.time.value += 0.55 * speed;
		this.externalRing.material.uniforms.time.value += 0.55 * speed;

		this.internalRing.material.uniforms.shadowType.value = shadowType;
		this.externalRing.material.uniforms.shadowType.value = shadowType;

		this.time++;
		this.renderer.render( this.scene, this.camera );
	}


	render() {
		return (
			<div>
				<header style={{position: "fixed", left: "15px", top: "15px"}} className="">
				</header>
				<div ref="anchor" style={{
					width: "100%",
					height: "100%",
					overflow: "hidden"}} />
			</div>)
	}
}
