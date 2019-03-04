/**
 * Created by Ellyson on 5/11/2018.
 */

import TemplateFor3D from '../../template3D/temp';
import * as THREE from 'three';
import {vertexShader, fragmentShader} from './shaders';

export default class Shader1 extends TemplateFor3D {
	constructor(){
		super();
	}

	initControls(){
		super.initControls();
		this.camera.position.set(0, 0, 10);
	}

	initShader(){
		const geometry = new THREE.SphereBufferGeometry(4, 30, 30);
		const customMaterial = new THREE.ShaderMaterial(
			{
				uniforms: {  },
				vertexShader: vertexShader,
				fragmentShader: fragmentShader,
			});
		this.sphere = new THREE.Mesh(geometry, customMaterial);
		this.scene.add(this.sphere);
	}

	componentDidMount() {
		super.componentDidMount();
		this.initShader();
		this.initControls();
		this.renderer.domElement.addEventListener("mousemove", this.onMouseMove.bind(this));
		this.animate();
	}

	onMouseMove(e){
		this.mouse = new THREE.Vector2(e.offsetX / window.innerWidth, e.offsetY / window.innerHeight);
	}

	animate() {
		super.animate();
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