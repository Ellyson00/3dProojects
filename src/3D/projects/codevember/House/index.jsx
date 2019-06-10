/**
 * Created by Ellyson on 5/11/2018.
 */
import React from 'react';
import * as THREE from 'three';
import {Button, ProgressBar} from "react-bootstrap";

import TemplateFor3D from '../../../templates/mainTemplate3D';
import {interectiveMeshes} from './components/interactiveMeshes';
import {loadHouse} from './components/House';
import flyingText from './components/flyingText';
import {FLOOR_POSITION, FLOOR_SIZE} from './components/constants';
import {COLORS} from './components/constants';
import {CSS3DRenderer, CSS3DObject} from "three/examples/jsm/renderers/CSS3DRenderer";

const TWEEN = require('@tweenjs/tween.js');
const Zlib = require("three/examples/js/libs/inflate.min");
window.Zlib = Zlib.Zlib;

const colors = [COLORS.white, COLORS.purple, COLORS.blue];

export default class House extends TemplateFor3D {
	constructor(){
		super();
		this.interectiveMeshes = [...interectiveMeshes];
		this.aimedObjectName = "";
		this.currentColor = {index: 0, color: COLORS.white.clone()};
		this.floors = {};
		this.additinalFloor = 0;
		this.additinalFloorArray = [];
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
		super.initControls(this.cssRenderer.domElement);
		this.controls.enableKeys  = false;
		this.resetCamera();
		this.controls.update();
	}

	initCSS3DRender(){
		this.cssRenderer = new CSS3DRenderer();
		this.cssRenderer.setSize(window.innerWidth, window.innerHeight);
		// this.cssRenderer.domElement.style.position = 'absolute';
		// this.renderer.domElement.style.zIndex = 0;
		this.renderer.domElement.style.position = 'absolute';
		this.renderer.domElement.style.zIndex = 1;
		this.renderer.domElement.style.top = 0;
		this.renderer.domElement.style.left = 0;
		this.renderer.domElement.style.pointerEvents = "none";
		// this.renderer.alpha = true;
		this.cssRenderer.domElement.style.position = 'absolute';
		this.cssRenderer.domElement.style.zIndex = 0;
		this.cssRenderer.domElement.style.top = 0;
		this.refs.anchor.appendChild(this.cssRenderer.domElement);
		this.cssRenderer.domElement.appendChild(this.renderer.domElement);
	}

	resetCamera(){
		this.controls.enabled = false;
		this.camera.position.set(2192, 500, 1200);
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
			this.currentColor.color.set(1,1,1);
			this.currentColor.index = 0;
			this.interectiveMeshes[2].position.y = 0;
			await this.setState({loaded: false, progress: 0});
		}
	}

	updateLoadingBar(e){
		this.setState({progress: Math.floor(e.loaded / e.total * 100)});
	}

	initDoorLight() {
		this.spotLight = new THREE.SpotLight( this.currentColor.color, 4, 800, 0.5 , 0.4, 0.2);
		this.pointLight = new THREE.PointLight( this.currentColor.color, 4, 300, 0.2);
		this.spotLight.position.set(11, 250, -220);
		this.pointLight.position.set(90, 120, -220);
		this.spotLight.target.position.set(325, 0, -220);
		this.spotLight.castShadow = this.pointLight.castShadow = true;
		this.spotLight.color = this.pointLight.color = this.currentColor.color;
		this.spotLight.target.updateMatrixWorld();
		this.scene.add(this.spotLight,this.pointLight)
	}

	onClick(){
		if(this.aimedObjectName === "green" && this.state.loaded){
			this.currentColor.index = this.currentColor.index > 1 ? 0 : (this.currentColor.index + 1);
			this.changeLight(colors[this.currentColor.index]);
		}
		if(this.aimedObjectName === "blue" && this.state.loaded){
			if(this.flyingText.show) {
				this.scene.remove(this.flyingText.plane);
				this.cssScene.remove(this.flyingText.cssObject);
				this.flyingText.show = false;
			} else {
				this.scene.add(this.flyingText.plane);
				this.cssScene.add(this.flyingText.cssObject);
				this.flyingText.show = true;
			}
		}
	}

	attachMouseMoveEvent() {
		this.cssRenderer.domElement.addEventListener("mousemove", this.onMouseMove.bind(this));
	}

	attachMouseClickEvent() {
		this.cssRenderer.domElement.addEventListener("mousedown", this.onClick.bind(this));
	}

	onMouseMove(e){
		super.onMouseMove(e);
		if(this.raycaster && this.interectiveMeshes.length){
			this.raycaster.setFromCamera( this.mouse, this.camera );
			const intersects = this.raycaster.intersectObjects(this.interectiveMeshes);
			if(intersects[0] && this.state.loaded){
				this.renderer.domElement.style.cursor = "pointer";
				this.aimedObjectName = intersects[0].object.name;
			} else {
				this.renderer.domElement.style.cursor = "auto";
				this.aimedObjectName = ""
			}
		}
	}

	async onKeydown(e) {
		e.preventDefault();
		if(Object.keys(this.floors).length){
			switch (e.keyCode){
				case 38: {
					this.additinalFloor++;
					this.floors["House_Middle"].mesh.position.y = FLOOR_POSITION.middle + FLOOR_SIZE.middle * (this.additinalFloor);
					this.floors["House_Top"].mesh.position.y = FLOOR_SIZE.top + FLOOR_SIZE.middle * (this.additinalFloor + 1);
					this.interectiveMeshes[2].position.y = FLOOR_SIZE.middle * (this.additinalFloor);
					if (this.additinalFloor === 0){
						this.floors["House_Top"].mesh.position.y = FLOOR_POSITION.top;
						this.interectiveMeshes[2].position.y = FLOOR_POSITION.base;
						this.floors["House_Middle"].mesh.visible = true;
					} else {
						const clonedFloor = this.floors["House_Middle"].mesh.clone();
						this.additinalFloorArray[this.additinalFloor - 1] = clonedFloor;
						clonedFloor.position.y = FLOOR_POSITION.middle + FLOOR_SIZE.middle * (this.additinalFloor -1);
						this.house.add(clonedFloor);
					}
					break
				}
				case 40:{
					this.additinalFloor--;
					if(this.additinalFloor === -1) {
						this.floors["House_Middle"].mesh.visible = false;
						this.floors["House_Top"].mesh.position.y = FLOOR_SIZE.top;
					} else if (this.additinalFloor > -1) {
						this.floors["House_Top"].mesh.position.y = FLOOR_SIZE.top + FLOOR_SIZE.middle * (this.additinalFloor + 1);

					} else {
						this.additinalFloor = -1;
						break;
					}
					this.interectiveMeshes[2].position.y = FLOOR_SIZE.middle * (this.additinalFloor);
					const clonedFloor = this.additinalFloorArray[this.additinalFloor + 1] ;
					await this.house.remove(clonedFloor);
					this.floors["House_Middle"].mesh.position.y = FLOOR_POSITION.middle + FLOOR_SIZE.middle * (this.additinalFloor);
					await this.additinalFloorArray.splice(this.additinalFloor + 1, 1);
					break
				}
			}

		}
	}

	changeLight(color) {
		new TWEEN.Tween(this.currentColor.color).to({r: color.r, g: color.g ,b: color.b}, 300).start();
	}

	async componentDidMount() {
		await super.componentDidMount({alpha: true,antialias: true});
		await this.initCSS3DRender();
		super.initRaycaster();
		this.attachMouseMoveEvent();
		this.attachMouseClickEvent();
		this.attachKeydownEvent();
		await this.initLight();
		await this.initDoorLight();
		this.flyingText = await new flyingText(400, 300,
			new THREE.Vector3(200, 0, 600),
			new THREE.Vector3(0, Math.PI / 2, 0));
		await this.initRaycaster();
		await this.light.position.set(7 ,20,50);
		await this.initControls();
		await this.animate();
	}

	animate() {
		if (!this.looped) return;
		this.controls.update();
		this.flyingText && this.flyingText.animate(this.time);
		TWEEN.update();
		super.animate();
		this.cssRenderer.render(this.cssScene, this.camera);
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
