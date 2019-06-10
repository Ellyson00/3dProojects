/**
 * Created by Ellyson on 6/9/2019.
 */

import * as THREE from "three";
import {CSS3DObject} from "three/examples/jsm/renderers/CSS3DRenderer";

export default class flyingText {
	constructor(w, h, position, rotation, type, that){
		this.randomoffset = Math.random() * Math.PI;
		this.positionY = position.y;
		this.that = that;
		const dom = this.getDom(w, h, type);
		this.plane = this.createPlane(
			w, h,
			position,
			rotation);

		this.cssObject = this.createCssObject(
			w, h,
			position,
			rotation, dom);
		this.show = false;
	}

	getDom(w, h, type){

		if(type === "link"){

			const html = [
				'<div style="width: 50px; height:30px; background: white; border-radius: 2.0px">',
				'<a style="font-size: 6.5px; line-height: 30.0px" href="http://www.tsukat.com">Open page</a>',
				'</div>'
			].join('\n');
			const div = document.createElement('div');
			div.innerHTML = html;
			return div;

		} else if (type === "screen") {

			const div = document.createElement('div');
			div.innerText = "Click here to";
			div.style.fontSize=`${8}px`;
			div.style.lineHeight=`${h/2}px`;
			const outDiv = document.createElement('div');
			outDiv.style.width = `${w}px`;
			outDiv.style.height =`${h}px`;
			outDiv.style.background = "white";
			outDiv.style.borderRradius = "2.0px";
			const link = document.createElement('a');
			link.addEventListener("click", this.getScreenShot.bind(this));
			link.innerText = "Save screen";
			link.style.lineHeight=`${h/3}px`;
			link.style.fontSize=`${8}px`;
			link.style.cursor=`pointer`;
			outDiv.appendChild(div);
			outDiv.appendChild(link);
			return outDiv;
		}
	}

	createCssObject(w, h, position, rotation, attachDom) {
		const cssObject = new CSS3DObject(attachDom);
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

	getScreenShot(){
		const CANVAS = document.createElement("canvas");
		CANVAS.width = this.that.WIDTH;
		CANVAS.height = this.that.HEIGHT;
		this.that.flyingText.plane.visible = this.that.flyingText2.plane.visible = false;
		const RENDERER = new THREE.WebGLRenderer({canvas: CANVAS, preserveDrawingBuffer: true});
		RENDERER.render(this.that.scene, this.that.camera);
		const link = document.createElement("a");
		link.setAttribute('download', 'megaScreenshot.png');
		link.setAttribute('href', CANVAS.toDataURL("image/png").replace("image/png", "image/octet-stream"));
		link.click();
		this.that.flyingText.plane.visible = this.that.flyingText2.plane.visible = true;
	}

	animate(time){
		if(this.show){
			this.plane.position.y = this.cssObject.position.y = this.positionY + Math.sin(time / 30 + this.randomoffset  ) *  4.0;
		}
	}
}
