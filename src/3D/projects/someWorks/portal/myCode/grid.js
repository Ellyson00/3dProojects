import {
	Color,
	Mesh,
	RawShaderMaterial,
	PlaneBufferGeometry,
} from 'three';

class Grid extends Mesh {
	static setupGeometry() {
		const { size } = Grid;
		const geometry = new PlaneBufferGeometry(size, size, 1, 1);
		delete geometry.attributes.normal;
		delete geometry.attributes.uv;
		geometry.rotateX(Math.PI * -0.5);
		Grid.Geometry = geometry;
	}

	static setupMaterial() {
		Grid.Material = new RawShaderMaterial({
			extensions: {
				derivatives: true,
			},
			uniforms: {
				color: { value: new Color() },
				fogColor: { value: new Color() },
				fogDensity: { value: 0 },
			},
			vertexShader: [
				'precision highp float;',
				'precision highp int;',
				'uniform mat4 modelViewMatrix;',
				'uniform mat4 projectionMatrix;',
				'attribute vec3 position;',
				'varying vec4 vViewPosition;',
				'varying vec2 vWorldPosition;',
				'void main() {',
				'  vViewPosition = modelViewMatrix * vec4(position, 1.0);',
				'  vWorldPosition = position.xz;',
				'  gl_Position = projectionMatrix * vViewPosition;',
				'}',
			].join('\n'),
			fragmentShader: [
				'precision highp float;',
				'precision highp int;',
				'varying vec4 vViewPosition;',
				'varying vec2 vWorldPosition;',
				'uniform vec3 color;',
				'uniform vec3 fogColor;',
				'uniform float fogDensity;',
				'vec3 Fog(const vec3 color, const vec4 position) {',
				'  float dist = length(position);',
				'  float fogFactor = 1.0 / exp((dist * fogDensity) * (dist * fogDensity));',
				'  return mix(fogColor, color, clamp(fogFactor, 0.0, 1.0));',
				'}',
				'void main() {',
				'  vec2 coord = vWorldPosition * 2.0;',
				'  vec2 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord * 3.0);',
				'  float factor = 1.0 - min(min(grid.x, grid.y), 1.0);',
				'  gl_FragColor = vec4(Fog(color * factor, vViewPosition), 1.0);',
				'}',
			].join('\n'),
		});
	}

	constructor({ color }) {
		if (!Grid.Geometry) {
			Grid.setupGeometry();
		}
		if (!Grid.Material) {
			Grid.setupMaterial();
		}
		super(
			Grid.Geometry,
			Grid.Material
		);
		this.color = color;
	}

	onBeforeRender(renderer, { fog }) {
		const { material, color } = this;
		material.uniforms.color.value.copy(color);
		material.uniforms.fogColor.value.copy(fog.color);
		material.uniforms.fogDensity.value = fog.density;
	}
}

Grid.size = 256;

export default Grid;
