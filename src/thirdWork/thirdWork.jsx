/**
 * Created by Ellyson on 5/11/2018.
 */

import React from 'react';
import * as THREE from 'three';
import {Button} from 'react-bootstrap';

const trek1 = require("./music4.mp3");
const trek2 = require("./music.mp3");
const trek3 = require("./music2.mp3");
const trek4 = require("./music3.mp3");
const background = require("./intothree.png");

const OrbitControls = require('three-orbit-controls')(THREE);

export default class ThirdWork extends React.Component {
	constructor(){
		super();
		this.state = {
			checked: false,
			treks: [trek1,trek2,trek3,trek4]
		};
		this.stop = true;
		this.time = 0;
	}

	initScene(){
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(35, window.innerWidth/window.innerHeight, 1, 1000);
		this.scene.add(this.camera);
		this.light = new THREE.DirectionalLight(new THREE.Color(0xffffff));
		this.light.position.set(170, 150, 100);
		this.scene.add(this.light);
		const texture = new THREE.TextureLoader().load(background);
		this.scene.background = texture;

		this.initControls();
		this.initAudioObject();
		this.initCubes();

	}

	initControls(){
		// this.controls = new OrbitControls( this.camera );
		this.camera.position.set(156.26, 61.33, 148.04);
		this.camera.rotation.set(-0.48, 0.701, 0.324);
		// this.controls.update();

	}

	initAudioObject(){

		this.audio = new Audio();
		this.audio.src = this.state.treks[0];
		let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
		let audioSrc = audioCtx.createMediaElementSource(this.audio);
		this.analyser = audioCtx.createAnalyser();
		let bufferLength = this.analyser.frequencyBinCount;
		this.analyser.fftSize = this.analyser.frequencyBinCount;
		this.analyser.smoothingTimeConstant = 0.90;
		audioSrc.connect(this.analyser);

		this.dataArray = new Uint8Array(bufferLength);
		this.timeByteData = new Uint8Array(bufferLength);
		this.analyser.connect(audioCtx.destination);

	}
	initCubes(){
		let color = new THREE.Color();
		let x = 0, z = 0;
		// let deg = Math.PI/this.analyser.frequencyBinCount;
		for(let i = 0;i < 464; i++){

			let geometry = new THREE.CubeGeometry(2,2,2);
			let material = new THREE.MeshLambertMaterial({
				color: color
			});
			let mesh = new THREE.Mesh(geometry, material);
			mesh.scale.y = .5;

			mesh.material.color.g *= .5 ;
			mesh.material.color.b = 1 ;
			mesh.material.color.r = 0;

			mesh.userData = color;

			/*if (this.state.circle) {
				mesh.position.set(100 * Math.sin(2 * deg * i), 0, 100 * Math.cos(2 * deg * i));
				mesh.rotation.y = 2 * deg * i;
				mesh.rotation.z = Math.PI / 2;
			} else  */mesh.position.set(x,.5,z);

			this.scene.add(mesh);

			x += 3;

			if(x >= 86){
				z += 5;
				x = 0
			}
		}
	}

	initRender(){
		this.renderer = new THREE.WebGLRenderer({antialias: true,alpha: true});
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		// this.renderer.sortObjects = false;
		this.renderer.shadowMap.enabled = true;
		// this.renderer.setClearColor(0xcbc3b8);
		this.refs.visualisation.appendChild(this.renderer.domElement);
	}

	componentDidMount() {

		// this.renderer.domElement.addEventListener('mousemove', this.handleMouseMove.bind(this), false);
		this.stop = true;

		this.initRender();
		this.initScene();


		this.animate();
		this.audio.play();

		// document.getElementById("webgl-container").appendChild(this.renderer.domElement);

		// window.addEventListener("resize", this.resize.bind(this));

	}
	componentWillUnmount(){

		this.audio.pause();
		this.renderer = null;
		this.scene = null;
		this.stop = false;

	}

	animate(){
		if(!this.stop) return;
		 this.scene.children.forEach((mesh, i) => {
			let data = this.dataArray;

			 this.analyser && this.analyser.getByteFrequencyData(this.dataArray);
			 this.analyser && this.analyser.getByteTimeDomainData(this.timeByteData);

			if(mesh instanceof THREE.Mesh && mesh.geometry.type !== "PlaneGeometry"){
				let zscale = 1 + data[i] * 0.1;
				mesh.scale.y = zscale/2 ;
				mesh.position.y = zscale/2;
				mesh.material.color.g = mesh.userData.r * mesh.scale.y*.13 +0.4	;
			}
		});
		this.renderer.render(this.scene,this.camera);
		requestAnimationFrame(this.animate.bind(this));
	}

	render() {
		return (
			<div>
				<header style={{position:"fixed",left:"15px",top:"15px",width: "135px"}} className="">
					<Button style={{marginBottom:"5px"}} onClick={()=>{
						this.audio.src = this.state.treks[0];
						this.audio.play();
					}}>Daft Punk - too Long</Button>
					<Button style={{marginBottom:"5px"}} onClick={()=>{
						this.audio.src = this.state.treks[1];
						this.audio.play();
					}}>Pendulum - Still Grey</Button>
					<Button style={{marginBottom:"5px"}} onClick={()=>{
						this.audio.src = this.state.treks[2];
						this.audio.play();
					}}>Arrow Benjamin - Love and Hate</Button>
					<Button style={{marginBottom:"5px"}} onClick={()=>{
						this.audio.src = this.state.treks[3];
						this.audio.play();
					}}>Matt Darey Pres. Urban - See the Sun</Button>

				</header>
				<div ref="visualisation" />
			</div>)
	}
}