/**
 * Created by Ellyson on 5/11/2018.
 */

import React from 'react';
import * as THREE from 'three';
// import AdditiveBlendShader from "./AdditiveBlendShader.js";


const xpos = require(`./skyBox/nebula-xpos.png`);
const xneg = require(`./skyBox/nebula-xneg.png`);
const ypos = require(`./skyBox/nebula-ypos.png`);
const yneg = require(`./skyBox/nebula-yneg.png`);
const zpos = require(`./skyBox/nebula-zpos.png`);
const zneg = require(`./skyBox/nebula-zneg.png`);
const planet = require(`./planet.png`);
const EffectComposer = require('three-effectcomposer')(THREE)
const SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
const VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
const vertexShaderAtmosphere =
	`varying vec3 vNormal;
	void main()
	{
		vNormal = normalize( normalMatrix * normal );
		gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
	}`;
const fragmentShaderAtmosphere =
	`uniform float c;
uniform float p;
varying vec3 vNormal;
void main()
{
	float intensity = pow( c - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) ), p );
	gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0 ) * intensity;
}`;

const OrbitControls = require('three-orbit-controls')(THREE);

export default class Planet extends React.Component {
	constructor(){
		super();
		this.state = {
			checked: false
		};
		this.time = 0;
	}

	initScene(){
		this.scene = new THREE.Scene();
		this.atmosphereScene = new THREE.Scene();
		this.scene.background = new THREE.Color(0x000000);
	}

	initLight(){
		var light = new THREE.AmbientLight( 0x404040, 2 ); // soft white light
		this.scene.add( light );
	}

	initRenderer(){
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize( window.innerWidth, window.innerHeight);
		this.refs.anchor.appendChild(this.renderer.domElement);

	}
	initCamera(){
		this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight , 0.1, 2000 );
		this.camera2 = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
		// this.camera2.position = this.camera.position;
		// this.camera2.rotation = this.camera.rotation;
		this.atmosphereScene.add( this.camera2 );

	}

	initControls(){
		this.controls = new OrbitControls(this.camera, this.renderer.domElement);
		this.camera.position.z = 10;
	}

	initStar(){
		const texture = new THREE.TextureLoader().load(planet);
		const sphereGeo = new THREE.SphereGeometry(5,35,35);
		const sphereMaterial = new THREE.MeshPhongMaterial({side:THREE.DoubleSide,map:texture});
		const sphere = new THREE.Mesh(sphereGeo,sphereMaterial);
		this.scene.add(sphere);
		var customMaterialAtmosphere = new THREE.ShaderMaterial(
			{
				uniforms:
					{
						"c":   { type: "f", value: 1 },
						"p":   { type: "f", value: 12.0 }
					},
				vertexShader:   vertexShaderAtmosphere,
				fragmentShader: fragmentShaderAtmosphere
			}   );

		// const auraSphere = sphere.clone();
		const mesh = new THREE.Mesh( sphereGeo.clone(), customMaterialAtmosphere );
		mesh.scale.x = mesh.scale.y = mesh.scale.z = 1.2;
		// atmosphere should provide light from behind the sphere, so only render the back side
		mesh.material.side = THREE.BackSide;
		this.atmosphereScene.add(mesh);
	}

	initSkyBox(){

		const skyGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );

		const imageURLs = [];
		imageURLs.push(xpos);
		imageURLs.push(xneg);
		imageURLs.push(ypos);
		imageURLs.push(yneg);
		imageURLs.push(zpos);
		imageURLs.push(zneg);
		const textureCube = THREE.ImageUtils.loadTextureCube( imageURLs );
		const shader = THREE.ShaderLib[ "cube" ];
		shader.uniforms[ "tCube" ].value = textureCube;
		const skyMaterial = new THREE.ShaderMaterial( {
			fragmentShader: shader.fragmentShader,
			vertexShader: shader.vertexShader,
			uniforms: shader.uniforms,
			depthWrite: false,
			side: THREE.BackSide
		});
		const skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
		this.scene.add( skyBox );
	}

	initCompresser(){
		// prepare secondary composer
		const renderTargetParameters =
			{ minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter,
				format: THREE.RGBFormat, stencilBuffer: false };
		const renderTarget = new THREE.WebGLRenderTarget( SCREEN_WIDTH, SCREEN_HEIGHT, renderTargetParameters );
		const composer2 = new EffectComposer( this.renderer, renderTarget );

		// prepare the secondary render's passes
		const render2Pass = new EffectComposer.RenderPass( this.atmosphereScene, this.camera2 );
		composer2.addPass( render2Pass );

		// prepare final composer
		const finalComposer = new EffectComposer( this.renderer, renderTarget );

		// prepare the final render's passes
		const renderModel = new EffectComposer.RenderPass( this.scene, this.camera );
		finalComposer.addPass( renderModel );

		const effectBlend = new EffectComposer.ShaderPass( {
			uniforms: {
				"tDiffuse1": { type: "t", value: null },
				"tDiffuse2": { type: "t", value: null }
			},
			vertexShader: [
				"varying vec2 vUv;",
				"void main() {",
				"vUv = uv;",
				"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
				"}"
			].join("\n"),
			fragmentShader: [
				"uniform sampler2D tDiffuse1;",
				"uniform sampler2D tDiffuse2;",
				"varying vec2 vUv;",
				"void main() {",
				"vec4 texel1 = texture2D( tDiffuse1, vUv );",
				"vec4 texel2 = texture2D( tDiffuse2, vUv );",
				"gl_FragColor = texel1 + texel2;",
				"}"
			].join("\n")
		}, "tDiffuse1" );
		effectBlend.uniforms[ 'tDiffuse2' ].value = composer2.renderTarget2;
		effectBlend.renderToScreen = true;
		finalComposer.addPass( effectBlend );
	}

	componentDidMount() {

		this.initRenderer();
		this.initScene();
		this.initCamera();
		this.initLight();
		this.initStar();
		this.initSkyBox();
		this.initControls();
		this.initCompresser();
		window.addEventListener('resize', this.handleWindowResize.bind(this), false);
		this.looped = true;

		this.animate();

	}
	handleWindowResize(){
		this.HEIGHT = window.innerHeight;
		this.WIDTH = window.innerWidth;
		this.renderer && this.renderer.setSize(this.WIDTH, this.HEIGHT);
		this.camera.aspect = this.WIDTH / this.HEIGHT;
		this.camera.updateProjectionMatrix();
	}
	componentWillUnmount(){
		this.renderer = null;
		this.looped = false;
		// window.cancelAnimationFrame(requestId);
	}
	animate() {
		if(!this.looped) return;
		requestAnimationFrame( this.animate.bind(this));
		this.time++;
		this.renderer.render( this.scene, this.camera );
	}


	render() {
		return (
			<div>
				<header style={{position:"fixed",left:"15px",top:"15px"}} className="">
				</header>
				<div ref="anchor" style={{
					width: "100%",
					height: "100%",
					overflow: "hidden"}}/>
			</div>)
	}
}
