/**
 * Created by Ellyson on 5/11/2018.
 */

import React from 'react';
import * as THREE from 'three';

const xpos = require(`./skyBox/nebula-xpos.png`);
const xneg = require(`./skyBox/nebula-xneg.png`);
const ypos = require(`./skyBox/nebula-ypos.png`);
const yneg = require(`./skyBox/nebula-yneg.png`);
const zpos = require(`./skyBox/nebula-zpos.png`);
const zneg = require(`./skyBox/nebula-zneg.png`);
const planet = require(`./planet.png`);

const vertexShader =
		`varying vec3 vNormal;
		void main()
		{
			vNormal = normalize( normalMatrix * normal );
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`;

const fragmentShader =
	`varying vec3 vNormal;
void main()
{
	float intensity = pow( 0.7 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) ), 4.0 );
	gl_FragColor = vec4( 1.0, .0, 0.0, 1.0 ) * intensity;
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
		const light = new THREE.AmbientLight( 0x404040, 2 ); // soft white light
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


	}

	initControls(){
		this.controls = new OrbitControls(this.camera, this.renderer.domElement);
		this.camera.position.z = 320;
	}

	initPlanet(){
		const texture = new THREE.TextureLoader().load(planet);
		const sphereGeo = new THREE.SphereGeometry(100, 32, 16);
		const sphereMaterial = new THREE.MeshPhongMaterial({side:THREE.DoubleSide,map:texture});
		this.planet = new THREE.Mesh(sphereGeo, sphereMaterial);
		this.scene.add(this.planet);
		const customMaterial = new THREE.ShaderMaterial(
			{
				uniforms: {  },
				vertexShader:   vertexShader,
				fragmentShader: fragmentShader,
				side: THREE.BackSide,
				blending: THREE.AdditiveBlending,
				transparent: true
			}   );

		const ballGeometry = new THREE.SphereGeometry( 120, 32, 16 );
		const ball = new THREE.Mesh( ballGeometry, customMaterial );
		this.scene.add( ball );
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

	componentDidMount() {

		this.initRenderer();
		this.initScene();
		this.initCamera();
		this.initLight();
		this.initPlanet();
		this.initSkyBox();
		this.initControls();
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
	}
	animate() {
		if(!this.looped) return;
		requestAnimationFrame( this.animate.bind(this));
		this.time++;
		this.renderer.render( this.scene, this.camera );
		this.planet.rotation.y +=0.001
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
