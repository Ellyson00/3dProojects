import {CSS3DRenderer} from "three/examples/jsm/renderers/CSS3DRenderer";

export default class CssRenderer {
	constructor(renderer, dom){
		this.initCSS3DRender(renderer, dom)
	}

	initCSS3DRender(renderer, dom){
		this.renderer = new CSS3DRenderer();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.domElement.style.position = 'absolute';
		renderer.domElement.style.zIndex = 1;
		renderer.domElement.style.top = 0;
		renderer.domElement.style.left = 0;
		renderer.domElement.style.pointerEvents = "none";
		this.renderer.domElement.style.position = 'absolute';
		this.renderer.domElement.style.zIndex = 0;
		this.renderer.domElement.style.top = 0;
		dom.appendChild(this.renderer.domElement);
		this.renderer.domElement.appendChild(renderer.domElement);
	}
}