/**
 * Created by Ellyson on 5/11/2018.
 */

import React from 'react';
import * as THREE from 'three';
import TemplateFor3D from "../../../templates/mainTemplate3D";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import fragmentShader from './Shaders/shader.frag';
import vertexShader from './Shaders/shader.vert';

const mp3 = require('./sound/holbaumannbenares.mp3');

const prefix = ``;//`dark-s_`;
const format = `.jpg`;
const urls = [
	require(`./textures/cube/` + prefix + 'posx' + format), require(`./textures/cube/` + prefix + 'negx' + format),
	require(`./textures/cube/` + prefix + 'posy' + format), require(`./textures/cube/` + prefix + 'negy' + format),
		require(`./textures/cube/` + prefix + 'posz' + format), require(`./textures/cube/` + prefix + 'negz' + format)];

const aum = require("./textures/aum.png");
const benares = require("./textures/benares.png");

export default class Benares extends TemplateFor3D {
	constructor() {
		super();
		this.raycaster = new THREE.Raycaster();
	}

	onDocumentMouseDown(event) {
		const mouse = new THREE.Vector2();
		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
		// this.raycaster.setFromCamera(mouse, this.camera.clone());
		// if(this.state.checked) this.intersects = this.raycaster.intersectObject(this.planeMesh);
	}

	initScene() {
		super.initScene();
		this.scene.background = new THREE.Color(0xffffff);
	}

	initControls() {
		super.initControls();
		this.camera.position.set(1366/2, 768/2, 770);
		this.controls.target.set(1366/2, 768/2, 0);
	}

	handleWindowResize() {
		this.HEIGHT = window.innerHeight;
		this.WIDTH = window.innerWidth;
		this.renderer && this.renderer.setSize(this.WIDTH, this.HEIGHT);
		this.camera.aspect = this.WIDTH / this.HEIGHT;
		this.camera.updateProjectionMatrix();
	}


	componentDidMount() {

		const {innerWidth, innerHeight} = window;

		const renderer = new THREE.WebGLRenderer({
			antialias: true
		});
		renderer.setSize(innerWidth, innerHeight);
		renderer.autoClear = false;
		document.body.appendChild(renderer.domElement);

//#region Resources
		const manager = new THREE.LoadingManager();
		const startButton = document.getElementById('startButton');
		manager.onProgress = function (url, itemsLoaded, itemsTotal) {
			startButton.innerText = Math.round(itemsLoaded / itemsTotal) * 100 + " %";
		};
		manager.onLoad = function () {
			startButton.innerText = "Play";
			startButton.addEventListener("click", startPlayback);
		}

		let dataTexture = null;
		let analyser;
		function startPlayback() {
			const fftSize = 128;

			const listener = new THREE.AudioListener();

			const audio = new THREE.Audio(listener);

			const mediaElement = new Audio(mp3);
			mediaElement.loop = true;

			audio.setMediaElementSource(mediaElement);

			analyser = new THREE.AudioAnalyser(audio, fftSize);

			dataTexture = new THREE.DataTexture(analyser.data, fftSize / 2, 1, THREE.LuminanceFormat);

			backUniforms.soundData.value = dataTexture;

			renderer.render(sceneBack, cameraBack);
			renderer.render(sceneFront, cameraFront);
			renderer.clear();

			mediaElement.play();

			renderer.setAnimationLoop(AnimationLoop);

			const overlay = document.getElementById('overlay');
			overlay.remove();
		}


		const cubeTextureLoader = new THREE.CubeTextureLoader(manager);

		const reflectionCube = cubeTextureLoader.load(urls);

		const textureLoader = new THREE.TextureLoader(manager);
		const texAum = textureLoader.load(aum);
		const texBenares = textureLoader.load(benares);
//#endregion

//#region Back
		const cameraBack = new THREE.Camera();
		const sceneBack = new THREE.Scene();
		const backPlaneGeom = new THREE.PlaneBufferGeometry(2, 2);

		const backUniforms = {
			texBenares: {
				value: texBenares
			},
			screenRatio: {
				value: innerWidth / innerHeight
			},
			time: {
				value: 0
			},
			soundData: {
				value: dataTexture
			}
		}
		const backPlaneMat = new THREE.ShaderMaterial({
			uniforms: backUniforms,
			vertexShader: vertexShader,
			fragmentShader: fragmentShader
		});


		const backPlane = new THREE.Mesh(backPlaneGeom, backPlaneMat);
		sceneBack.add(backPlane);
//#endregion

//#region Front
		const sceneFront = new THREE.Scene();
		const cameraFront = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100);
		cameraFront.position.set(3, 3, 3).setLength(3.75);

		const controls = new OrbitControls(cameraFront, renderer.domElement);
		controls.enableDamping = true;
		controls.autoRotate = true;
		controls.minDistance = 2.5;
		controls.maxDistance = 5;
		controls.enablePan = false;

//sceneFront.background = reflectionCube;

		const light = new THREE.DirectionalLight(0xffffff, 0.125);
		light.position.set(0, -1, 0);
		sceneFront.add(light);
		sceneFront.add(new THREE.AmbientLight(0xffffff, 0.875));

//sceneFront.add(new THREE.GridHelper(10, 10));

		const spheresAmount = 12;
		const angleStep = Math.PI / spheresAmount;

		const spheres = [];
		const corpuscules = [];

		const sphereColor = 0xff5527; //0x884444;
		const sGeom = new THREE.SphereBufferGeometry(0.075, 16, 16);
		const sMat = new THREE.MeshLambertMaterial({
			color: sphereColor,
			envMap: reflectionCube,
			reflectivity: 0.0625
		});

		const icosahedronGeom = new THREE.IcosahedronGeometry(1, 0);
		for (let i = 0; i < spheresAmount; i++) {
			let sphere = new THREE.Mesh(sGeom, sMat);
			sphere.userData.dirVector = new THREE.Vector3().copy(icosahedronGeom.vertices[i]);
			sphere.userData.dirTheta = Math.random() * Math.PI;
			spheres.push(sphere);
			sceneFront.add(sphere);
			corpuscules.push(sphere.position);
		}

//const mainSphereGeom = new THREE.SphereBufferGeometry(1.25, 144, 144).toNonIndexed();
		const mainSphereGeom = new THREE.BoxBufferGeometry(2, 2, 2, 50, 50, 50);
// make a sphere from the box
		const sPos = mainSphereGeom.attributes.position;
		const sNorm = mainSphereGeom.attributes.normal;
		const temp = new THREE.Vector3();
		const sides = [];
		for (let i = 0; i < sPos.count; i++){

			temp.fromBufferAttribute(sPos, i);
			temp.normalize();

			sPos.setXYZ(i, temp.x, temp.y, temp.z);
			sNorm.setXYZ(i, temp.x, temp.y, temp.z);
			sides.push(Math.floor(i / (51 * 51)));
		}
//mainSphereGeom = mainSphereGeom.toNonIndexed();
		mainSphereGeom.setAttribute("sides", new THREE.Float32BufferAttribute(sides, 1));


		const mainSphereMat = new THREE.MeshLambertMaterial({
			color: 0x333366,
			envMap: reflectionCube,
			reflectivity: 0.125
		});
		mainSphereMat.defines = {"USE_UV":""};
		mainSphereMat.extensions = {derivatives: true};
		const uniforms = {
			corpuscules: {
				value: corpuscules
			},
			texAum: {
				value: texAum
			},
			time: {
				value: 0
			}
		};
		mainSphereMat.onBeforeCompile = shader => {
			shader.uniforms.corpuscules = uniforms.corpuscules;
			shader.uniforms.texAum = uniforms.texAum;
			shader.uniforms.time = uniforms.time;
			shader.vertexShader = `
      uniform vec3 corpuscules[${spheresAmount}];
      attribute float sides;
      constying float vSides;
  ` + shader.vertexShader;
			shader.vertexShader = shader.vertexShader.replace(
				`#include <begin_vertex>`,
				`#include <begin_vertex>

    vSides = sides;
    
    vec3 accumulate = vec3(0);
    float shortestDist = 1000.;
    
    for(int i = 0; i < ${spheresAmount}; i++){
    	vec3 sPos = corpuscules[i];
      vec3 diff = sPos - transformed;
      vec3 dir = normalize(diff);
      float dist = length(diff);
      shortestDist = min(shortestDist, dist);
      
      float force = .0125 / (dist * dist);
      vec3 forceVec = dir * force;
      
      accumulate += forceVec;
    }
    
    vec3 normAccumulate = normalize(accumulate);
    
    float accumulateLength = clamp(length(accumulate), 0., shortestDist);
    accumulate = normAccumulate * accumulateLength;

    float distRatio = accumulateLength / shortestDist;

    transformed += accumulate;
   
    // re-compute normals    
    vec3 n0 = vec3(normal);
    vec3 n1 = cross(normAccumulate, n0);
    vec3 n2 = cross(n1, normAccumulate);
    vec3 finalNormal = mix(n0, n2, distRatio);
    transformedNormal = normalMatrix * finalNormal;
    `
			);

			shader.fragmentShader = `
        uniform sampler2D texAum;
        uniform float time;
        constying float vSides;

        //  https://www.shadertoy.com/view/MsS3Wc
        vec3 hsb2rgb( in vec3 c ){
            vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                                    6.0)-3.0)-1.0,
                            0.0,
                            1.0 );
            rgb = rgb*rgb*(3.0-2.0*rgb);
            return c.z * mix( vec3(1.0), rgb, c.y);
        }
    ` + shader.fragmentShader;
			shader.fragmentShader = shader.fragmentShader.replace(
				`#include <dithering_fragment>`,
				`#include <dithering_fragment>
        
        float texVal = texture2D( texAum, vUv ).r;
        
        vec2 uv = vUv;
        uv -= 0.5;
        uv *= 108.;

        float a = atan(uv.x,uv.y)+PI;
        float r = PI2/floor(3. + floor(mod(time + vSides, 6.)));
        float d = cos(floor(.5+a/r)*r-a)*length(uv);
        
        float e = length(fwidth(uv)) * 0.5;
        /*float s = smoothstep(15. - e, 15., d ) - smoothstep(15., 15. + e, d);*/
        float waveVal = /*s > 0.5 ? 1. : */ sin((d - time) * PI2) * 0.5 + 0.5;

        vec3 col = vec3(0);
        col = vec3(0, 0.5, 1) * 0.5;
        col = hsb2rgb(vec3((1./6.) * vSides * (PI / 3.) + time, .125, .5));
        //col = mix(col, vec3(0.5, 0.25, 0), waveVal);
        gl_FragColor.rgb = mix(gl_FragColor.rgb, col, texVal * waveVal);
        `
			);
			//console.log(shader.fragmentShader);
		}
		const mainSphere = new THREE.Mesh(mainSphereGeom, mainSphereMat);
		sceneFront.add(mainSphere);
//#endregion

		window.addEventListener('resize', onWindowResize, false);

		const clock = new THREE.Clock();

		function AnimationLoop() {

			let t = clock.getElapsedTime() * 0.625;

			spheres.forEach((s) => {

				s.position.copy(s.userData.dirVector).multiplyScalar(Math.sin(s.userData.dirTheta + t) * 2);

			});
			uniforms.time.value = t;
			backUniforms.time.value = t;

			analyser.getFrequencyData();

			backUniforms.soundData.value.needsUpdate = true;

			controls.update();

			renderer.clear();
			renderer.render(sceneBack, cameraBack);
			renderer.clearDepth();
			renderer.render(sceneFront, cameraFront)

		}

		function onWindowResize() {

			cameraFront.aspect = innerWidth / innerHeight;
			cameraFront.updateProjectionMatrix();

			backUniforms.screenRatio.value = innerWidth / innerHeight;

			renderer.setSize(innerWidth, innerHeight);

		}

	}

	animate() {
		if (!this.looped) return;
		super.animate();
	}


	render() {
		return <div>
			<div id="info">
				<a href="https://www.youtube.com/watch?v=sNqBgdunKoU" target="_blank">Hol Baumann - Benares</a>
			</div>

			<div id="overlay">
				<div>
					<button id="startButton">0 %</button>
				</div>
			</div>
		</div>
	}
}
