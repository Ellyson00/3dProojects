/**
 * Created by Ellyson on 5/11/2018.
 */

import React from 'react';
import * as THREE from 'three';
import TemplateFor3D from '../../../templates/mainTemplate3D';

const threeSky = require('three-sky');

export default class Sky extends TemplateFor3D {
	initLights(){
		this.light = new THREE.DirectionalLight(0xffffff, 0.8);
		this.scene.add(this.light);
		this.ambiantLight = new THREE.AmbientLight(0xffffff, 0.1);
		this.scene.add(this.ambiantLight);
	}

	initControls() {
		super.initControls();
		this.camera.position.set(0, 0, 5);
	}

	initSky() {
		this.sky = new threeSky();
		this.sky.scale.setScalar(300);
		this.scene.add(this.sky);
		let sunSphere = new THREE.Mesh(
			new THREE.SphereBufferGeometry(20000, 16, 8),
			new THREE.MeshBasicMaterial({color: 0xffffff})
		);
		sunSphere.position.y = -700000;
		sunSphere.visible = false;
		this.scene.add(sunSphere);

		this.effectController = {
			turbidity: 10,
			rayleigh: 2,
			mieCoefficient: 0.005,
			mieDirectionalG: 0.8,
			luminance: 1,
			inclination: 0.49, // elevation / inclination
			azimuth: 0.25, // Facing front,
			sun: false
		};
		this.distance = 180;
		this.uniforms = this.sky.material.uniforms;
		this.uniforms.turbidity.value = this.effectController.turbidity;
		this.uniforms.rayleigh.value = this.effectController.rayleigh;
		this.uniforms.luminance.value = this.effectController.luminance;
		this.uniforms.mieCoefficient.value = this.effectController.mieCoefficient;
		this.uniforms.mieDirectionalG.value = this.effectController.mieDirectionalG;
		this.theta = Math.PI * (this.effectController.inclination - 0.5);
		this.phi = 2 * Math.PI * (this.effectController.azimuth - 0.5);
		this.light.position.x = this.distance * Math.cos(this.phi);
		this.light.position.y = this.distance * Math.sin(this.phi) * Math.sin(this.theta);
		this.light.position.z = this.distance * Math.sin(this.phi) * Math.cos(this.theta);
		sunSphere.position.x = this.distance * Math.cos(this.phi);
		sunSphere.position.y = this.distance * Math.sin(this.phi) * Math.sin(this.theta);
		sunSphere.position.z = this.distance * Math.sin(this.phi) * Math.cos(this.theta);
		sunSphere.visible = this.effectController.sun;
		this.uniforms.sunPosition.value.copy(sunSphere.position);

		const geometry = new THREE.BoxGeometry(1, 1, 1);
		const material = new THREE.MeshPhongMaterial({color: 0x00ff00});
		const cube = new THREE.Mesh(geometry, material);
		cube.position.set(0,0,0);
		this.scene.add(cube);
	}

	componentDidMount() {
		super.componentDidMount();
		this.initLights();
		this.initSky();
		this.initControls();
		this.animate();
	}

	animate() {
		if(!this.looped) return;
		this.updateSun();
		super.animate();
	}

	updateSun() {
		const theta = Math.PI * (this.effectController.inclination - 0.5);
		const phi = 2 * Math.PI * (this.effectController.azimuth - 0.5);
		document.getElementById("sky").innerHTML = "sun posiition:\n " + this.light.position.y;
		if(this.distance * Math.sin(phi) * Math.sin(theta + this.time/1000 ) < -20) {
			this.time += 10;
		}
		this.light.position.x = this.distance * Math.cos(phi);
		this.light.position.y = this.distance * Math.sin(phi) * Math.sin(theta + this.time / 1000);
		this.light.position.z = this.distance * Math.sin(phi) * Math.cos(theta);
		this.uniforms.sunPosition.value.copy(this.light.position);
	}

	render() {
		return <div>
			<header id="sky"/>
			<div ref="anchor" className="canvasDiv" />
		</div>
	}
}
