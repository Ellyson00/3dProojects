/**
 * Created by Ellyson on 8/25/2019.
 */
import {
	BackSide,
	Color,
	Mesh,
	SphereBufferGeometry,
	RawShaderMaterial,
} from 'three';

class Dome extends Mesh {
	static setupGeometry() {
		Dome.geometry = new SphereBufferGeometry(512, 32, 32);
	}

	static setupMaterial() {
		Dome.material = new RawShaderMaterial({
			uniforms: {
				color: { value: new Color() },
			},
			vertexShader: [
				'precision highp float;',
				'precision highp int;',
				'uniform mat4 modelViewMatrix;',
				'uniform mat4 projectionMatrix;',
				'attribute vec3 position;',
				'varying float altitude;',
				'void main() {',
				'  altitude = clamp(normalize(position).y, 0.0, 1.0);',
				'  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
				'}',
			].join('\n'),
			fragmentShader: [
				'precision highp float;',
				'precision highp int;',
				'varying float altitude;',
				'uniform vec3 color;',
				'void main() {',
				'  gl_FragColor = vec4(mix(color, color * 0.75, altitude), 1.0);',
				'}',
			].join('\n'),
			depthWrite: false,
			side: BackSide,
		});
	}

	constructor({ color }) {
		if (!Dome.geometry) {
			Dome.setupGeometry();
		}
		if (!Dome.material) {
			Dome.setupMaterial();
		}
		super(
			Dome.geometry,
			Dome.material
		);
		this.color = color;
	}

	onBeforeRender() {
		const { material, color } = this;
		material.uniforms.color.value.copy(color);
	}
}

export default Dome;
