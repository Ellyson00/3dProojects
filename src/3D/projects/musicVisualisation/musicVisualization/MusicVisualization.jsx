/**
 * Created by Ellyson on 5/11/2018.
 */

import React from 'react';
import * as THREE from 'three';
import TemplateFor3D from '../../../templates/mainTemplate3D';
import {Button} from 'react-bootstrap';
import fragmentShader from './shaders/shader.frag';
import vertexShader from './shaders/shader.vert';

const trek1 = require("../../../sounds/music/music4.mp3");
const trek2 = require("../../../sounds/music/music.mp3");
const trek3 = require("../../../sounds/music/music2.mp3");
const trek4 = require("../../../sounds/music/music3.mp3");
const background = require("../../../img/intothree.png");

export default class MusicVisualization extends TemplateFor3D {

	static CUBE_COUNT = 464;
	constructor() {
		super();
		this.state = {
			checked: false,
			treks: [trek1, trek2, trek3, trek4]
		};
	}

	async initObjects() {
		this.scene.background = await new THREE.TextureLoader().load(background);

		this.initControls();
		this.initAudioObject();
		this.initCubes();

	}

	initControls() {
		// super.initControls();
		//
		// this.camera.position.set(0, 4, 1);
	}

	initAudioObject() {
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

	initCubes() {

		let x = 0, z = 0;

		const instancedBoxGeo = new THREE.InstancedBufferGeometry().copy(new THREE.BoxBufferGeometry(2, 1, 2));
		instancedBoxGeo.maxInstancedCount = 0;

		const position = new Float32Array(MusicVisualization.CUBE_COUNT * 3);
		const index = new Float32Array(MusicVisualization.CUBE_COUNT);

		for (let i = 0; i < MusicVisualization.CUBE_COUNT * 3; i += 3) {
			position[i] = x;
			position[i + 1] = .5;
			position[i + 2] = z;
			index[i] = i;
			index[i + 1] = i + 1;
			index[i + 2] = i + 2;
			x += 3;
			if (x >= 86) {
				z += 5;
				x = 0
			}
			instancedBoxGeo.maxInstancedCount++;
		}

		instancedBoxGeo.addAttribute("boxPosition", new THREE.InstancedBufferAttribute(position, 3));
		instancedBoxGeo.addAttribute("boxIndex", new THREE.InstancedBufferAttribute(index, 1));

		const shaderMaterial = new THREE.ShaderMaterial( {
			uniforms: {freqData: new THREE.Uniform(this.dataArray)},
			vertexShader: vertexShader,
			fragmentShader: fragmentShader,
		});

		const waveFormMesh = new THREE.Mesh(instancedBoxGeo, shaderMaterial);
		this.scene.add(waveFormMesh);
	}

	async componentDidMount() {
		await super.componentDidMount();
		await this.initObjects();
		await this.camera.position.set(86 / 2, 88 / 3, 84 * 1.2);
		await this.camera.lookAt(new THREE.Vector3(86/ 2, 0, 88/2));
		await this.animate();
		await this.playTrack(0);
	}

	componentWillUnmount() {
		super.componentWillUnmount();
		this.audio.pause();
		this.scene = null;
	}

	animate() {
		if (!this.looped) return;
		super.animate();
		this.analyser && this.analyser.getByteFrequencyData(this.dataArray);// frequency
		this.analyser && this.analyser.getByteTimeDomainData(this.timeByteData);// waveform
	}

	async playTrack(trackNumber) {
		this.audio.src = await this.state.treks[trackNumber];
		await this.audio.play();
	}

	render() {
		return <div>
			<header className="playList">
				<Button onClick={() => this.playTrack(0)}>Daft Punk - too Long</Button>
				<Button onClick={() => this.playTrack(1)}>Pendulum - Still Grey</Button>
				<Button onClick={() => this.playTrack(2)}>Arrow Benjamin - Love and Hate</Button>
				<Button onClick={() => this.playTrack(3)}>Matt Darey Pres. Urban - See the Sun</Button>
			</header>
			<div ref="anchor" className="canvasDiv"/>
		</div>
	}
}
