/**
 * Created by Ellyson on 5/11/2018.
 */

import React from 'react';
import * as THREE from 'three';
import TemplateFor3D from '../../template3D/temp';
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
		// this.controls = new OrbitControls( this.camera );
		this.camera.position.set(156.26, 61.33, 148.04);
		this.camera.rotation.set(-0.48, 0.701, 0.324);
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
		this.audio.play();
	}

	componentWillUnmount(){
		super.componentWillUnmount()
		this.audio.pause();
		this.scene = null;
	}

	animate(){
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
				<div ref="anchor" style={{
					width: "100%",
					height: "100%",
					overflow: "hidden"}} />
			</div>)
	}
}

// /******/ (function(modules) { // webpackBootstrap
// 	/******/ 	// The module cache
// 	/******/ 	var installedModules = {};
//
// 	/******/ 	// The require function
// 	/******/ 	function __webpack_require__(moduleId) {
//
// 		/******/ 		// Check if module is in cache
// 		/******/ 		if(installedModules[moduleId])
// 		/******/ 			return installedModules[moduleId].exports;
//
// 		/******/ 		// Create a new module (and put it into the cache)
// 		/******/ 		var module = installedModules[moduleId] = {
// 			/******/ 			exports: {},
// 			/******/ 			id: moduleId,
// 			/******/ 			loaded: false
// 			/******/ 		};
//
// 		/******/ 		// Execute the module function
// 		/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
//
// 		/******/ 		// Flag the module as loaded
// 		/******/ 		module.loaded = true;
//
// 		/******/ 		// Return the exports of the module
// 		/******/ 		return module.exports;
// 		/******/ 	}
//
//
// 	/******/ 	// expose the modules object (__webpack_modules__)
// 	/******/ 	__webpack_require__.m = modules;
//
// 	/******/ 	// expose the module cache
// 	/******/ 	__webpack_require__.c = installedModules;
//
// 	/******/ 	// __webpack_public_path__
// 	/******/ 	__webpack_require__.p = "";
//
// 	/******/ 	// Load entry module and return exports
// 	/******/ 	return __webpack_require__(0);
// 	/******/ })
// /************************************************************************/
// /******/ ([
// 	/* 0 */
// 	/***/ function(module, exports, __webpack_require__) {
//
// 		/*global THREE requestAnimationFrame*/
//
// 		const binCount = 256
// 		const SpectrumAnalyzer = __webpack_require__(1)
// 		const analyzer = new SpectrumAnalyzer('https://raw.githubusercontent.com/rickycodes/tones/master/futurecop.mp3', binCount, 0.80)
//
// 		var camera, group, scene, renderer
// 		var mouseX = 0
// 		var mouseY = 0
// 		var windowHalfX = window.innerWidth / 2
// 		var windowHalfY = window.innerHeight / 2
//
// 		function animate () {
// 			render()
// 			requestAnimationFrame(animate)
// 		}
//
// 		function render () {
// 			camera.position.x += (mouseX - camera.position.x) * 0.05
// 			camera.position.y += (-mouseY - camera.position.y) * 0.05
// 			camera.lookAt(scene.position)
// 			var data = analyzer.getFrequencyData()
// 			analyzer.updateSample()
// 			group.children.forEach(function (child, i) {
// 				if (data[i] !== 0) {
// 					var zscale = data[i] * 0.08
// 					child.scale.z = zscale
// 				}
// 			})
// 			renderer.render(scene, camera)
// 		}
//
// 		function mouseMove (e) {
// 			mouseX = (e.clientX - windowHalfX) * 10
// 			mouseY = (e.clientY - windowHalfY) * 10
// 		}
//
// 		function setup () {
// 			document.addEventListener('mousemove', mouseMove)
// 			var xPos = 0
// 			var yPos = 0
// 			const width = 100
// 			const space = width + 40
//
// 			camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000)
// 			group = new THREE.Object3D()
// 			scene = new THREE.Scene()
//
// 			camera.position.z = 5000
//
// 			var light = new THREE.HemisphereLight(0xffffff, 1)
// 			group.add(light)
//
// 			var geometry = new THREE.BoxGeometry(width, width, width)
//
// 			for (var i = 1; i < binCount; i++) {
// 				var material = new THREE.MeshPhongMaterial({ color: i * 0x001EFF })
// 				var object = new THREE.Mesh(geometry, material)
//
// 				object.position.x = xPos
// 				object.position.y = yPos
//
// 				xPos += width + space
//
// 				if ((i % Math.floor(Math.sqrt(binCount))) === 0) {
// 					xPos = 0
// 					yPos -= width + space
// 				}
//
// 				group.add(object)
// 			}
//
// 			group.position.set(-2000, 1600, 0)
// 			group.rotation.x = -0.80
//
// 			scene.add(group)
//
// 			renderer = new THREE.WebGLRenderer({alpha: true})
// 			renderer.setPixelRatio(window.devicePixelRatio)
// 			renderer.setSize(window.innerWidth, window.innerHeight)
// 			renderer.sortObjects = false
//
// 			document.body.appendChild(renderer.domElement)
// 		}
//
// 		(function () {
// 			setup()
// 			animate()
// 		})()
//
//
// 		/***/ },
// 	/* 1 */
// 	/***/ function(module, exports) {
// 		// https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode
// 		const SpectrumAnalyzer = module.exports = function (track, binCount, smoothingTimeConstant) {
// 			var audio = document.createElement('audio')
// 			var Context = window['AudioContext'] || window['webkitAudioContext']
//
// 			audio.crossOrigin = 'anonymous'
// 			audio.src = track
//
// 			audio.currentTime = 0
// 			// audio.play()
//
// 			audio.addEventListener('ended', function (e) {
// 				this.currentTime = 0
// 				this.play()
// 			})
//
// 			this.context = new Context()
// 			this.analyzerNode = this.context.createAnalyser()
// 			this.audio = audio
//
// 			this.setBinCount(binCount)
// 			this.setSmoothingTimeConstant(smoothingTimeConstant)
// 			this.setSource(audio)
// 		}
//
// 		SpectrumAnalyzer.prototype = {
// 			setSource: function (source) {
// 				this.source = this.context.createMediaElementSource(source)
// 				this.source.connect(this.analyzerNode)
// 				this.analyzerNode.connect(this.context.destination)
// 			},
//
// 			setBinCount: function (binCount) {
// 				this.binCount = binCount
// 				this.analyzerNode.fftSize = binCount * 2
//
// 				this.frequencyByteData = new Uint8Array(binCount)  // frequency
// 				this.timeByteData = new Uint8Array(binCount)   // waveform
// 			},
//
// 			setSmoothingTimeConstant: function (smoothingTimeConstant) {
// 				this.analyzerNode.smoothingTimeConstant = smoothingTimeConstant
// 			},
//
// 			getFrequencyData: function () {
// 				return this.frequencyByteData
// 			},
//
// 			getTimeData: function () {
// 				return this.timeByteData
// 			},
//
// 			getAverage: function (index, count) {
// 				var total = 0
// 				var start = index || 0
// 				var end = start + (count || this.binCount)
//
// 				for (var i = start; i < end; i++) {
// 					total += this.frequencyByteData[i]
// 				}
//
// 				return total / (end - start)
// 			},
//
// 			getAverageFloat: function (index, count) {
// 				return this.getAverage(index, count) / 255
// 			},
//
// 			updateSample: function () {
// 				this.analyzerNode.getByteFrequencyData(this.frequencyByteData)
// 				this.analyzerNode.getByteTimeDomainData(this.timeByteData)
// 			}
// 		}
//
//
// 		/***/ }
// 	/******/ ]);
