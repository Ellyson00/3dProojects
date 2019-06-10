/**
 * Created by Ellyson on 6/9/2019.
 */
import * as THREE from 'three';
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader';
import {FLOOR_POSITION} from './constants';

const house = require("../../../../models/FBX/house4.FBX");

export async function loadHouse(that) {
	const FBXParser = new FBXLoader();
	await FBXParser.load(house, (model) => {
		that.house = model;
		that.scene.add(model);
		model.scale.set(0.1,0.1,0.1);
		model.children.forEach((children)=>{
			that.floors[children.name] = {mesh: children, size: new THREE.Box3().setFromObject(children).getSize(new THREE.Vector3())};
			children.receiveShadow = true;
			children.castShadow = true;
			children.material.bumpScale = 0.2;
		});
		that.floors["House_Base"].mesh.position.y = FLOOR_POSITION.base;
		that.floors["House_Middle"].mesh.position.y = FLOOR_POSITION.middle;
		that.floors["House_Top"].mesh.position.y = FLOOR_POSITION.top;
	}, that.updateLoadingBar.bind(that), console.log);
}