/**
 * Created by Ellyson on 5/11/2018.
 */

import React from 'react';
import * as THREE from 'three';
import TemplateFor3D from "../../../../templates/mainTemplate3D";
import Mouse from "../../../../plugins/mouse.js";
import Portal from "./portalMesh";
import Ground from "./ground"
import Dome from "./dome"
import Hut from "./hut"
import Pillars from "./pillars"
import Grid from "./grid";
import Renderer from "./renderer";
import Input from "./input";

export default class TriangleWallpaper extends TemplateFor3D {
	constructor() {
		super();
		this.raycaster = new THREE.Raycaster();
	}

	onDocumentMouseDown(event) {
		const mouse = new THREE.Vector2();
		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
		// this.raycaster.setFromCamera(mouse, this.camera.clone());
		// if(this.state.checked) this.intersects = this.raycaster.intersectObject(this.planeMesh);
	}

	initScene() {
		super.initScene();
		this.scene.background = new THREE.Color(0xffffff);
	}

	initControls() {
		super.initControls();
		this.camera.position.set(1366/2, 768/2, 770);
		this.controls.target.set(1366/2, 768/2, 0);
	}

	handleWindowResize() {
		this.HEIGHT = window.innerHeight;
		this.WIDTH = window.innerWidth;
		this.renderer && this.renderer.setSize(this.WIDTH, this.HEIGHT);
		this.camera.aspect = this.WIDTH / this.HEIGHT;
		this.camera.updateProjectionMatrix();
	}


	componentDidMount() {
		this.exterior = new THREE.Scene();
		this.interior = new THREE.Scene();
		let renderTarget;
		this.exterior.fog = new THREE.FogExp2(0x005e6e, 0.06);
		{
			const hut = new Hut({ north: true });
			const portal = new Portal({
				width: 1,
				height: 3,
				textureWidth: 512,
				textureHeight: 1024,
				position: [0, 1.5, -0.499],
				scene: this.interior,
			});
			hut.add(portal);
			this.exterior.add(hut);
			renderTarget = portal.renderTarget;
		}
		this.exterior.add(new Ground());
		this.exterior.add(new Dome({ color: this.exterior.fog.color }));
		this.interior.fog = new THREE.FogExp2(0x002B3B, 0.06);
		{
			const hut = new Hut({ south: true });
			hut.add(new Portal({
				width: 1,
				height: 3,
				position: [0, 1.5, 0.499],
				rotation: [0, Math.PI, 0],
				scene: this.exterior,
				renderTarget,
			}));
			this.interior.add(hut);
		}
		this.interior.add(new Pillars());
		this.interior.add(new Grid({ color: new THREE.Color(0x09020f)}));
		this.interior.add(new Dome({ color: this.interior.fog.color }));
		// Setup renderer
		const mount = this.refs.anchor;
		console.log(this.refs)
		const input = new Input({ mount });
		const renderer = new Renderer({
			debug: this.refs.debug,
			mount,
			scene: this.exterior,
		});
		const { animations, camera } = renderer;

// Setup camera animation
		camera.position.set(0, 1.6, 2.25);
		const distance = camera.position.z;
		const cameraAnimation = ({ time }) => {
			if (input.isLocked) {
				// Pop animation out on first input lock
				animations.splice(
					animations.findIndex(animation => animation === cameraAnimation),
					1
				);
				return;
			}
			const angle = Math.PI * -0.5 + Math.sin(time * -0.25) * Math.PI;
			const factor = distance - angle;
			camera.position.x = Math.cos(angle) * factor;
			camera.position.z = Math.sin(angle) * factor;
			camera.lookAt(
				0, camera.position.y, -0.5
			);
		};
		animations.push(cameraAnimation);

// Setup player input
		animations.push(({ delta }) => {
			if (input.onAnimationTick({ camera, delta })) {
				// Quick & Dirty teleportation logic
				const { x, z } = camera.position;
				const { direction } = input.vectors;
				const { scene } = renderer;
				if (
					x > -0.45 && x < 0.45
					&& z > -0.45 && z < 0.45
					&& (
						(scene === this.exterior && direction.z < 0)
						|| (scene === this.interior && direction.z > 0)
					)
				) {
					renderer.updateScene(scene === this.exterior ? this.interior : this.exterior);
				}
			}
		});


		// super.componentDidMount();
		// this.initControls();
		// this.initPlateMesh();
		// this.pos = new Mouse(this.renderer.domElement);
		// window.addEventListener('mousemove', this.onDocumentMouseDown.bind(this), false);
		// window.addEventListener('resize', this.handleWindowResize.bind(this), false);
		// this.animate();
	}

	animate() {
		if (!this.looped) return;
		super.animate();
	}


	render() {
		return <div>
			<header ref="debug">
			</header>
			<div ref="anchor" className="canvasDiv"/>
		</div>
	}
}
