/**
 * Created by Ellyson on 5/11/2018.
 */

import React from 'react';
import * as THREE from 'three';
import TemplateFor3D from '../../templates/mainTemplate3D';
import {Button} from 'react-bootstrap';

const trek1 = require("./music4.mp3");
const trek2 = require("./music.mp3");
const trek3 = require("./music2.mp3");
const trek4 = require("./music3.mp3");
const background = require("./intothree.png");

export default class ThirdWork extends TemplateFor3D {
	constructor(){
		super();
		this.state = {
			checked: false,
			treks: [trek1, trek2, trek3, trek4]
		};
	}

	initObjects(){
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
		// super.initControls();
		this.camera.position.set(43.22, 36.56, 94.165);
		this.camera.rotation.set(-0.67, -0.006, -0.005);

		// this.controls.update();

	}

	initAudioObject(){

		this.audio = new Audio();
		this.audio.src = this.state.treks[0];
		let audioCtx = new (window['AudioContext'] || window['webkitAudioContext'])();
		let audioSrc = audioCtx.createMediaElementSource(this.audio);
		this.analyser = audioCtx.createAnalyser();
		let bufferLength = this.analyser.frequencyBinCount;
		this.analyser.fftSize = this.analyser.frequencyBinCount;
		this.analyser.minDecibels = -90;
		this.analyser.maxDecibels = -10;
		this.analyser.smoothingTimeConstant = 0.90;
		this.dataArray = new Uint8Array(bufferLength);
		this.timeByteData = new Uint8Array(bufferLength);
		audioSrc.connect(this.analyser);
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


	componentDidMount() {
		super.componentDidMount();
		this.initObjects();
		this.animate();
		setTimeout(this.playTrack(0),0) //autoplay-policy-changes
	}

	componentWillUnmount(){
		super.componentWillUnmount()
		this.audio.pause();
		this.scene = null;
	}

	animate(){
		if(!this.looped) return;
		super.animate();
		this.analyser && this.analyser.getByteFrequencyData(this.dataArray);// frequency
		this.analyser && this.analyser.getByteTimeDomainData(this.timeByteData);// waveform
		this.scene.children.forEach((mesh, i) => {
			let data = this.dataArray;
			if(mesh instanceof THREE.Mesh && mesh.geometry.type !== "PlaneGeometry"){
				let zscale = 1 + data[i] * 0.1;
				mesh.scale.y = zscale/2 ;
				mesh.position.y = zscale/2;
				mesh.material.color.g = mesh.userData.r * mesh.scale.y*.13 +0.4	;
			}
		});
	}

	playTrack(trackNumber){
		this.audio.src = this.state.treks[trackNumber];
		this.audio.play();
	}

	render() {
		return (
			<div>
				<header className="playList">
					<Button onClick={() => this.playTrack(0)}>Daft Punk - too Long</Button>
					<Button onClick={() => this.playTrack(1)}>Pendulum - Still Grey</Button>
					<Button onClick={() => this.playTrack(2)}>Arrow Benjamin - Love and Hate</Button>
					<Button onClick={() => this.playTrack(3)}>Matt Darey Pres. Urban - See the Sun</Button>
				</header>
				<div ref="anchor" className="canvasDiv"/>
			</div>)
	}
}
