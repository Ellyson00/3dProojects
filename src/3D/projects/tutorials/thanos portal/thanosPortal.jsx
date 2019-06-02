/**
 * Created by Ellyson on 5/11/2018.
 */

import React from 'react';
import * as THREE from 'three';
import TemplateFor3D from '../../../templates/mainTemplate3D';
import fragmentShader from './portal.frag';
import vertexShader from './portal.vert';
const smoke = require(`../../../img/smoke.png`);

export default class thanosPortal extends TemplateFor3D {

	initControls() {
		// super.initControls();
		this.camera.position.set(0, 0, 1000);
	}

	componentDidMount() {
		super.componentDidMount();
		this.portalParticles = [];
		this.smokeParticles = [];
		this.moveQ = new THREE.Quaternion( 0., 0.0, 0.5, 0.0 ).normalize();
		this.tmpQ = new THREE.Quaternion();
		this.currentQ = new THREE.Quaternion();
		super.initLight();
		this.initControls();
		this.initPortal();
		this.initPointLight();
		this.animate();
	}

	initPointLight(){
		THREE.PointLight.prototype.addSphere = function () {
			this.sphere = new THREE.Mesh(new THREE.SphereGeometry(50, 16, 16), new THREE.MeshBasicMaterial({ color: this.color }))
			this.add(this.sphere);
		}
		this.portalLight = new THREE.PointLight(0x062d89, 30, 600, 1.7);
		this.portalLight.addSphere();
		this.portalLight.position.set(0,0,250);
		this.scene.add(this.portalLight);

	}

	initPortal() {

		let loader = new THREE.TextureLoader();
		loader.load(smoke, (texture) => {

			// const portalGeo = new THREE.PlaneBufferGeometry(350,350);
			// const portalMaterial = new THREE.MeshStandardMaterial({
			// 	map: texture,
			// 	transparent: true
			// });
			// const smokeGeo = new THREE.PlaneBufferGeometry(1000,1000);
			// const smokeMaterial = new THREE.MeshStandardMaterial({
			// 	map: texture,
			// 	transparent: true
			// });
			// for(let p = 880 ;p > 250; p--) {
			// 	let portalParticle = new THREE.Mesh(portalGeo, portalMaterial);
			// 	portalParticle.position.set(
			// 		0.5 * p * Math.cos((4 * p * Math.PI) / 180),
			// 		0.5 * p * Math.sin((4 * p * Math.PI) / 180),
			// 		0.1 * p
			// 	);
			// 	portalParticle.rotation.z = Math.random() *360;
			// 	this.portalParticles.push(portalParticle);
			// 	this.scene.add(portalParticle);
			// }
			// for(let p = 0; p < 40; p++) {
			// 	let smokeParticle = new THREE.Mesh(smokeGeo, smokeMaterial);
			// 	smokeParticle.position.set(
			// 		Math.random() * 1000-500,
			// 		Math.random() * 400-200,
			// 		25
			// 	);
			// 	smokeParticle.rotation.z = Math.random() *360;
			// 	smokeParticle.material.opacity = 0.6;
			// 	this.smokeParticles.push(smokeParticle);
			// 	this.scene.add(smokeParticle);
			// }

			const starsGeometry = new THREE.PlaneBufferGeometry(350,350,2,2);
			this.instancedPortalGeo = new THREE.InstancedBufferGeometry().copy(starsGeometry);
			this.instancedPortalGeo.maxInstancedCount = 0;
			const orientations = [];
			const position = new Float32Array(630);
			for( let i = 0 ; i < 630; i+=3) {
				position[ i ] = 0.5 * i * Math.cos((4 * i * Math.PI) / 180);
				position[ i + 1 ] = 0.5 * i * Math.sin((4 * i * Math.PI) / 180);
				position[ i + 2 ] = 0.1 * i;
				this.currentQ = new THREE.Quaternion();
				this.currentQ.setFromAxisAngle( new THREE.Vector3( 0, 0, 1 ), Math.random() * 360 );
				orientations.push( this.currentQ.x, this.currentQ.y, this.currentQ.z, this.currentQ.w );
				this.instancedPortalGeo.maxInstancedCount++;
			}

			this.instancedPortalGeo.addAttribute("cubePos", new THREE.InstancedBufferAttribute(position, 3));
			this.instancedPortalGeo.addAttribute("cubeRot", new THREE.InstancedBufferAttribute( new Float32Array( orientations ), 4 ).setDynamic( true ));

			this.uniforms = THREE.UniformsUtils.merge([
				THREE.UniformsLib['lights'],
			]);
			console.log(this.uniforms)
			const shaderMaterial = new THREE.ShaderMaterial( {
				uniforms: {...this.uniforms, texture: {type: "t", value: texture }},
				vertexShader: vertexShader,
				fragmentShader: fragmentShader,
				transparent:  true,
				side: THREE.DoubleSide,
				lights: true
			});
			const starField = new THREE.Mesh( this.instancedPortalGeo, shaderMaterial );

			this.scene.add( starField );
		});
		this.light.position.set(0, 0, 1);
	}

	animate() {
		if(!this.looped) return;
		let delta = this.clock.getDelta();
		// this.portalParticles.forEach(p => {
		// 	p.rotation.z -= delta *1.5;
		// });
		// this.smokeParticles.forEach(p => {
		// 	p.rotation.z -= delta *0.2;
		// });
		if(Math.random() > 0.9) {
			this.portalLight.power = 350 + Math.random() * 500;
			this.portalLight.position.z = Math.random() * 500;
		}
		// this.portalParticles.forEach(p => {
		// 	p.rotation.z -= delta *1.5;
		// });
		if( this.instancedPortalGeo){
			const orientation = this.instancedPortalGeo.attributes.cubeRot;
			this.tmpQ.set( this.moveQ.x * delta, this.moveQ.y * delta, this.moveQ.z * delta, 1 ).normalize();
			for ( let i = 0, il = orientation.count; i < il; i ++ ) {
				this.currentQ.fromArray( orientation.array, ( i * 4 ) );
				this.currentQ.multiply( this.tmpQ );
				orientation.setXYZW( i, this.currentQ.x, this.currentQ.y, this.currentQ.z, this.currentQ.w );
			}
			const point = this.uniforms.pointLights.value[0];
			point && console.log(point.position,point.color,point.decay )
			orientation.needsUpdate = true;
		}

		super.animate();
	}

	render() {
		return <div>
			<header id="sky"/>
			<div ref="anchor" className="canvasDiv" />
		</div>
	}
}
