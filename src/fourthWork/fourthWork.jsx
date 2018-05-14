/**
 * Created by Ellyson on 5/11/2018.
 */

import React from 'react';
import * as THREE from 'three';
import Delaunator from 'delaunator';

let dots = [];
// dots.push([0, 0]);
dots.push([0, 1]);
dots.push([-0.25, 0.5]);
dots.push([-1, 0.5]);
dots.push([-.5, 0]);
dots.push([-1, -.5]);
dots.push([-0.25, -0.5]);
dots.push([0, -1]);
dots.push([0.25, -0.5]);
dots.push([1, -0.5]);
dots.push([.5, 0]);
dots.push([1, 0.5]);
dots.push([0.25, 0.5]);
dots.push([0, 1]);


const delaunay = new Delaunator.from(dots);
let triangles = delaunay.triangles;

const OrbitControls = require('three-orbit-controls')(THREE);

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
		this.scene.background = new THREE.Color(0x000000);
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
		this.camera.position.z = 10;
	}

	initStar(){

		this.geometry = new THREE.Geometry();
		dots.forEach((dot)=>{
			this.geometry.vertices.push(new THREE.Vector3(dot[0],dot[1],0));
		});
		console.log(triangles)
		for(let i = 0; i< triangles.length;i=i+3){
			if(i === 3 || i ===12 || i === 30 || i === 39 || i === 42 || i === 45) continue;
			this.geometry.faces.push(new THREE.Face3(triangles[i],triangles[i+1],triangles[i+2]));
		}
		console.log(this.geometry.faces)

		this.geometry.computeBoundingBox();

		this.material = new THREE.MeshBasicMaterial({side:THREE.DoubleSide});
		this.mesh = new THREE.Mesh(this.geometry,this.material);
		this.mesh.position.set(0,0,0);
		this.pointLight = new THREE.PointLight(0xffffff, 1, 24);
		this.mesh.add(this.pointLight);
		console.log(this.mesh);
		this.scene.add(this.mesh);


		const width = 10;
		const height = 2	;
		const intensity = 5;
		const rectLight = new THREE.RectAreaLight( 0xffffff, intensity,  width, height );
		rectLight.position.set( 0, 4.5, .5 );
		rectLight.rotation.set( 3.14/2, 0, 0 );
		console.log(rectLight)
		// rectLight.rotation.x = Math.Pi/3;
		// rectLight.lookAt( 0, 0, 0 );
		this.scene.add( rectLight );
		var ambient = new THREE.AmbientLight( 0xffffff, 0.1 );

		this.scene.add( ambient );
		const rectLightHelper = new THREE.RectAreaLightHelper( rectLight );
		this.scene.add( rectLightHelper );

	}
	initGround(){

		this.planeGeometry = new THREE.PlaneGeometry(10,10);
		this.planeMaterial = new THREE.MeshPhysicalMaterial({ metalness: 0.2, roughness: 0.2 ,side:THREE.DoubleSide});
		this.planeMesh = new THREE.Mesh(this.planeGeometry,this.planeMaterial);
		this.scene.add(this.planeMesh);
		this.planeMesh.position.set(0,-.5,-.5);
		this.planeMesh.rotation.x = -Math.PI;
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
