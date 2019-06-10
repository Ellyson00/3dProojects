/**
 * Created by Ellyson on 5/11/2018.
 */
import React from 'react';
import * as THREE from 'three';
import {Button, ProgressBar} from "react-bootstrap";

import TemplateFor3D from '../../../templates/mainTemplate3D';
import {interectiveMeshes} from './components/interactiveMeshes';
import {loadHouse} from './components/House';
import {onMouseMove, onKeydown, onClick} from './components/events';
import flyingText from './components/flyingText';
import Light from './components/light';
import CssRenderer from './components/CSS3DRenderer';
import {COLORS, colorsArray} from './components/constants';

const TWEEN = require('@tweenjs/tween.js');
const Zlib = require("three/examples/js/libs/inflate.min");
window.Zlib = Zlib.Zlib;

export default class House extends TemplateFor3D {
	constructor(){
		super();
		this.interectiveMeshes = [...interectiveMeshes];
		this.aimedObjectName = "";
		this.currentColor = {index: 0, color: COLORS.white.clone()};
		this.floors = {};
		this.additinalFloor = 0;
		this.additinalFloorArray = [];

		this.doorLight = new Light(this.currentColor);
		this.cssScene = new THREE.Scene();
		this.state = {
			progress: 0,
			loaded: false
		};
	}

	initCamera() {
		super.initCamera();
	}

	initControls() {
		super.initControls(this.cssRenderer.renderer.domElement);
		this.controls.enableKeys  = false;
		this.resetCamera();
		this.controls.update();
	}

	resetCamera(){
		this.controls.enabled = false;
		this.camera.position.set(219.2, 50.0, 120.0);
		this.camera.rotation.set(-.0, 1.04, 0);
		this.camera.lookAt(0,0,0)
	}

	async loadOrDeleteHouse() {
		if(!this.state.loaded){
			await this.scene.add(...this.interectiveMeshes);
			this.controls.enabled = true;
			await this.setState({loaded: true});
			await loadHouse(this);
		} else {
			this.scene.remove(this.house, ...this.interectiveMeshes);
			this.resetCamera();
			this.interectiveMeshes[2].position.y = 0;
			await this.setState({loaded: false, progress: 0});
			this.flyingText.show = false;
			this.scene.remove(this.flyingText.plane);
			this.cssScene.remove(this.flyingText.cssObject);
			this.scene.remove(this.flyingText2.plane);
			this.cssScene.remove(this.flyingText2.cssObject);
		}
	}

	updateLoadingBar(e){
		this.setState({progress: Math.floor(e.loaded / e.total * 100)});
	}

	initDoorLight() {
		this.scene.add(this.doorLight.spotLight, this.doorLight.pointLight);
		this.light.position.set(700 ,2000,500);
	}

	onClick(){
		onClick(this);
	}

	handleWindowResize(){
		super.handleWindowResize();
		this.cssRenderer && this.cssRenderer.renderer.setSize(this.WIDTH, this.HEIGHT);
	}

	attachMouseMoveEvent() {
		this.cssRenderer.renderer.domElement.addEventListener("mousemove", this.onMouseMove.bind(this));
	}

	attachMouseClickEvent() {
		this.cssRenderer.renderer.domElement.addEventListener("mousedown", this.onClick.bind(this));
	}

	onMouseMove(e){
		super.onMouseMove(e);
		onMouseMove(e, this)
	}

	async onKeydown(e) {
		e.preventDefault();
		await onKeydown(e, this)
	}

	changeLight(color) {
		new TWEEN.Tween(this.currentColor.color).to({r: color.r, g: color.g ,b: color.b}, 300).start();
	}

	async componentDidMount() {
		await super.componentDidMount({alpha: true,antialias: true, preserveDrawingBuffer: true });
		this.cssRenderer = new CssRenderer(this.renderer, this.refs.anchor);
		super.initRaycaster();
		this.attachMouseMoveEvent();
		this.attachMouseClickEvent();
		this.attachKeydownEvent();
		this.flyingText = new flyingText(50.0, 30.0, new THREE.Vector3(20.0, 0, 60.0), 	new THREE.Vector3(0, Math.PI / 2, 0), "link", this);
		this.flyingText2 = new flyingText(80.0, 25.0, new THREE.Vector3(20.0, 150, 0.0), 	new THREE.Vector3(0, Math.PI / 2, 0), "screen", this);
		await this.initLight();
		await this.initDoorLight();
		await this.initRaycaster();
		await this.initControls();
		await this.animate();
	}

	animate() {
		if (!this.looped) return;
		this.controls.update();
		this.flyingText && this.flyingText.animate(this.time);
		this.flyingText2 && this.flyingText2.animate(this.time);
		TWEEN.update();
		super.animate();
		this.cssRenderer.renderer.render(this.cssScene, this.camera);
	}

	render() {
		const {progress} = this.state;
		return <div>
			<ProgressBar style={{transition: "2s", position: "absolute", width: "100%",
				height: (progress === 100 ? "0" : "9px")}} now={this.state.progress} />
			<header id="sky" style={{width: "auto", zIndex: "3"}}>
				<div>
					<Button  onClick={()=>this.loadOrDeleteHouse()}>{!this.state.loaded ? `Load House` : `clear`}</Button>
				</div>
			</header>
			<div ref="anchor" className="canvasDiv"/>
		</div>
	}
}
