/**
 * Created by Ellyson on 6/9/2019.
 */

import * as THREE from "three";
import {CSS3DRenderer, CSS3DObject} from "three/examples/jsm/renderers/CSS3DRenderer";

const font = require("three/examples/fonts/optimer_regular.typeface.json");

export function flyingText() {
	const height = 20,
		size = 70,
		curveSegments = 4,
		bevelThickness = 2,
		bevelSize = 1.5,
		bevelEnabled = true;

	const loader = new THREE.FontLoader();
	const loadedFont = loader.parse(font);
	console.log(loadedFont);
	let textGeo = new THREE.TextGeometry( "Open page", {
		font: loadedFont,
		size,
		height,
		curveSegments,
		bevelThickness,
		bevelSize,
		bevelEnabled
	});
	textGeo.computeBoundingBox();
	textGeo.computeVertexNormals();
	textGeo = new THREE.BufferGeometry().fromGeometry( textGeo );
	const materials = [
		new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } ), // front
		new THREE.MeshPhongMaterial( { color: 0xffffff } ) // side
	];
	textGeo.rotateY(Math.PI / 2).translate(0,0,800);
	return new THREE.Mesh( textGeo, materials );
}

function createCssObject(w, h, position, rotation) {
	const html = [
		'<div style="width:' + w + 'px; height:' + h + 'px; background: white; border-radius: 20px">',
		'<a style="font-size: 65px; line-height: 300px" href="http://www.tsukat.com">Open page</a>',
		'</div>'
	].join('\n');
	const div = document.createElement('div');
	div.innerHTML = html ;
	const cssObject = new CSS3DObject(div);
	cssObject.position.x = position.x;
	cssObject.position.y = position.y;
	cssObject.position.z = position.z;
	cssObject.rotation.x = rotation.x;
	cssObject.rotation.y = rotation.y;
	cssObject.rotation.z = rotation.z;
	console.log(cssObject)
	// cssObject.doubleSided = false;
	return cssObject;
}


export function create3dPage(w = 200, h= 200, position= 200, rotation = Math.PI, that) {
	const plane = createPlane(
		w, h,
		position,
		rotation);
	that.scene.add(plane);
	const cssObject = createCssObject(
		w, h,
		position,
		rotation);
	that.cssScene.add(cssObject);
}

function createPlane(w, h, position, rotation) {
	const material = new THREE.MeshBasicMaterial({
		color: 0x000000,
		// opacity: 0.0,
		side: THREE.DoubleSide,
		blending: THREE.NoBlending,
		shading: THREE.FlatShading
	});
	const geometry = new THREE.PlaneGeometry(w, h);
	const mesh = new THREE.Mesh(geometry, material);
	mesh.position.x = position.x;
	mesh.position.y = position.y;
	mesh.position.z = position.z;
	mesh.rotation.x = rotation.x;
	mesh.rotation.y = rotation.y;
	mesh.rotation.z = rotation.z;
	return mesh;
}


