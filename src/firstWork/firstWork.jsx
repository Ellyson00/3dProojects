/**
 * Created by Ellyson on 5/11/2018.
 */

import React from 'react';
import {Button} from 'react-bootstrap';
import Delaunator from 'delaunator';
import * as THREE from 'three';
// import vertexShader from "./shaders/vertexShader.vert"; //not working ...coming only string of strange link
// import fragmentShader from "./shaders/fragmentShader.frag";
import Mouse from "../plagin/mouse.js";
import Particle from "../plagin/particles.js";
import Perlin from "../plagin/perlin.js";


const vertexShader = `
varying vec2 vUv;
varying vec3 vecPos;
varying vec3 v_position;

void main() {
    vUv = uv;
    vecPos = (modelViewMatrix * vec4(position, 1.0)).xyz;
    v_position = position.xyz;
    gl_Position = projectionMatrix * vec4(vecPos, 1.0);
}`;


const fragmentShader = `
uniform sampler2D textureSampler;
  varying vec3 v_position;
  varying vec2 vUv;
  void main(void) {

  vec4 image = texture2D(textureSampler,vUv);
  vec3 normal = normalize(cross(dFdx(v_position),dFdy(v_position)));
  vec3 light = vec3(0.,0.,1.);

  vec3 prod = clamp(cross(normal,light), 0.,1.0);
    gl_FragColor = image*(1. -prod.r);
  }`;

let dots = [];
let myDots = [];

dots.push([0, 0]);//left-top corner
dots.push([1366,0]);//right-top corner
dots.push([1366,768]);//right-bottom corner
dots.push([0, 768]);//left-bottom corner

for(let i = 0; i < 3050; i++){ // simple dots
	dots.push([Math.random() * 1366, Math.random() * 768])
}

dots.forEach((d) => { // dots with physics
	myDots.push(new Particle(d[0], d[1], 0))
});

const delaunay = new Delaunator.from(dots);
const triangles = delaunay.triangles;

const OrbitControls = require('three-orbit-controls')(THREE);
const image = require('../img/moon.jpg');

export default class FirstWork extends React.Component {
	constructor(){
		super();
		this.state = {
			checked: false
		};
		this.time = 0;
		this.raycaster = new THREE.Raycaster();
	}

	onDocumentMouseDown( event ) {
		const mouse = new THREE.Vector2();
		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
		this.raycaster.setFromCamera( mouse, this.camera.clone() );
		if(this.state.checked) this.intersects = this.raycaster.intersectObject( this.planeMesh );
	}

	initScene(){
		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color(0xffffff);
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
		this.camera.position.set(1366/2, 768/2, 770);
		this.controls.target.set(1366/2, 768/2, 0);
	}

	initPlateMesh(){
		let loader = new THREE.TextureLoader();
		loader.load(image, (texture)=>{
			this.geometry = new THREE.Geometry();

			const material = new THREE.ShaderMaterial( {
				extensions: {
					derivatives: "#extension GL_OES_standard_derivatives : enable"
				},
				uniforms: {
					textureSampler:{type:"t",value:null}
				},
				vertexShader: vertexShader.toString(),
				fragmentShader: fragmentShader.toString(),
				side:THREE.DoubleSide,
			} );

			material.uniforms.textureSampler.value = texture;

			dots.forEach((d)=>{
				this.geometry.vertices.push(new THREE.Vector3(d[0],d[1],0));
			});

			for(let i = 0; i< triangles.length;i=i+3){
				this.geometry.faces.push(new THREE.Face3(triangles[i],triangles[i+1],triangles[i+2]));
			}
			this.geometry.computeBoundingBox();
			//--------------------------- for adapting image texture ------------------
			const max = this.geometry.boundingBox.max,
				 min = this.geometry.boundingBox.min;
			const offset = new THREE.Vector2(0 - min.x, 0 - min.y);
			const range = new THREE.Vector2(max.x - min.x, max.y - min.y);
			const faces = this.geometry.faces;

			this.geometry.faceVertexUvs[0] = [];

			for (let i = 0; i < faces.length ; i++) {

				const v1 = this.geometry.vertices[faces[i].a],
					v2 = this.geometry.vertices[faces[i].b],
					v3 = this.geometry.vertices[faces[i].c];

				this.geometry.faceVertexUvs[0].push([
					new THREE.Vector2((v1.x + offset.x)/range.x ,(v1.y + offset.y)/range.y),
					new THREE.Vector2((v2.x + offset.x)/range.x ,(v2.y + offset.y)/range.y),
					new THREE.Vector2((v3.x + offset.x)/range.x ,(v3.y + offset.y)/range.y)
				]);
			}
			this.geometry.uvsNeedUpdate = true;
			//--------------------------- end  ------------------------
			this.planeMesh = new THREE.Mesh( this.geometry, material );

			this.scene.add( this.planeMesh );
		});
	}
	handleWindowResize(){
		this.HEIGHT = window.innerHeight;
		this.WIDTH = window.innerWidth;
		this.renderer && this.renderer.setSize(this.WIDTH, this.HEIGHT);
		this.camera.aspect = this.WIDTH / this.HEIGHT;
		this.camera.updateProjectionMatrix();
	}


	componentDidMount() {

		this.initRenderer();
		this.initScene();
		this.initCamera();
		this.initControls();
		this.initPlateMesh();

		this.pos = new Mouse(this.renderer.domElement);

		window.addEventListener( 'mousemove', this.onDocumentMouseDown.bind(this), false );
		window.addEventListener('resize', this.handleWindowResize.bind(this), false);
		this.looped = true;
		this.animate();

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
		if(this.geometry){
			myDots.forEach((d, i) => {
				if(this.state.checked){
					if(this.intersects && this.intersects.length > 0) d.think(this.intersects[0].point);
					this.geometry.vertices[i].z = d.z;
				} else this.geometry.vertices[i].z = 60 * Perlin(d.x / 50,d.y / 50,this.time / 100);
			});
			this.geometry.verticesNeedUpdate = true;
		}
	}


	render() {
		return (
			<div>
				<header style={{position:"fixed",left:"15px",top:"15px"}} className="">
					<Button  onClick={()=>{
						this.setState({checked: !this.state.checked})
					}}>{!this.state.checked ? "MouseMod" : "Perlin Noise"}</Button>
				</header>
				<div ref="anchor" style={{
					width: "100%",
					height: "100%",
					overflow: "hidden"}} />
			</div>)
	}
}
