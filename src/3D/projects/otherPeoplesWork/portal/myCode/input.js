import { Vector3 } from 'three';

class Input {
	constructor({limits = {min: { x: -16, z: -16 }, max: { x: 16, z: 16 }}, mount}) {
		console.log(mount)
		this.keyboard = {};
		this.limits = limits;
		this.mouse = { x: 0, y: 0 };
		this.vectors = {
			direction: new Vector3(),
			forward: new Vector3(),
			right: new Vector3(),
			worldUp: new Vector3(0, 1, 0),
		};
		document.addEventListener('pointerlockchange', this.onLockChange.bind(this), false);
		mount && mount.addEventListener('mousedown', this.onMouseDown.bind(this), false);
		window.addEventListener('mousemove', this.onMouseMove.bind(this), false);
		window.addEventListener('keydown', this.onKeyDown.bind(this), false);
		window.addEventListener('keyup', this.onKeyUp.bind(this), false);
	}

	onAnimationTick({camera, delta}) {
		const {isLocked, limits, mouse, keyboard, vectors: {direction,	forward,	right, worldUp}} = this;
		let hasUpdatedPosition = false;
		if (!isLocked) {
			return hasUpdatedPosition;
		}

		// Mouse look
		if (mouse.x || mouse.y) {
			const sensitivity = 0.003;
			camera.rotation.y -= mouse.x * sensitivity;
			camera.rotation.x -= mouse.y * sensitivity;
			camera.rotation.x = Math.min(Math.max(camera.rotation.x, Math.PI * -0.5), Math.PI * 0.5);
			camera.updateMatrixWorld();
			camera.getWorldDirection(forward);
			forward.y = 0;
			right.crossVectors(forward, worldUp).normalize();
			mouse.x = 0;
			mouse.y = 0;
		}

		// Keyboard movement
		if (keyboard.forwards || keyboard.backwards || keyboard.leftwards || keyboard.rightwards) {
			direction.set(0, 0, 0);
			if (keyboard.forwards) {
				direction.add(forward);
			}
			if (keyboard.backwards) {
				direction.sub(forward);
			}
			if (keyboard.leftwards) {
				direction.sub(right);
			}
			if (keyboard.rightwards) {
				direction.add(right);
			}
			direction.normalize();
			camera.position.addScaledVector(direction, delta * 3);
			camera.position.x = Math.min(Math.max(camera.position.x, limits.min.x), limits.max.x);
			camera.position.z = Math.min(Math.max(camera.position.z, limits.min.z), limits.max.z);
			hasUpdatedPosition = true;
		}

		return hasUpdatedPosition;
	}

	onLockChange() {
		this.isLocked = !!document.pointerLockElement;
		this.keyboard = {};
	}

	onMouseDown() {
		const { isLocked } = this;
		if (!isLocked) {
			document.body.requestPointerLock();
			return;
		}
	}

	onMouseMove({ movementX, movementY }) {
		const { isLocked, mouse } = this;
		if (!isLocked) {
			return;
		}
		mouse.x += movementX;
		mouse.y += movementY;
	}

	onKeyDown({ keyCode, repeat }) {
		const { keyboard } = this;
		if (repeat) {
			return;
		}
		switch (keyCode) {
			case 87: // W
				keyboard.forwards = true;
				break;
			case 83: // S
				keyboard.backwards = true;
				break;
			case 65: // A
				keyboard.leftwards = true;
				break;
			case 68: // D
				keyboard.rightwards = true;
				break;
		}
	}

	onKeyUp({ keyCode }) {
		const { keyboard } = this;
		switch (keyCode) {
			case 87: // W
				keyboard.forwards = false;
				break;
			case 83: // S
				keyboard.backwards = false;
				break;
			case 65: // A
				keyboard.leftwards = false;
				break;
			case 68: // D
				keyboard.rightwards = false;
				break;
		}
	}
}

export default Input;
