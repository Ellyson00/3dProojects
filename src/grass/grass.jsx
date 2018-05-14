/**
 * Created by Ellyson on 5/14/2018.
 */
/**
 * Created by Ellyson on 5/11/2018.
 */

import React from 'react';
import * as THREE from 'three';

const OrbitControls = require('three-orbit-controls')(THREE);
const grass = require('./grass.jpg');

export default class FourthWork extends React.Component {
	constructor(){
		super();
		this.state = {
			checked: false
		};
		this.time = 0;
	}

	initScene(){
		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color( 0x003300 );
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
		// this.controls = new OrbitControls(this.camera, this.renderer.domElement);
		this.camera.position.z = 75;
		this.camera.position.y = 75;
	}

	initStar(){
		const geometry = new THREE.PlaneBufferGeometry( 100, 100 );
		const texture = new THREE.CanvasTexture( this.generateTexture() );
		this.group = new THREE.Object3D();
		for ( let i = 0; i < 22; i ++ ) {
			const material = new THREE.MeshBasicMaterial( {
				color: new THREE.Color().setHSL( 0.3, 0.75, ( i / 15 ) * 0.4 + 0.1 ),
				map: texture,
				depthTest: false,
				depthWrite: false,
				transparent: true
			} );
			const mesh = new THREE.Mesh( geometry, material );
			mesh.position.y = i * 0.25;
			mesh.rotation.x = - Math.PI / 2;
			this.group.add(mesh);

		}
		this.scene.add( this.group );
		// this.scene.children.reverse();
	}


	generateTexture() {
		this.canvas = document.createElement( 'canvas' );
		this.canvas.width = 512;
		this.canvas.height = 512;
		this.context = this.canvas.getContext( '2d' );
		for ( let i = 0; i < 20000; i ++ ) {
			this.context.fillStyle = 'hsl(0,25%,' + ( Math.random() * 25 + 50 ) + '%)';
			this.context.beginPath();
			this.context.arc( Math.random() * this.canvas.width, Math.random() * this.canvas.height, Math.random() + 0.15, 0, Math.PI * 2, true );
			this.context.fill();
		}
		this.context.globalAlpha = 0.075;
		this.context.globalCompositeOperation = 'lighter';
		return this.canvas;
	}
	initGround(){

		let loader = new THREE.TextureLoader();
		loader.load(grass, (texture)=>{
			this.geometry = new THREE.PlaneGeometry(120,120);
			this.material = new THREE.MeshBasicMaterial(
				{
					map: texture
				}
			);
			const ground = new THREE.Mesh(this.geometry,this.material);
			ground.rotation.x = -Math.PI/2;
			this.scene.add(ground);
		});

	}

	componentDidMount() {

		this.initRenderer();
		this.initScene();
		this.initCamera();
		this.initStar();
		this.initGround();
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
		// window.cancelAnimationFrame(requestId);
	}
	animate() {
		if(!this.looped) return;
		requestAnimationFrame( this.animate.bind(this));
		var time = Date.now() / 6000;
		// this.camera.position.x = 80 * Math.cos( time );
		// this.camera.position.z = 80 * Math.sin( time );
		this.camera.lookAt( this.scene.position );
		for ( var i = 0, l = this.group.children.length; i < l; i ++ ) {
			var mesh = this.group.children[ i ];
			mesh.position.x = Math.sin( time * 4 ) * i * i * 0.005;
			mesh.position.z = Math.cos( time * 6 ) * i * i * 0.005;
		}
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