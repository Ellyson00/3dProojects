import {
	BoxGeometry,
	BufferGeometry,
	DoubleSide,
	Geometry,
	Mesh,
	MeshBasicMaterial,
	PlaneGeometry,
	Vector2,
	VertexColors,
} from '../lib/three.js';

class Hut extends Mesh {
	static setupGeometry() {
		Hut.walls = [];
		const paintFaces = geometry => (
			geometry.faces.forEach((face, i) => {
				if (i % 2 === 0) {
					face.color.setHSL(0.6, 0.75, 0.1 - Math.random() * 0.1);
				} else {
					face.color.copy(geometry.faces[i - 1].color);
				}
			})
		);
		const removeHorizontalFaces = (geometry) => {
			for (let i = 0; i < geometry.faces.length; i += 1) {
				if (geometry.faces[i].normal.y) {
					geometry.faces.splice(i, 1);
					i -= 1;
				}
			}
		};
		{
			const top = new BoxGeometry(3, 0.5, 2, 6, 1, 4);
			paintFaces(top);
			top.translate(0, 3.25, 0);
			Hut.walls.push(top);
		}
		{
			const bottom = new PlaneGeometry(1, 1, 2, 2);
			paintFaces(bottom);
			bottom.rotateX(Math.PI * -0.5);
			bottom.translate(0, 0.001, 0);
			Hut.walls.push(bottom);
		}
		{
			const west = new BoxGeometry(0.5, 3, 1, 1, 6, 2);
			removeHorizontalFaces(west);
			paintFaces(west);
			west.translate(-0.75, 1.5, 0);
			Hut.walls.push(west);
		}
		{
			const east = new BoxGeometry(0.5, 3, 1, 1, 6, 2);
			removeHorizontalFaces(east);
			paintFaces(east);
			east.translate(0.75, 1.5, 0);
			Hut.walls.push(east);
		}
		{
			const north = new BoxGeometry(2, 3, 0.5, 4, 6, 1);
			const northTop = new BoxGeometry(3, 0.5, 0.5, 6, 1, 1);
			northTop.translate(0, 1.75, -0.5);
			north.merge(northTop);
			paintFaces(north);
			north.translate(0, 1.5, -0.75);
			Hut.northWall = north;
		}
		{
			const south = new BoxGeometry(2, 3, 0.5, 4, 6, 1);
			const southTop = new BoxGeometry(3, 0.5, 0.5, 6, 1, 1);
			southTop.translate(0, 1.75, 0.5);
			south.merge(southTop);
			paintFaces(south);
			south.translate(0, 1.5, 0.75);
			Hut.southWall = south;
		}
	}

	static setupMaterial() {
		Hut.material = new MeshBasicMaterial({
			vertexColors: VertexColors,
			side: DoubleSide,
		})
	}

	constructor({
						north = false,
						south = false,
					}) {
		if (!Hut.walls) {
			Hut.setupGeometry();
		}
		if (!Hut.material) {
			Hut.setupMaterial();
		}
		const geometry = new Geometry();
		Hut.walls.forEach(wall => geometry.merge(wall));
		if (north) {
			geometry.merge(Hut.northWall);
		}
		if (south) {
			geometry.merge(Hut.southWall);
		}
		super(
			geometry,
			Hut.material
		);
		this.aux = {
			camera: new Vector2(),
			position: new Vector2(),
		};
		this.animation = 0;
		this.state = Hut.states.raised;
	}

	onAnimationTick({ animation: { delta } }, scene, camera) {
		const { aux, position, state } = this;
		const { states, threshold } = Hut;
		const distance = aux.camera
			.set(camera.position.x, camera.position.z)
			.distanceTo(aux.position.set(position.x, position.z));
		if (
			(state === states.raised || state === states.raising)
			&& distance >= threshold
		) {
			this.state = states.lowering;
		}
		if (
			(state === states.lowered || state === states.lowering)
			&& distance < threshold
		) {
			this.state = states.raising;
		}
		if (state === states.raising || state === states.lowering) {
			if (state === states.raising) {
				this.animation -= delta;
				if (this.animation <= 0) {
					this.animation = 0;
					this.state = states.raised;
				}
			}
			if (state === states.lowering) {
				this.animation += delta;
				if (this.animation >= 1) {
					this.animation = 1;
					this.state = states.lowered;
				}
			}
			const { animation: a } = this;
			const eased = a < 0.5 ? 2 * a * a : -1 + (4 - 2 * a) * a;
			position.y = eased * -3;
			this.updateMatrixWorld();
		}
	}
}

Hut.states = {
	raised: 0,
	raising: 1,
	lowered: 2,
	lowering: 3,
};

Hut.threshold = 7;

export default Hut;
