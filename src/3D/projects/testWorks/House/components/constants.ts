/**
 * Created by Ellyson on 6/9/2019.
 */
import * as THREE from 'three';

const purple: THREE.Color = new THREE.Color(1, 0, 1);
const blue: THREE.Color = new THREE.Color(0, 0, 1);
const white: THREE.Color = new THREE.Color(1, 1, 1);

export const COLORS = {
	purple,
	blue,
	white
};

export const colorsArray: Array<THREE.Color> = [COLORS.white, COLORS.purple, COLORS.blue];

export const FLOOR_POSITION = {
	base: 0,
	middle: 507.5,
	top: 1032.8
};

export const FLOOR_SIZE = {
	middle: 426,
	top: 606.5
};
