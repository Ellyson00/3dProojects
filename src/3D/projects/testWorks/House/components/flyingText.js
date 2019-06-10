/**
 * Created by Ellyson on 6/9/2019.
 */

import * as THREE from "three";
import {CSS3DObject} from "three/examples/jsm/renderers/CSS3DRenderer";

export default class flyingText {
	constructor(w, h, position, rotation, type, main3D){
		this.randomoffset = Math.random() * Math.PI;
		this.positionY = position.y;
		this.main3D = main3D;
		const dom = this.getDom(w, h, type);
		this.plane = flyingText.createPlane(
			w, h,
			position,
			rotation);

		this.cssObject = flyingText.createCssObject(
			w, h,
			position,
			rotation, dom);
		this.show = false;
	}

	getDom(w, h, type){
		if(type === "link"){
			const mainDiv = document.createElement('div');
			const div = document.createElement('div');
			const link = document.createElement('a');
			const button = document.createElement('button');
			mainDiv.className = "linkPop";
			div.innerText = "Tsukat";
			button.innerText = "Open page";
			link.href = "http://www.tsukat.com";
			mainDiv.appendChild(div);
			mainDiv.appendChild(link);
			link.appendChild(button);
			return mainDiv;

		} else if (type === "screen") {

			const div = document.createElement('div');
			const mainDiv = document.createElement('div');
			const link = document.createElement('a');
			const button = document.createElement('button');
			div.innerText = "DomElement blended with WebGL";
			mainDiv.className = "sceenPop";
			mainDiv.style.width = `${w}px`;
			mainDiv.style.height =`${h}px`;
			link.addEventListener("click", this.getScreenShot.bind(this));
			button.innerText = "Save screen";
			mainDiv.appendChild(div);
			mainDiv.appendChild(link);
			link.appendChild(button);
			return mainDiv;

		}
	}

	static createCssObject(w, h, position, rotation, attachDom) {
		const cssObject = new CSS3DObject(attachDom);
		cssObject.position.copy(position);
		cssObject.quaternion.copy(new THREE.Quaternion().setFromEuler(rotation));
		return cssObject;
	}

	static createPlane(w, h, position, rotation) {

		const material = new THREE.MeshBasicMaterial({
			color: 0x000000,
			opacity: 0.0,
			side: THREE.DoubleSide,
			blending: THREE.NoBlending,
		});

		const materialBackSide = new THREE.MeshBasicMaterial({ //clone broke it
			color: 0xffffff,
			opacity: 0.0,
			side: THREE.BackSide,
			blending: THREE.NoBlending,
		});

		const geometry = new THREE.PlaneGeometry(w, h);
		const mesh = new THREE.Mesh(geometry, material);
		mesh.position.copy(position);
		mesh.quaternion.copy(new THREE.Quaternion().setFromEuler(rotation));
		const backSide = new THREE.Mesh(geometry, materialBackSide);
		backSide.position.z -= .2;
		mesh.add(backSide);
		return mesh;
	}

	getScreenShot(){
		const CANVAS = document.createElement("canvas");
		CANVAS.width = this.main3D.WIDTH;
		CANVAS.height = this.main3D.HEIGHT;
		this.main3D.linkObject.plane.visible = this.main3D.saveScreen.plane.visible = false;
		const renderer = new THREE.WebGLRenderer({canvas: CANVAS, preserveDrawingBuffer: true});
		renderer.render(this.main3D.scene, this.main3D.camera);
		const link = document.createElement("a");
		link.setAttribute('download', 'megaScreenShot.png');
		link.setAttribute('href', CANVAS.toDataURL("image/png").replace("image/png", "image/octet-stream"));
		link.click();
		this.main3D.linkObject.plane.visible = this.main3D.saveScreen.plane.visible = true;
	}

	animate(time){
		if(this.show){
			this.plane.position.y = this.cssObject.position.y = this.positionY + Math.sin(time / 30 + this.randomoffset) * 4.0;
		}
	}
}
