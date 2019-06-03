/**
 * Created by Ellyson on 5/11/2018.
 */

import TemplateFor3D from '../../../templates/mainTemplate3D';
import * as THREE from 'three';
import * as dat from 'dat.gui';

export default class Matrix extends TemplateFor3D {
	initControls() {
		super.initControls();
		this.camera.position.set(0, 0, 10);
	}

	initPositionRotationScale() {
		const geometry = new THREE.BoxGeometry(5, 5, 5);
		const material = new THREE.MeshNormalMaterial();
		this.cube = new THREE.Mesh(geometry, material);
		this.scene.add(this.cube);

		const gui = new dat.GUI();
		const positionFolder = gui.addFolder('position');

		this.Matrix = this.cube.matrix.clone();
		this.cube.matrixAutoUpdate = false;
		this.Matrix.elements.forEach((elem, i) => {
			positionFolder.add(this.Matrix.elements, i, -5,5, 0.1);
		});
		positionFolder.add(this, "applyMatrix");

		positionFolder.open();
	}

	componentDidMount() {
		super.componentDidMount();
		this.initPositionRotationScale();
		this.initControls();
		this.animate();
	}

	applyMatrix(){
		this.cube.applyMatrix(this.Matrix);
	}

	animate(){
		if (!this.looped) return;
		super.animate();
	}


}
