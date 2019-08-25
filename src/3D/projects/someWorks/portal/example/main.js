import Input from './lib/input.js';
import Renderer from './lib/renderer.js';
import { Color, FogExp2, Scene } from './lib/three.js';
import Dome from './meshes/dome.js';
import Ground from './meshes/ground.js';
import Grid from './meshes/grid.js';
import Hut from './meshes/hut.js';
import Pillars from './meshes/pillars.js';
import Portal from './meshes/portal.js';

// Create scenes
const exterior = new Scene();
const interior = new Scene();

// Reuse portal renderTarget
let renderTarget;

// Setup exterior scene
exterior.fog = new FogExp2(0x005e6e, 0.06);
{
	const hut = new Hut({ north: true });
	const portal = new Portal({
		width: 1,
		height: 3,
		textureWidth: 512,
		textureHeight: 1024,
		position: [0, 1.5, -0.499],
		scene: interior,
	});
	hut.add(portal);
	exterior.add(hut);
	renderTarget = portal.renderTarget;
}
exterior.add(new Ground());
exterior.add(new Dome({ color: exterior.fog.color }));

// Setup interior scene
interior.fog = new FogExp2(0x002B3B, 0.06);
{
	const hut = new Hut({ south: true });
	hut.add(new Portal({
		width: 1,
		height: 3,
		position: [0, 1.5, 0.499],
		rotation: [0, Math.PI, 0],
		scene: exterior,
		renderTarget,
	}));
	interior.add(hut);
}
interior.add(new Pillars());
interior.add(new Grid({ color: new Color(0x09020f) }));
interior.add(new Dome({ color: interior.fog.color }));

// Setup renderer
const mount = document.getElementById('mount');
const input = new Input({ mount });
const renderer = new Renderer({
	debug: document.getElementById('debug'),
	mount,
	scene: exterior,
});
const { animations, camera } = renderer;

// Setup camera animation
camera.position.set(0, 1.6, 2.25);
const distance = camera.position.z;
const cameraAnimation = ({ time }) => {
	if (input.isLocked) {
		// Pop animation out on first input lock
		animations.splice(
			animations.findIndex(animation => animation === cameraAnimation),
			1
		);
		return;
	}
	const angle = Math.PI * -0.5 + Math.sin(time * -0.25) * Math.PI;
	const factor = distance - angle;
	camera.position.x = Math.cos(angle) * factor;
	camera.position.z = Math.sin(angle) * factor;
	camera.lookAt(
		0, camera.position.y, -0.5
	);
};
animations.push(cameraAnimation);

// Setup player input
animations.push(({ delta }) => {
	if (input.onAnimationTick({ camera, delta })) {
		// Quick & Dirty teleportation logic
		const { x, z } = camera.position;
		const { direction } = input.vectors;
		const { scene } = renderer;
		if (
			x > -0.45 && x < 0.45
			&& z > -0.45 && z < 0.45
			&& (
				(scene === exterior && direction.z < 0)
				|| (scene === interior && direction.z > 0)
			)
		) {
			renderer.updateScene(scene === exterior ? interior : exterior);
		}
	}
});
