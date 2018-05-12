/**
 * Created by Ellyson on 5/11/2018.
 */

import React from 'react';
import * as THREE from 'three';

const Colors = {
	red: 0xf25346
	, white: 0xd8d0d1
	, brown: 0x59332e
	, pink: 0xF5986E
	, brownDark: 0x23190f
	, blue: 0x68c3c0
};

class Sea {
	constructor(){

		const geom = new THREE.CylinderGeometry(600, 600, 800, 40, 10);

		//rotate the geom
		geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

		//important:by mergin vertices we ensure the continuty of the waves
		geom.mergeVertices();

		//get the vertices length
		const l = geom.vertices.length;

		//create an array to store new data associated to each vertex
		this.waves = [];

		for(let i = 0; i < l; i++){

			let v = geom.vertices[i];
			this.waves.push({y: v.y, x: v.x, z: v.z,
				/*random angle*/ang: Math.random() * Math.PI * 2,
				/*random distance*/amp: 5 + Math.random() * 15,
				/*random speed between 0.016 and 0.048 radians/frame*/speed: 0.016 + Math.random() * 0.032});
		}

		const mat = new THREE.MeshPhongMaterial({
			color: "#429837"
			, transparent: true
			, opacity: .9
			, shading: THREE.FlatShading
			, });

		this.mesh = new THREE.Mesh(geom, mat);
		this.mesh.receiveShadow = true;
	}
	moveWaves(){

		//get the vertices
		const verts = this.mesh.geometry.vertices;
		const l = verts.length;

		for(let i = 0; i < l; i++){
			let v = verts[i];

			//get the data assiciated to it
			const vProps = this.waves[i];
			//update the position
			v.x= vProps.x + Math.cos(vProps.ang) * vProps.amp;
			v.y= vProps.y + Math.sin(vProps.ang) * vProps.amp;

			//increment the angle for the next frame
			vProps.ang += vProps.speed;
		}

		this.mesh.geometry.verticesNeedUpdate=true;

	}
}

class Cloud{

	constructor(){
		this.mesh=new THREE.Object3D();

		const geom = new THREE.BoxGeometry(20,20,20);
		const mat = new THREE.MeshPhongMaterial({
			color: Colors.white,
		});
		//duplicate meshes a random number of time
		const nBlocs = 3 + Math.floor(Math.random() * 3);
		for (let i = 0; i < nBlocs; i++){

			const childMesh = new THREE.Mesh(geom, mat);

			childMesh.position.x = i * 15;
			childMesh.position.y = Math.random() * 10;
			childMesh.position.z = Math.random() * 10;
			childMesh.rotation.z = Math.random() * Math.PI * 2;
			childMesh.rotation.y = Math.random() * Math.PI * 2;

			//set the size of cube randomly
			const size = .1 + Math.random() * .9;
			childMesh.scale.set(size, size, size);

			childMesh.castShadow = true;
			childMesh.receiveShadow = true;

			this.mesh.add(childMesh);
		}
	}
}

class Sky{
	constructor(){

		this.mesh = new THREE.Object3D();

		//chose a number of clouds to be scattered in the sky
		this.nClouds = 20;

		//To distribute the clouds consistently,
		//we need to place the according to a uniform anle
		const stepAngle = Math.PI * 2 / this.nClouds;

		//create the clouds
		for(let i = 0; i < this.nClouds; i++){
			const c = new Cloud();

			const angle = stepAngle * i;//this is final angle of cloud
			const height = 780 + Math.random() * 200;//this is the distance between the center of the axis and the cloud itself

			//we are simply converting polar coordinates(angle,distance) into Cartesian coordinates (x,y)
			c.mesh.position.y = Math.sin(angle) * height;
			c.mesh.position.x = Math.cos(angle) * height;

			c.mesh.position.z = -400 - Math.random() * 400;

			//rotate the cloud according to its position
			c.mesh.rotation.z = angle * Math.PI/2;

			const scale = 1 + Math.random() * 2;
			c.mesh.scale.set(scale, scale, scale);

			this.mesh.add(c.mesh);
		}
	}

}

class Pilot{
	constructor(){

		this.mesh = new THREE.Object3D();
		this.mesh.name="pilot";

		//anglesHairs is a prop used to animate the hair later
		this.angleHairs=0;

		//body of pilot
		const bodyGeom = new THREE.BoxGeometry(15, 15, 15);
		const bodyMat = new THREE.MeshPhongMaterial({color: Colors.brown, shading: THREE.FlatShading});
		const body = new THREE.Mesh(bodyGeom, bodyMat);
		body.position.set(2, -12, 0);
		this.mesh.add(body);

		//face
		const faceGeom= new THREE.BoxGeometry(10,10,10);
		const faceMat= new THREE.MeshPhongMaterial({color: Colors.pink});
		const face = new THREE.Mesh(faceGeom, faceMat);
		this.mesh.add(face);

		//hair
		const hairGeom = new THREE.BoxGeometry(4, 4, 4);
		const hairMat = new THREE.MeshPhongMaterial({color: Colors.brown});
		const hair = new THREE.Mesh(hairGeom, hairMat);
		//align the shape of the hair to its bottom boundary,that will make it easier to scale
		hair.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 2, 0));

		//create a container for the hair
		const hairs = new THREE.Object3D();

		//create acontainer for the hairs at the top
		//of head(the ones that will animated)
		this.hairsTop = new THREE.Object3D();

		//create the Hairs at the top of head and position them on 3 x 4 grid

		for (let i = 0; i < 12; i++){
			const h = hair.clone();
			const col= i % 3;
			const row = Math.floor(i/3);
			const startPosZ =- 4;
			const startPosX =- 4;
			h.position.set(startPosX + row * 4, 0, startPosZ + col * 4);
			this.hairsTop.add(h);
		}
		hairs.add(this.hairsTop);

		// hairs at side face;

		const hairSideGeom = new THREE.BoxGeometry(12, 4, 2);
		hairSideGeom.applyMatrix(new THREE.Matrix4().makeTranslation(-6, 0, 0));
		const hairSideR = new THREE.Mesh(hairSideGeom, hairMat);
		const hairSideL = hairSideR.clone();
		hairSideL.position.set(8, -2, 6);
		hairSideR.position.set(8, -2, -6);
		hairs.add(hairSideR);
		hairs.add(hairSideL);

		//create the hairs at back of the head

		const hairBackGeom = new THREE.BoxGeometry(2, 8, 10);
		const hairback = new THREE.Mesh(hairBackGeom,hairMat);
		hairback.position.set(-1, -4, 0)
		hairs.add(hairback);
		hairs.position.set(-5, 5, 0);

		this.mesh.add(hairs);

		//glasses
		const glassGeom = new THREE.BoxGeometry(5, 5, 5);
		const glassMat = new THREE.MeshPhongMaterial({color: Colors.brown});
		const glassR = new THREE.Mesh(glassGeom, glassMat);
		glassR.position.set(6, 0, 3);
		const glassL = glassR.clone();
		glassL.position.z =- glassR.position.z;

		const glassAGeom = new THREE.BoxGeometry(11, 1, 11);
		const glassA = new THREE.Mesh(glassAGeom, glassMat);
		this.mesh.add(glassA);
		this.mesh.add(glassR);
		this.mesh.add(glassL);

		const earGeom = new THREE.BoxGeometry(2, 3, 2);
		const earL = new THREE.Mesh(earGeom, faceMat);
		earL.position.set(0, 0, -6);
		const earR = earL.clone();
		earR.position.set(0, 0, 6);
		this.mesh.add(earL);
		this.mesh.add(earR);
	}
	updateHairs(){

		const hairs = this.hairsTop.children;

		//update the according to the angle
		for(let i = 0; i < hairs.length; i++){
			const hair = hairs[i];
			//each hair element will scale on cyclical basic between 75% and 100% of it's origin size
			hair.scale.y = 0.75 + Math.cos(this.angleHairs + i / 3) * 0.25;
		}
		//increment angle for the next frame
		this.angleHairs += 0.16;
	}
}

class AirPlane {
	constructor(){
		this.mesh=  new THREE.Object3D();

		//Create the Cabin
		const geomCockpit = new THREE.BoxGeometry(105, 50, 42, 1, 1, 1);
		const matCockpit = new THREE.MeshPhongMaterial({color: "#3bd14c", shading: THREE.FlatShading});

		//we can access a specific vertex of a shape through
		//the vertices array,and then move it's x,y,z prop
		geomCockpit.vertices[4].y -= 10;
		geomCockpit.vertices[4].z += 18;
		geomCockpit.vertices[5].y -= 10;
		geomCockpit.vertices[5].z -= 18;
		geomCockpit.vertices[6].y += 30;
		geomCockpit.vertices[6].z += 20;
		geomCockpit.vertices[7].y += 30;
		geomCockpit.vertices[7].z -= 20;

		const cockpit = new THREE.Mesh(geomCockpit, matCockpit);
		cockpit.position.x -= 12;
		cockpit.castShadow=true;
		cockpit.receiveShadow=true;

		this.mesh.add(cockpit);

		// Create the engine
		const geomEngine = new THREE.BoxGeometry(20, 50, 50, 1, 1, 1);
		const matEngine = new THREE.MeshPhongMaterial({color: Colors.white, shading: THREE.FlatShading});
		const engine = new THREE.Mesh(geomEngine, matEngine);
		engine.position.x = 40;
		engine.castShadow = true;
		engine.receiveShadow = true;
		this.mesh.add(engine);

		//Create the wing
		const geomSideWing = new THREE.BoxGeometry(40, 8, 150, 1, 1, 1);
		const matSideWing = new THREE.MeshPhongMaterial({color: "#a3e240", shading: THREE.FlatShading});
		geomSideWing.vertices[4].y -= 5;
		geomSideWing.vertices[5].y -= 5;
		const sideWing = new THREE.Mesh(geomSideWing, matSideWing);
		const winfTop = sideWing.clone();
		winfTop.position.y = 45;
		sideWing.castShadow = true;
		sideWing.receiveShadow = true;
		this.mesh.add(sideWing);
		this.mesh.add(winfTop);

		//pillars

		const geomPillar = new THREE.BoxGeometry(2, 45, 1);
		const matPillar = new THREE.MeshPhongMaterial({color: "#25572a"});
		const pillarRf = new THREE.Mesh(geomPillar, matPillar);
		geomPillar.vertices[0].x += 4;
		geomPillar.vertices[1].x += 4;
		geomPillar.vertices[4].x += 4;
		geomPillar.vertices[5].x += 4;
		const pillarLf = pillarRf.clone();
		const pillarRb = pillarRf.clone();
		const pillarLb = pillarRf.clone();
		const pillarLfm = pillarRf.clone();
		const pillarRfm=pillarRf.clone();
		pillarRf.position.set(8,22,60);
		pillarLf.position.set(8,22,-60);
		pillarLb.position.set(-12,22,-60);
		pillarRb.position.set(-12,22,60);
		pillarRfm.position.set(8,22,10);
		pillarLfm.position.set(8,22,-10);
		this.mesh.add(pillarRf);
		this.mesh.add(pillarRb);
		this.mesh.add(pillarLf);
		this.mesh.add(pillarLb);
		this.mesh.add(pillarRfm);
		this.mesh.add(pillarLfm);

		// Create Tailplane

		const geomTailPlane = new THREE.BoxGeometry(15, 17, 4, 1, 1, 1);
		const matTailPlane = new THREE.MeshPhongMaterial({color: "#a3e240", shading: THREE.FlatShading});
		geomTailPlane.vertices[0].y -= 8;
		geomTailPlane.vertices[1].y -= 8;
		const tailPlane = new THREE.Mesh(geomTailPlane, matTailPlane);
		tailPlane.position.set(-57, 20, 0);
		tailPlane.castShadow = true;
		tailPlane.receiveShadow = true;
		this.mesh.add(tailPlane);

		//sidetail

		const geomSideTail = new THREE.BoxGeometry(15, 5, 30, 1, 1, 1);
		const matSideTail = new THREE.MeshPhongMaterial({color: "#a3e240", shading: THREE.FlatShading});
		geomSideTail.vertices[0].z -= 8;
		geomSideTail.vertices[1].z += 8;
		geomSideTail.vertices[2].z -= 8;
		geomSideTail.vertices[3].z += 8;
		const sideTail = new THREE.Mesh(geomSideTail, matSideTail);
		sideTail.position.set(-55, 10, 0);
		sideTail.castShadow = true;
		sideTail.receiveShadow = true;
		this.mesh.add(sideTail);

		//propeller
		const geomPropeller = new THREE.BoxGeometry(10, 10, 10, 1, 1, 1);
		const matPropeller= new THREE.MeshPhongMaterial({color: Colors.brown, shading: THREE.FlatShading});
		this.propeller = new THREE.Mesh(geomPropeller, matPropeller);

		this.propeller.castShadow = true;
		this.propeller.receiveShadow = true;

		//blades
		const geomBlade = new THREE.BoxGeometry(1, 80, 10, 1, 1, 1);
		const matBlade = new THREE.MeshPhongMaterial({color: Colors.brownDark, shading: THREE.FlatShading});
		const blade1 = new THREE.Mesh(geomBlade, matBlade);
		blade1.position.set(0,0,0);

		blade1.castShadow = true;
		blade1.receiveShadow = true;

		const blade2 = blade1.clone();
		blade2.rotation.x = Math.PI/2;

		blade2.castShadow = true;
		blade2.receiveShadow = true;

		this.propeller.add(blade1);
		this.propeller.add(blade2);
		this.propeller.position.set(55, 0, 0);
		this.mesh.add(this.propeller);

		//Wheels
		const wheelProtecGeom = new THREE.BoxGeometry(30, 15, 10, 1, 1, 1);
		const wheelProtecMat = new THREE.MeshPhongMaterial({color: "#a3e240", shading: THREE.FlatShading});
		const wheelProtecR = new THREE.Mesh(wheelProtecGeom, wheelProtecMat);
		wheelProtecR.position.set(25, -20, 25);
		this.mesh.add(wheelProtecR);

		const wheelTireGeom = new THREE.BoxGeometry(24, 24, 4);
		const wheelTireMat = new THREE.MeshPhongMaterial({color: Colors.brownDark, shading: THREE.FlatShading});
		const wheelTireR = new THREE.Mesh(wheelTireGeom, wheelTireMat);
		wheelTireR.position.set(25, -28, 25);

		const wheelAxisGeom = new THREE.BoxGeometry(10, 10, 6);
		const wheelAxisMat = new THREE.MeshPhongMaterial({color: Colors.brown, shading: THREE.FlatShading});
		const wheelAxis = new THREE.Mesh(wheelAxisGeom, wheelAxisMat);
		wheelTireR.add(wheelAxis);

		this.mesh.add(wheelTireR);

		const wheelProtecL = wheelProtecR.clone();
		wheelProtecL.position.z = -wheelProtecR.position.z ;
		this.mesh.add(wheelProtecL);

		const wheelTireL = wheelTireR.clone();
		wheelTireL.position.z = -wheelTireR.position.z;
		this.mesh.add(wheelTireL);

		const wheelTireB = wheelTireR.clone();
		wheelTireB.scale.set(.5, .5, .5);
		wheelTireB.position.set(-45, -5, 0);
		this.mesh.add(wheelTireB);

		const suspensionGeom = new THREE.BoxGeometry(4, 20, 4);
		suspensionGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0,10,0));
		const suspensionMat = new THREE.MeshPhongMaterial({color: "#a3e240", shading: THREE.FlatShading});
		const suspension = new THREE.Mesh(suspensionGeom, suspensionMat);
		suspension.position.set(-45, -3, 0);
		suspension.rotation.z = -.3;
		this.mesh.add(suspension);

		this.pilot = new Pilot();
		this.pilot.mesh.position.set(-10, 27, 0);
		this.mesh.add(this.pilot.mesh);
	}
}


export default class SecondWork extends React.Component {
	constructor(){
		super();
		this.state = {
			checked: false
		};
		this.stop = true;
		this.time = 0;
	}

	createSea() {

		this.sea = new Sea();

		//push it a little bit at the botom of th scene
		this.sea.mesh.position.y = -600;

		//add the mesh of the sea to the scene
		this.scene.add(this.sea.mesh);
	}

	createPlane(){
		this.airplane= new AirPlane();
		this.airplane.mesh.scale.set(.25, .25, .25);
		this.airplane.mesh.position.y = 100;
		this.airplane.mesh.position.z = 50;
		this.scene.add(this.airplane.mesh);
	}

	createScene() {

		this.HEIGHT = window.innerHeight;
		this.WIDTH = window.innerWidth;
		this.scene = new THREE.Scene(); //our scene
		this.scene.fog = new THREE.Fog("#d1be9a", 500, 850); //fog

		//creating the camera
		this.aspectRatio = this.WIDTH / this.HEIGHT;
		this.fieldOfView = 60;
		this.nearPlane = 1;
		this.farPlane = 10000;
		this.camera = new THREE.PerspectiveCamera(this.fieldOfView, this.aspectRatio, this.nearPlane, this.farPlane);

		//seting the position of camera;
		this.camera.position.x = 0;
		this.camera.position.z = 200;
		this.camera.position.y = 100;

		//creating the renderer;
		this.renderer = new THREE.WebGLRenderer({

			// Allow transparency to show the gradient background
			// we defined in the CSS
			alpha: true, // Activate the anti-aliasing; this is less performant,
			// but, as our project is low-poly based, it should be fine :)
			antialias: true
		});

		//Define the size of renderer
		this.renderer.setSize(this.WIDTH, this.HEIGHT);

		//Enable shadow rendering
		this.renderer.shadowMap.enabled = true;

		//Adding the DOM element of the render
		// this.container = document.getElementById("world");
		this.refs.plane.appendChild(this.renderer.domElement);

		// Listen to the screen: if the user resizes it
		// we have to update the camera and the renderer size
		// window.addEventListener('resize', this.handleWindowResize.bind(this), false);
	}

	createLights() {

		// A hemisphere light is a gradient colored light;
		// the first parameter - sky color, the second parameter - ground color,
		// the third parameter - intensity of the light
		this.hemisphereLight = new THREE.HemisphereLight("#c6a855", "#6081be", .9);

		// A directional light shines from a specific direction.
		// It acts like the sun, that means that all the rays produced are parallel.
		this.shadowLight = new THREE.DirectionalLight("#efb59c", .9);

		//set the directional light
		this.shadowLight.position.set(150, 350, 350);

		//Alow shadow casting
		this.shadowLight.castShadow = true;

		//define the visible area of the project shadow
		this.shadowLight.shadow.camera.left = -400;
		this.shadowLight.shadow.camera.right = 400;
		this.shadowLight.shadow.camera.top = 400;
		this.shadowLight.shadow.camera.bottom = -400;
		this.shadowLight.shadow.camera.near = 1;
		this.shadowLight.shadow.camera.far = 1000;

		//define the resolution of the shadow;the higher the better,
		//but also the more expensive and less performant
		this.shadowLight.shadow.mapSize.width = 2048;
		this.shadowLight.shadow.mapSize.height = 2048;

		// an ambient light modifies the global color of a scene and makes the shadows softer
		this.ambientLight = new THREE.AmbientLight("#063f69", .5);
		this.scene.add(this.ambientLight);

		//to activate the light just add to scene
		this.scene.add(this.hemisphereLight);
		this.scene.add(this.shadowLight);
	}


	createSky(){
		this.sky = new Sky();
		this.sky.mesh.position.y = -600;
		this.scene.add(this.sky.mesh);
	}

	componentDidMount() {

		this.createScene(); //set up camera and thr render
		this.createLights(); //add lights
		this.createPlane();//plane
		this.createSea(); //sea
		this.createSky();//sky

		//add the listener
		this.renderer.domElement.addEventListener('mousemove', this.handleMouseMove.bind(this), false);
		this.stop = true;
		this.loop();//update the object's

	}
	componentWillUnmount(){
		this.renderer = null;
		this.stop = false;
		// window.cancelAnimationFrame(requestId);
	}

	handleMouseMove(event){
		//here we converting mouse pos val recived
		//to a normalized value varying between -1 and 1;
		//this is the formula for the horizontall axis;

		const tx= -1 + (event.clientX / this.WIDTH) * 2;

		//for the vertical (becouse the 2d y goes the opposite direction of the 3d y)

		const ty= 1 - (event.clientY/this.HEIGHT) * 2;

		this.mousePos = {x: tx, y: ty};
	}

	updatePlane(){

		const targetX = normalize(this.mousePos.x, -.75, .75, -100, 100);
		const targetY = normalize(this.mousePos.y, -.75, .75, 25, 175);

		// Move the plane at each frame by adding a fraction of the remaining distance
		this.airplane.mesh.position.y += (targetY - this.airplane.mesh.position.y) * 0.1;

		// Rotate the plane proportionally to the remaining distance
		this.airplane.mesh.rotation.z = (targetY - this.airplane.mesh.position.y) * 0.0128;
		this.airplane.mesh.rotation.x = (this.airplane.mesh.position.y - targetY) * 0.0064;

		//update the plane position
		this.airplane.propeller.rotation.x += 0.5;
//    airplane.mesh.position.y=targetY;
		this.airplane.mesh.position.x=targetX;
	}

	loop(){
//  updatePlane();
// Rotate the propeller, the sea and the sky
//
		if(!this.stop) return;
		this.sea.mesh.rotation.z += .01;
		this.sky.mesh.rotation.z += .01;

		this.mousePos && this.mousePos.x && this.updatePlane();
		this.airplane.pilot.updateHairs();
		this.sea.moveWaves();
		this.renderer.render(this.scene, this.camera);

		requestAnimationFrame(this.loop.bind(this));

	}


	render() {
		return (
			<div>
				<header style={{position:"fixed",left:"15px",top:"15px"}} className="">
				</header>
				<div style={{
					width: "100%",
					height: "100%",
					overflow: "hidden",
					background: "linear-gradient(rgba(149, 152, 154, 0.65), #e3d08f)"
				}} ref="plane" />
			</div>)
	}
}

function normalize(v, vmin, vmax, tmin, tmax){

	const nv = Math.max(Math.min(v, vmax));
	const dv = vmax - vmin;
	const pc = (nv - vmin) / dv;
	const dt = tmax - tmin;
	return tmin + (pc * dt); //tv
}