import {
	BufferGeometry,
	CylinderGeometry,
	Mesh,
	MeshBasicMaterial,
	Object3D,
	VertexColors,
} from 'three';

class Pillars extends Object3D {
	static setupGeometry() {
		const geometry = new CylinderGeometry(0.15, 0.05, 3, 8, 1);
		geometry.faces.forEach((face, i) => {
			if (i % 2 === 0) {
				face.color.setHSL(0, 0, 0.75 - Math.random() * 0.25);
			} else {
				face.color.copy(geometry.faces[i - 1].color);
			}
		});
		Pillars.geometry = (new BufferGeometry()).fromGeometry(geometry);
	}

	static setupMaterial() {
		Pillars.material = new MeshBasicMaterial({
			vertexColors: VertexColors,
		})
	}

	constructor() {
		if (!Pillars.geometry) {
			Pillars.setupGeometry();
		}
		if (!Pillars.material) {
			Pillars.setupMaterial();
		}
		super();
		const distance = 16;
		const slice = Math.PI * 2 / 16;
		let angle = 0;
		for (let i = 0; i < 16; i += 1) {
			const mesh = new Mesh(
				Pillars.geometry,
				Pillars.material
			);
			mesh.position
				.set(
					Math.cos(angle) * distance,
					1.5,
					Math.sin(angle) * distance
				);
			const speed = Math.random() * 2 - 1;
			mesh.onBeforeRender = ({ animation: { delta, time } }) => {
				mesh.rotation.y += delta * speed;
			};
			this.add(mesh);
			angle += slice;
		}
	}
}

export default Pillars;
