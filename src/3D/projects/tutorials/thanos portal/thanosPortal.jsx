/**
 * Created by Ellyson on 5/11/2018.
 */

import React from 'react';
import * as THREE from 'three';
import TemplateFor3D from '../../../templates/mainTemplate3D';
import vertexShader from './portal.vert';
const smoke = require(`../../../img/smoke.png`);

export default class thanosPortal extends TemplateFor3D {

	initControls() {
		super.initControls();
		this.camera.position.set(0, 0, 1300);
	}

	componentDidMount() {
		super.componentDidMount();
		this.moveQ = new THREE.Quaternion( 0., 0.0, 0.5, 0.0 ).normalize();
		this.tmpQ = new THREE.Quaternion();
		this.currentQ = new THREE.Quaternion();
		this.initControls();
		this.initPortal();
		this.initPointLight();
		this.animate();
	}

	initPointLight(){
		this.portalLight = new THREE.PointLight(0x062d89, 30, 600, 1.7);
		this.portalLight.position.set(0,0,300);
		this.directionalLight = new THREE.DirectionalLight(0xffffff,0.5);
		this.directionalLight.position.set(0,0,1);
		this.scene.add(this.directionalLight,this.portalLight);
	}

	initPortal() {
		let loader = new THREE.TextureLoader();
		loader.load(smoke, (texture) => {
			const starsGeometry = new THREE.PlaneBufferGeometry(350,350,1,1);
			this.instancedPortalGeo = new THREE.InstancedBufferGeometry().copy(starsGeometry);
			this.instancedPortalGeo.maxInstancedCount = 0;
			const orientations = [];
			const position = new Float32Array(1323);
			for(let i = 1322; i > 0; i -=3) {
				position[i - 2] = 0.5 * i * Math.cos((4 * i * Math.PI) / 180);
				position[i - 1] = 0.5 * i * Math.sin((4 * i * Math.PI) / 180);
				position[i] = 0.1 * i;
				this.currentQ = new THREE.Quaternion();
				this.currentQ.setFromEuler(new THREE.Euler(0, 0, (Math.random() * 360)));
				orientations.push(this.currentQ.x, this.currentQ.y, this.currentQ.z, this.currentQ.w);
				this.instancedPortalGeo.maxInstancedCount++;
			}

			this.instancedPortalGeo.addAttribute("instanceOffset", new THREE.InstancedBufferAttribute(position, 3));
			this.instancedPortalGeo.addAttribute("instanceRotation", new THREE.InstancedBufferAttribute(new Float32Array(orientations), 4 ).setDynamic(true));

			this.uniforms = THREE.UniformsUtils.merge([
				THREE.UniformsLib['lights'],
			]);

			this.shaderMaterial = new THREE.MeshLambertMaterial( {
				combine: THREE.MultiplyOperation,
				reflectivity: 0.8,
				fog: true,
				map: texture,
				side: THREE.DoubleSide,
				transparent: true,
				depthWrite: false,
			} );

			this.shaderMaterial.onBeforeCompile = ( shader ) => {
				shader.vertexShader = vertexShader;
			};

			const portalMesh = new THREE.Mesh(this.instancedPortalGeo, this.shaderMaterial);
			this.scene.add(portalMesh);
		});
	}

	animate() {
		if(!this.looped) return;
		let delta = this.clock.getDelta();
		if(Math.random() > 0.9) {
			this.portalLight.power = 350 + Math.random()*500;
		}
		if(this.instancedPortalGeo){
			const orientation = this.instancedPortalGeo.attributes.instanceRotation;
			this.tmpQ.set(this.moveQ.x * delta, this.moveQ.y * delta, this.moveQ.z * delta, 1).normalize();
			for (let i = 0, il = orientation.count; i < il; i ++) {
				this.currentQ.fromArray(orientation.array, (i * 4));
				this.currentQ.multiply(this.tmpQ);
				orientation.setXYZW(i, this.currentQ.x, this.currentQ.y, this.currentQ.z, this.currentQ.w);
			}
			orientation.needsUpdate = true;
		}
		super.animate();
	}

	render() {
		return <div>
				<header id="sky" style={{width: "auto"}}>
					<div>
						<div style={{height: "20px"}}>https://redstapler.co/thanos-portal-effect-javascript-tutorial/</div>
						<div style={{height: "20px"}}>Performance was to small (14 fps)...so I redid it into</div>
						<div style={{height: "20px"}}>InstancedBufferGeometry with ShaderMaterial</div>
					</div>
				</header>
				<div ref="anchor" className="canvasDiv">
				</div>
		</div>
	}
}
