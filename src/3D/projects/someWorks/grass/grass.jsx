/**
 * Created by Ellyson on 5/14/2018.
 */

import * as THREE from 'three';
import TemplateFor3D from '../../../templates/mainTemplate3D';
const OBJLoader = require('three-obj-loader');
const MTLLoader = require('three-mtl-loader');
const grass = require('../../../img/map/grass.jpg');
const rockObj = require('../../../obj/Rock/Rock1.obj');
const rockMtl = require('../../../obj/Rock/Rock1.mtl');
OBJLoader(THREE);

export default class Grass extends TemplateFor3D {
	constructor() {
		super();
		this.THREE = THREE;
	}

	initScene() {
		super.initScene();
		this.scene.background = new THREE.Color(0x003300);
		this.light = new THREE.DirectionalLight(0xffffff, 1);
		this.scene.add(this.light);
	}

	initCamera() {
		super.initCamera();
		this.camera.position.y = this.camera.position.z = 75;
	}

	initStar() {
		const geometry = new THREE.PlaneBufferGeometry(100, 100);
		const texture = new THREE.CanvasTexture(this.generateTexture());
		this.group = new THREE.Object3D();
		for (let i = 0; i < 22; i ++) {
			const material = new THREE.MeshBasicMaterial({
				color: new THREE.Color().setHSL(0.3, 0.75, ( i / 15 ) * 0.4 + 0.1),
				map: texture,
				// depthTest: false, //meshes dissapear
				depthWrite: false,
				transparent: true
			});
			const mesh = new THREE.Mesh(geometry, material);
			mesh.position.y = i * 0.25;
			mesh.rotation.x = -Math.PI / 2;
			this.group.add(mesh);
		}

		this.scene.add(this.group);
		const mtlLoader = new MTLLoader();

		mtlLoader.load(rockMtl, (matl) => {
			// matl.preload(); //todo : empty materials
			const objLoader = new this.THREE.OBJLoader();

			objLoader.load(rockObj, (object) => {

				object.children.forEach((item) => {
					item.material = new THREE.MeshPhongMaterial({color: 0x8A804C, side: THREE.DoubleSide, flatShading: true})

					//adding frame to boxes
					// const geo = new THREE.EdgesGeometry( item.geometry, 1 ); // or WireframeGeometry
					// const mat = new THREE.LineBasicMaterial( { color: 0x2D2C23, linewidth: 5 } );
					//
					// const wireframe = new THREE.LineSegments( geo, mat );

					// item.add(wireframe);
				});
				const object2 = object.clone();
				const object3 = object.clone();
				object2.scale.set(6, 6, 6);
				object3.scale.set(15, 15, 15);
				object2.position.x =  0;
				object.scale.set(10, 10, 10);
				object.position.set(16, 12, -15);
				object3.position.set(-5, -5, -25);
				object.rotation.set(Math.PI, 0, 0);
				object2.rotation.set(0,Math.PI / 3,0);
				object3.rotation.set(Math.PI / 2,0,0);
				this.rocks = new THREE.Object3D();
				this.rocks.add(object, object2, object3);
				this.rocks.rotation.y = -Math.PI / 5;
				this.scene.add(this.rocks);
			});
		});

	}

	generateTexture() {
		this.canvas = document.createElement('canvas');
		this.canvas.width = 512;
		this.canvas.height = 512;
		this.context = this.canvas.getContext('2d');
		for (let i = 0; i < 20000; i ++) {
			this.context.fillStyle = 'hsl(0,25%,' + (Math.random() * 25 + 50) + '%)';
			this.context.beginPath();
			this.context.arc(Math.random() * this.canvas.width, Math.random() * this.canvas.height, Math.random() + 0.15, 0, Math.PI * 2, true);
			this.context.fill();
		}
		this.context.globalAlpha = 0.075;
		this.context.globalCompositeOperation = 'lighter';
		return this.canvas;
	}

	initGround() {
		let loader = new THREE.TextureLoader();
		loader.load(grass, (texture) => {
			this.geometry = new THREE.PlaneGeometry(120,120);
			this.material = new THREE.MeshBasicMaterial(
				{
					map: texture
				}
			);
			const ground = new THREE.Mesh(this.geometry, this.material);
			ground.rotation.x = -Math.PI / 2;
			this.scene.add(ground);
		});
	}

	componentDidMount() {
		super.componentDidMount();
		this.initStar();
		this.initGround();
		this.animate();
	}

	animate() {
		if (!this.looped) return;
		super.animate();
		const time = Date.now() / 6000;
		// this.camera.position.x = 80 * Math.cos( time );
		// this.camera.position.z = 80 * Math.sin( time );
		this.camera.lookAt(this.scene.position);
		for (let i = 0, l = this.group.children.length; i < l; i ++) {
			const mesh = this.group.children[i];
			mesh.position.x = Math.sin(time * 4) * i * i * 0.005;
			mesh.position.z = Math.cos(time * 6) * i * i * 0.005;
		}
	}
}