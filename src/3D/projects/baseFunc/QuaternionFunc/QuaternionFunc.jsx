/**
 * Created by Ellyson on 5/11/2018.
 */

import TemplateFor3D from '../../../templates/mainTemplate3D';
import * as THREE from 'three';
import * as dat from 'dat.gui';

export default class Quaternion extends TemplateFor3D {
	initControls() {
		super.initControls();
		this.camera.position.set(0, 0, 10);
	}

	initPositionRotationScale() {
		const origin = new THREE.Vector3(0, 0, 0);
		const geometry = new THREE.BoxGeometry(1, 1, 1);
		const material = new THREE.MeshNormalMaterial();
		this.cube = new THREE.Mesh(geometry, material);
		this.scene.add(this.cube);

		const beforeVector = new THREE.Vector3(1, 0, 0);
		this.afterVector = beforeVector.clone();

		const gridHelper = new THREE.GridHelper(100, 10);
		this.scene.add(gridHelper);
		const axisHelper = new THREE.AxisHelper(5);
		this.scene.add(axisHelper);

		const beforeArrow = new THREE.ArrowHelper(beforeVector.clone().normalize(), origin, beforeVector.length(), 0xffff00);
		this.scene.add(beforeArrow);

		this.afterArrow = new THREE.ArrowHelper(this.afterVector.clone().normalize(), origin, this.afterVector.length() * 2, 0xffffff);
		this.cube.add(this.afterArrow);

		const gui = new dat.GUI();
		this.positionFolder = gui.addFolder('QuaternionFunc');
		this.rotationFolder = gui.addFolder('rotationFunc');
		this.positionFolder.add(this.cube.quaternion, "x", -1,1, 0.01);
		this.positionFolder.add(this.cube.quaternion, "y", -1,1, 0.01);
		this.positionFolder.add(this.cube.quaternion, "z", -1,1, 0.01);
		this.positionFolder.add(this.cube.quaternion, "w", -1,1, 0.01);
		this.positionFolder.open();
		this.rotationFolder.add(this.cube.rotation, "x", -5,5, 0.01);
		this.rotationFolder.add(this.cube.rotation, "y", -5,5, 0.01);
		this.rotationFolder.add(this.cube.rotation, "z", -5,5, 0.01);
		// positionFolder.domElement.style.pointerEvents = "none"
		this.rotationFolder.open();

	}

	componentDidMount() {
		super.componentDidMount();
		this.initPositionRotationScale();
		this.initControls();
		this.animate();
	}

	animate() {
		if (!this.looped) return;
		this.afterArrow.quaternion.clone(this.cube.quaternion);
		this.positionFolder.updateDisplay();
		this.rotationFolder.updateDisplay();
		super.animate();
	}
}
