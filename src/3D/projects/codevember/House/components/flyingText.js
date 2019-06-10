/**
 * Created by Ellyson on 6/9/2019.
 */

import * as THREE from "three";
import {CSS3DObject} from "three/examples/jsm/renderers/CSS3DRenderer";

export default class flyingText {
	constructor(w, h, position, rotation){
		this.positionY = position.y;
		this.plane = this.createPlane(
			w, h,
			position,
			rotation);
		this.cssObject = this.createCssObject(
			w, h,
			position,
			rotation);
		this.show = false;
	}

	createCssObject(w, h, position, rotation) {
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
		return cssObject;
	}

	createPlane(w, h, position, rotation) {
		const material = new THREE.MeshBasicMaterial({
			color: 0x000000,
			trasperent: true,
			opacity: 0.0,
			side: THREE.DoubleSide,
			blending: THREE.NoBlending,
			// shading: THREE.FlatShading
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

	animate(time){
		if(this.show){
			this.plane.position.y = this.cssObject.position.y = this.positionY + Math.sin(time / 20) *  50;
		}
	}
}
