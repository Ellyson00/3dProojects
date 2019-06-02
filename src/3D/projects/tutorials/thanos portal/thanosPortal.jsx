/**
 * Created by Ellyson on 5/11/2018.
 */

import React from 'react';
import * as THREE from 'three';
import TemplateFor3D from '../../../templates/mainTemplate3D';
const smoke = require(`../../../img/smoke.png`);

const vertex = `
	varying vec2 vUv;	
	varying vec3 vPos;
	attribute vec3 cubePos;
	attribute vec4 cubeRot;
	
		vec3 applyQuaternionToVector( vec4 q, vec3 v ){
			return v + 2.0 * cross( q.xyz, cross( q.xyz, v ) + q.w * v );
		}

	void main() {
	vUv = uv;
	vec3 vPosition = applyQuaternionToVector( cubeRot, position );
	vec4 mvPosition = vec4( cubePos + vPosition, 1.0 );
	vPos = (modelMatrix * vec4(cubePos + position, 1.0 )).xyz;
	gl_Position = projectionMatrix * modelViewMatrix * mvPosition;
}`;

const frag =`
uniform sampler2D texture;
uniform vec3 ambientLightColor;
varying vec2 vUv;
varying vec3 vPos;
void main() {
	 vec4 t = texture2D(texture, vUv * vec2(1, 1));
     vec3 c = t.rgb;
     gl_FragColor = vec4(c*ambientLightColor,t.w);
}`;

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
		this.portalLight = new THREE.PointLight(0x062d89, 30, 600, 1.7);
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
			const shaderMaterial = new THREE.ShaderMaterial( {
				uniforms: {...this.uniforms, texture: {type: "t", value: texture }},
				vertexShader:   vertex,
				fragmentShader: frag,
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
		}
		// this.portalParticles.forEach(p => {
		// 	p.rotation.z -= delta *1.5;
		// });
		if( this.instancedPortalGeo){
			const orientation = this.instancedPortalGeo.attributes.cubeRot;
			this.tmpQ.set( this.moveQ.x * delta, this.moveQ.y * delta, this.moveQ.z * delta, 1 ).normalize();
			for ( var i = 0, il = orientation.count; i < il; i ++ ) {
				this.currentQ.fromArray( orientation.array, ( i * 4 ) );
				this.currentQ.multiply( this.tmpQ );
				orientation.setXYZW( i, this.currentQ.x, this.currentQ.y, this.currentQ.z, this.currentQ.w );
			}
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
