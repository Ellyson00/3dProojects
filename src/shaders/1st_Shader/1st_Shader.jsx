/**
 * Created by Ellyson on 5/11/2018.
 */

import React from 'react';
//import {Button} from 'react-bootstrap';
import * as THREE from 'three';

const OrbitControls = require('three-orbit-controls')(THREE);

export default class Shader1 extends React.Component {
	constructor(){
		super();
		this.mouse=new THREE.Vector2(0,0);
		this.resolution= new THREE.Vector2(window.innerWidth,window.innerHeight);
		this.state = {
			checked: false
		};
		this.time = 0;
	}

	initScene(){
		this.scene = new THREE.Scene();
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
		this.camera.position.set(0, 0, 10);
	}
//------------------------------------------------------------
	firstShader(){

		const vertexShader =
		`	varying vec2 vUv;
		varying vec3 vecPos;
		varying vec3 vNormal;

		void main() {
			vUv = uv;
			vNormal = normal;
			vecPos = (modelViewMatrix * vec4(position, 1.0)).xyz;
			gl_Position = projectionMatrix * vec4(vecPos, 1.0);
		}`;

		const fragmentShader =
			`uniform sampler2D textureSampler;
			varying vec3 vNormal;
			
			vec4 purple(){
				vec4 color = vec4(vec3(1.0,0.0,1.0),1.0);
			 	return color;
			}
			void main() {
			vec3 light = vec3(0.7, 0.5, 1.0);
			//light = normalize(light);
			float dProd = max(0.0,
                    dot(vNormal, light));
		  	gl_FragColor = vec4(dProd, // R
                      dProd, // G
                      dProd, // B
                      1.0);  // A 	
			}`;


		const  geometry = new THREE.BoxBufferGeometry(5, 5, 5 );
		const customMaterial = new THREE.ShaderMaterial(
			{
				uniforms: {  },
				vertexShader:   vertexShader,
				fragmentShader: fragmentShader,
			}   );
		this.cube = new THREE.Mesh( geometry, customMaterial );
		// this.cube.position.set(-3,0,0);
		this.scene.add( this.cube );
	}

	componentDidMount() {

		this.initRenderer();
		this.initScene();
		this.initCamera();
		this.firstShader();
		this.initControls();
		this.renderer.domElement.addEventListener("mousemove",this.onMouseMove.bind(this));
		this.looped = true;
		this.animate();

	}
	onMouseMove(e){
		this.mouse=new THREE.Vector2(e.offsetX / window.innerWidth,e.offsetY/window.innerHeight);
	}
	componentWillUnmount(){
		this.renderer = null;
		this.looped = false;
		// window.cancelAnimationFrame(requestId);
	}
	animate() {
		if(!this.looped) return;
		requestAnimationFrame( this.animate.bind(this));
		this.time+= 0.02;
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
					overflow: "hidden"}} />
			</div>)
	}
}

//-----------------------------------------------------------------/
// 	secondShader(){
//
// 		const vertexShader =
// 			`	varying vec2 vUv;
// 		varying vec3 vecPos;
//
// 		void main() {
// 			vUv = uv;
// 			vecPos = (modelViewMatrix * vec4(position, 1.0)).xyz;
// 			gl_Position = projectionMatrix * vec4(vecPos, 1.0);
// 		}`;
//
// 		const fragmentShader =
// 			`uniform sampler2D textureSampler;
// 			uniform float u_time;
//
//
// 		void main() {
// 		  gl_FragColor = vec4(abs(cos(u_time)),abs(sin(u_time)),0.0,1.0);
// 		}`;
//
//
// 		const  geometry = new THREE.BoxBufferGeometry(3, 3, 3 );
// 		const customMaterial = new THREE.ShaderMaterial(
// 			{
// 				uniforms: {u_time:{value:null}},
// 				vertexShader:   vertexShader,
// 				fragmentShader: fragmentShader,
// 			}   );
// 		this.cube2 = new THREE.Mesh( geometry, customMaterial );
// 		this.cube2.position.set(0,0,0);
// 		this.scene.add( this.cube2 );
// 	}
// //-------------------------------------------------------
// 	thirdShader(){
//
// 		const vertexShader =
// 			`varying vec2 vUv;
// 			 varying vec3 vecPos;
//
// 			void main() {
// 				vUv = uv;
// 				vecPos = (modelViewMatrix * vec4(position, 1.0)).xyz;
// 				gl_Position = projectionMatrix * vec4(vecPos, 1.0);
// 			}`;
//
// 		const fragmentShader =
// 			`
// 			uniform vec2 u_resolution;
// 			uniform float u_time;
//          uniform vec2 u_mouse;
//
//
//
// 		void main() {
// 		vec2 st = gl_FragCoord.xy/u_resolution;
// 		 gl_FragColor = vec4(st.x+sin(u_mouse.x * u_mouse.y ),st.y+sin(u_mouse.x * u_mouse.y ),abs(sin(u_time)),1.0);
// 		}`;
//
//
// 		const  geometry = new THREE.BoxBufferGeometry(3, 3, 3 );
// 		const customMaterial = new THREE.ShaderMaterial(
// 			{
// 				uniforms: {
// 					u_resolution:{type: "v2",value: this.resolution},
// 					u_time:{type: "f",value: this.time},
// 					u_mouse: {type: "v2",value: this.mouse}
// 				},
// 				vertexShader:   vertexShader,
// 				fragmentShader: fragmentShader,
// 			}   );
// 		this.cube3 = new THREE.Mesh( geometry, customMaterial );
// 		this.cube3.position.set(3,0,0);
// 		this.scene.add( this.cube3 );
// 	}
// //------------------------------------------------------------------------------
// 	fourth(){
//
// 		const vertexShader =
// 			`varying vec2 vUv;
// 			 varying vec3 vecPos;
//
// 			void main() {
//
// 				vUv = uv;
// 				vecPos = (modelViewMatrix * vec4(position, 1.0)).xyz;
// 				gl_Position = projectionMatrix *
//                 modelViewMatrix *
//                 vec4(position,1.0);
// 			}`;
//
// 		const fragmentShader =
// 			`
// 			uniform vec2 u_resolution;
// 			uniform float u_time;
//          uniform vec2 u_mouse;
//
//
// 				float plot(vec2 st, float pct){
//   					return  smoothstep( pct-0.02, pct, st.y) -
//           					smoothstep( pct, pct+0.02, st.y);
// 				}
//
// 		void main() {
// 			vec2 st = gl_FragCoord.xy/u_resolution;
// 			float y = st.x;
// 			vec3 color = vec3(y);
//
// 			float pct = plot(st,y);
//     			color = (1.0-pct)*color+pct*vec3(0.0,1.0,0.0);
//
// 			gl_FragColor = vec4(color,1.0);
// 		}`;
//
//
// 		const  geometry = new THREE.BoxBufferGeometry(3, 3, 3 );
// 		const customMaterial = new THREE.ShaderMaterial(
// 			{
// 				uniforms: {
// 					u_resolution:{type: "v2",value: this.resolution},
// 					u_time:{type: "f",value: this.time},
// 					u_mouse: {type: "v2",value: this.mouse}
// 				},
// 				vertexShader:   vertexShader,
// 				fragmentShader: fragmentShader,
// 			}   );
// 		this.cube3 = new THREE.Mesh( geometry, customMaterial );
// 		this.cube3.position.set(-3,3,0);
// 		this.scene.add( this.cube3 );
// 	}
//
// 	fiveth(){
//
// 		const vertexShader =
// 			`varying vec4 worldPosition;
// 			 varying vec3 vecPos;
// 			 varying vec3 vNormals;
//
// 			void main() {
// 				worldPosition = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
// 				 worldPosition = vec4(position, 1.0);
// 				 vNormals = normal;
// 					worldPosition = modelViewMatrix * vec4(position, 1.0);
// 				vecPos = (modelViewMatrix * vec4(position, 1.0)).xyz;
// 				gl_Position = projectionMatrix * vec4(vecPos, 1.0);
// 			}`;
//
// 		const fragmentShader =
// 			`
// 			uniform vec2 u_resolution;
// 			uniform float u_time;
//          uniform vec2 u_mouse;
//
//        varying vec4 worldPosition;
//        varying vec3 vNormals;
//
// 				float plot(vec2 st, float pct){
//   					return  smoothstep( pct-0.02, pct, st.y) -
//           					smoothstep( pct, pct+0.02, st.y);
// 				}
//
// 		void main() {
// 			vec2 st = gl_FragCoord.xy/u_resolution;
// 			float y = st.x;
// 			vec3 color = vec3(y);
//
// 			float pct = plot(st,y);
//     			color = (1.0-pct)*color+pct*vec3(0.0,1.0,0.0);
//     			float res = dot(worldPosition.xyz,normalize(color));
//
// 			gl_FragColor = vec4(res,res,res,1.0);
// 		}`;
//
//
// 		const  geometry = new THREE.BoxBufferGeometry(3, 3, 3 );
// 		const customMaterial = new THREE.ShaderMaterial(
// 			{
// 				uniforms: {
// 					u_resolution:{type: "v2",value: this.resolution},
// 					u_time:{type: "f",value: this.time},
// 					u_mouse: {type: "v2",value: this.mouse}
// 				},
// 				vertexShader:   vertexShader,
// 				fragmentShader: fragmentShader,
// 			}   );
// 		this.cube3 = new THREE.Mesh( geometry, customMaterial );
// 		this.cube3.position.set(0,3,0);
// 		this.scene.add( this.cube3 );
// 	}
// 	//----------------------------------------------------
//***********************
// this.cube2.material.uniforms.u_time = {type: "f",value:this.time};
// //---------------------------------------------
// this.cube3.material.uniforms.u_time = {type: "f",value: this.time};
// this.cube3.material.uniforms.u_mouse = {type: "v2",value: this.mouse};
//-----------------------------------------------