/**
 * Created by Ellyson on 5/11/2018.
 */

import React from 'react';
import * as THREE from 'three';
import TemplateFor3D from '../../../templates/mainTemplate3D';
const smoke = require(`../../../img/smoke.png`);
const drop = require(`../../../img/drop.png`);

export default class Rain extends TemplateFor3D {

	static rainCount = 15000;

	constructor(){
		super();
		this.cloudParticles = [];

		this.flash = new THREE.PointLight(0x062d89, 30, 500 ,1.7);
		this.flash.position.set(200,300,100);

	}

	initControls() {
		// super.initControls();
		this.camera.position.z = 1;
		this.camera.rotation.x = 1.16;
		this.camera.rotation.y = -0.12;
		this.camera.rotation.z = 0.27;

	}
	initLight(){
		this.ambient = new THREE.AmbientLight(0x666666);
		this.scene.add(this.ambient);

		this.directionalLight = new THREE.DirectionalLight(0xffeedd);
		this.directionalLight.position.set(0,0,1);
		this.scene.add(this.directionalLight);

		this.flash = new THREE.PointLight(0x062d89, 30, 500 ,1.7);
		this.flash.position.set(200,300,100);
		this.scene.add(this.flash);
		this.scene.add(this.flash);
		this.scene.fog = new THREE.FogExp2(0x222233	, 0.0015);
		this.camera.far = 1000;
		this.renderer.setClearColor(this.scene.fog.color);
	}

	componentDidMount() {
		super.componentDidMount();
		this.initLight();
		this.initControls();
		this.initRain();
		this.animate();
	}

	initPointLight(){
		this.portalLight = new THREE.PointLight(0x062d89, 30, 600, 1.7);
		this.portalLight.position.set(0,0,0);
		this.portalLight.power = 0;
		this.scene.add(this.portalLight);
	}

	initRain() {
		let loader = new THREE.TextureLoader();
		loader.load(drop, (texture)=>{
			this.rainGeo = new THREE.Geometry();
			for(let i=0;i < Rain.rainCount;i++) {
				let tmp =  Math.random() * 400 -200;
				let tmp2 =  Math.random() * 400 -300;
				this.rainDrop = new THREE.Vector3(
					tmp,
					Math.random() * 500 - 250,
					tmp2
				);
				this.rainDrop.originalX = tmp;
				this.rainDrop.originalZ = tmp2;
				this.rainDrop.velocity = {};
				this.rainDrop.velocity = 0;
				this.rainGeo.vertices.push(this.rainDrop);
			}
			this.rainMaterial = new THREE.PointsMaterial({
				color: 0xaaaaaa,
				size: 1,
				map: texture,
				depthTest: false,
				blending: THREE.AdditiveBlending,
				opacity:1,
				transparent: true
			});
			this.rain = new THREE.Points(this.rainGeo, this.rainMaterial);
			this.scene.add(this.rain);
		});



		loader.load(smoke, (texture) => {
			this.cloudGeo = new THREE.PlaneBufferGeometry(400,400);
			this.cloudMaterial = new THREE.MeshLambertMaterial({
				map: texture,
				transparent: true,
			});
			for(let p = 0; p < 35; p++) {
				let cloud = new THREE.Mesh(this.cloudGeo, this.cloudMaterial);
				cloud.position.set(
					Math.random()*800 -400,
					500,
					Math.random()*500 - 450
				);
				cloud.rotation.x = 1.16;
				cloud.rotation.y = -0.12;
				cloud.rotation.z = Math.random()*360;
				cloud.material.opacity = 0.6;
				this.cloudParticles.push(cloud);
				this.scene.add(cloud);
			}
		});
	}

	animate() {
		if(!this.looped) return;
		let delta = this.clock.getDelta();
		this.cloudParticles.forEach(p => {
			p.rotation.z -=0.001;
		});
		if(this.rainGeo && this.rain){
			this.rainGeo && this.rainGeo.vertices.forEach(p => {
				p.velocity -= Math.random() * 0.05;
				p.y += p.velocity;
				if(p.originalZ < 10 && p.originalZ >-50)
					p.y += p.velocity/2;
				else
					p.y += p.velocity;

				if (p.y < -200) {
					p.y = 200;
					p.velocity = 0;
				}
				if(p.originalZ < 10 && p.originalZ >-50 && p.originalX < 30 && p.originalX >-30) {
					if(p.x < 0)
						p.x -= 0.2;
					else
						p.x += 0.2;
				}
				if(p.originalZ < 10 && p.originalZ >-50) {
					if(p.x > 30) p.x = p.originalX;
					else if (p.x < -30) p.x = p.originalX;
				}
			});
			this.rainGeo.verticesNeedUpdate = true;
			this.rain.rotation.y +=0.002;
		}

		if(Math.random() > 0.93 || this.flash.power > 100) {
			if(this.flash.power < 100)
				this.flash.position.set(
					Math.random()*400,
					300 + Math.random() *200,
					100
				);
			this.flash.power = 50 + Math.random() * 500;
		}
		super.animate();
	}

	render() {
		return <div>
				<header id="sky" style={{width: "auto"}}>
				</header>
				<div ref="anchor" className="canvasDiv">
				</div>
		</div>
	}
}
