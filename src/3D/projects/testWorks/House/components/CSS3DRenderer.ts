import {CSS3DRenderer} from "three/examples/jsm/renderers/CSS3DRenderer";

export default class CssRenderer {

	renderer: CSS3DRenderer;

	constructor(renderer: THREE.WebGLRenderer, dom: any){
		this.initCSS3DRender(renderer, dom)
	}

	initCSS3DRender(renderer, dom){
		this.renderer = new CSS3DRenderer();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		dom.appendChild(this.renderer.domElement);
		this.renderer.domElement.appendChild(renderer.domElement);
		renderer.domElement.className = "mainRenderer";
		this.renderer.domElement.className = "cssRenderer";
	}
}