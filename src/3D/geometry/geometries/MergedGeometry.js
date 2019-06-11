import * as mergingUtils from "../../utils/geometries/merge/mergingUtils"
import {mergeTypedArrays, spliceTypedArray, setArrayValuesXYZ} from "../../utils/arrays/arrayUtils"

// TODO WILL BE DELETE
class MergedGeometry {

	constructor(geometry, material) {

		this.mesh = null;
		this.material = material ? material : null;

		this.range = {};

		this._cachedPositions = null;
		this._cachedColors = null;

		this.data = geometry ? MergedGeometry._extractData(geometry) : {};

	}

	setRange(attr = "", offset = 0, count = 0) {

		this.range[attr] = {
			offset, count
		};

	}

	setOffset(x, y, z) {
		if(!this.mesh){
			return
		}
		const {count, offset} = this._getAttrData("position");
		const geometry = this.mesh.geometry;

		mergingUtils.setOffset(x, y, z, count, offset, geometry);

	}

	scale(x, y, z, posX, posY, posZ) {

		const {count, offset} = this._getAttrData("position");
		const geometry = this.mesh.geometry;

		mergingUtils.setScale(x, y, z, posX, posY, posZ, count, offset, geometry);

	}

	show() {

		if (!this._cachedPositions) {
			return;
		}

		const {attr, array: positions, count, offset} = this._getAttrData("position");

		positions.set(this._cachedPositions, offset);

		// clear
		this._cachedPositions = undefined;

		mergingUtils.setUpdateRangeForAttribute(count, offset, attr);

	}

	hide() {

		const {attr, array: positions, count, offset} = this._getAttrData("position");

		this._cachedPositions = positions.slice(offset, offset + count);

		setArrayValuesXYZ(0, 0, 0, positions.subarray(offset, offset + count));

		mergingUtils.setUpdateRangeForAttribute(count, offset, attr);

	}

	onSelect() {

		const {attr, array: colors, count, offset} = this._getAttrData("color");
		this._cachedColors = colors.slice(offset, offset + count);

		mergingUtils.setSelectedColor(count, offset, attr);

	}

	onDeselect() {

		if (!this._cachedColors) {
			return;
		}

		const {attr, array: colors, count, offset} = this._getAttrData("color");

		colors.set(this._cachedColors, offset);

		// clear
		this._cachedColors = undefined;

		mergingUtils.setUpdateRangeForAttribute(count, offset, attr);

	}

	createPick(color) {

		const pickGeometry = new MergedGeometry();

		if (!this.data.position || !this.data.index) {
			return pickGeometry;
		}

		pickGeometry.data.position = this.data.position;
		pickGeometry.data.index = this.data.index.slice();

		if (color) {

			pickGeometry.data.color = [];

			for (let i = 0, count = this.data.color.length; i < count; i += 3) {
				pickGeometry.data.color.push(color.r, color.g, color.b);
			}

		}

		return pickGeometry;

	}

	_getAttrData(attrName = "") {

		const attr = this.mesh.geometry.getAttribute(attrName);
		const array = attr.array;

		const offset = this.range[attrName].offset;
		const count = this.range[attrName].count;

		return {attr, array, count, offset};

	}

	addNoShadowsPicking(data){
		for(let j = 0;j<data["index"].length;++j){
			data["index"][j] += this.data["position"].length/3;
		}
		this.data["position"] = mergeTypedArrays(this.data["position"],data["position"]);
		this.data["color"] = this.data["color"].concat(data["color"]);
		this.data["index"] = this.data["index"].concat(data["index"]);
	}


	initRangeFromData() {
		for(var attrName in this.data){
			this.setRange(attrName,0,this.data[attrName].length)
		}
	}

	delete(){

		for(var attrName in this.mesh.geometry.attributes){

				const attr = this.mesh.geometry.getAttribute(attrName);


			this.deleteAttributeData(attr,attrName);
		}

		const attr = this.mesh.geometry.index;
		attrName = "index";

		this.deleteAttributeData(attr,attrName);


		for(let j = this.range[attrName].offset;j<attr.array.length;++j){
			attr.array[j] -= this.range["position"].count/3;
		}

		this.updateAllAttributes();

	}

	deleteAttributeData(attr,attrName = ""){

		if(!this.range[attrName]){
			console.log("Geometry doesn't have range for attribute  "+attrName);
			return;
		}

		const array = attr.array;
		const offset = this.range[attrName].offset;
		const count = this.range[attrName].count;

		let newArr = spliceTypedArray(array, offset, count);
		attr.setArray(newArr);
	}

	addAttributeData(attr,attrName = ""){

		if(!this.data[attrName]){
			console.log("Geometry doesn't have data for attribute  "+attrName);
			return;
		}

		this.setRange(attrName, attr.array.length, this.data[attrName].length);

		let newArr = mergeTypedArrays(attr.array, this.data[attrName]);
		attr.setArray(newArr);

	}

	addToBufferGeometry(){
		let indexOffset;
		for(var attrName in this.mesh.geometry.attributes){

			const attr = this.mesh.geometry.getAttribute(attrName);

			if(attrName == "position"){
				indexOffset = attr.array.length/3;
			}

			this.addAttributeData(attr,attrName);

		}

		const attr = this.mesh.geometry.index;
		attrName = "index";

		for(let j = 0;j<this.data[attrName].length;++j){
			this.data[attrName][j] += indexOffset;
		}

		this.addAttributeData(attr,attrName);

		this.updateAllAttributes();

	}

	updateAllAttributes(){
		this.mesh.geometry.attributes["position"].needsUpdate = true;
		this.mesh.geometry.index.needsUpdate = true;

		if (this.mesh.geometry.attributes["color"]) {
			this.mesh.geometry.attributes["color"].needsUpdate = true;
		}

		if (this.mesh.geometry.attributes["normal"]) {
			this.mesh.geometry.attributes["normal"].needsUpdate = true;
		}

		if (this.mesh.geometry.attributes["uv"]) {
			this.mesh.geometry.attributes["uv"].needsUpdate = true;
		}

	}


	static _isVerticesHasSamePos(v1, v2) {
		return v1.x === v2.x && v1.y === v2.y && v1.z === v2.z;
	}

	static _findSameVertexPosIndex(faceIndex = 0, faceWithSameNormal = {}, vertices = []) {

		if (this._isVerticesHasSamePos(vertices[faceWithSameNormal.a], vertices[faceIndex])) {
			return faceWithSameNormal.a;
		}

		if (this._isVerticesHasSamePos(vertices[faceWithSameNormal.b], vertices[faceIndex])) {
			return faceWithSameNormal.b;
		}

		if (this._isVerticesHasSamePos(vertices[faceWithSameNormal.c], vertices[faceIndex])) {
			return faceWithSameNormal.c;
		}

	}

	static _setFaceVertexIndex(face = {}, faceIndexName = "", vertices = []) {

		const VERTEX_INDEX = face[faceIndexName];
		const FACES_WITH_SAME_VERTEX = vertices[VERTEX_INDEX].faces;

		if (!FACES_WITH_SAME_VERTEX) {
			// save ref for faces with same vertex
			// for further search for different normals
			vertices[VERTEX_INDEX].faces = [face];
			return;
		}

		const FACE_WITH_SAME_NORMAL = FACES_WITH_SAME_VERTEX.find((f) =>
				face.normal.x === f.normal.x &&
				face.normal.y === f.normal.y &&
				face.normal.z === f.normal.z
		);

		if (FACE_WITH_SAME_NORMAL) {

			face[faceIndexName] = this._findSameVertexPosIndex(VERTEX_INDEX, FACE_WITH_SAME_NORMAL, vertices);

		} else {

			face[faceIndexName] = (vertices.push({
						x: vertices[VERTEX_INDEX].x,
						y: vertices[VERTEX_INDEX].y,
						z: vertices[VERTEX_INDEX].z
					})) - 1;

		}

		vertices[VERTEX_INDEX].faces.push(face);

	}

	static _addVertexIfFaceNormalsAreDiff(vertices = [], faces = []) {

		const FACES_LENGTH = faces.length;

		for (var i = 0; i < FACES_LENGTH; i++) {

			const FACE = faces[i];

			this._setFaceVertexIndex(FACE, "a", vertices);

			this._setFaceVertexIndex(FACE, "b", vertices);

			this._setFaceVertexIndex(FACE, "c", vertices);

		}

	}

	static _extractData(geometry) {
		return geometry.isBufferGeometry
				? MergedGeometry._extractBufferGeometryData(geometry)
				: MergedGeometry._extractGeometryData(geometry);
	}

	static _extractBufferGeometryData(bufferGeometry) {
		var attributes = bufferGeometry.attributes;
		return {
			position: attributes.position ? attributes.position.array : [],
			index: attributes.index ? attributes.index.array : [],
			color: attributes.color ? attributes.color.array : [],
			normal: attributes.normal ? attributes.normal.array : null,
			uv: attributes.uv ? attributes.uv.array : null
		};

	}

	static _extractGeometryData(geometry) {

		const FACES = geometry.faces;
		const FACES_UVS = geometry.faceVertexUvs[0];
		const VERTICES = geometry.vertices;
		const FACES_LENGTH = FACES.length;

		this._addVertexIfFaceNormalsAreDiff(VERTICES, FACES);

		const VERTICES_LENGTH = VERTICES.length;
		const POSITIONS = new Float32Array(VERTICES_LENGTH * 3);
		const NORMALS = new Float32Array(VERTICES_LENGTH * 3);
		const COLORS = new Float32Array(VERTICES_LENGTH * 3);
		const UVS = new Float32Array(VERTICES_LENGTH * 2);
		const INDEXES = [];

		for (var i = 0; i < FACES_LENGTH; i++) {

			var face = FACES[i];
			var faceUvs = FACES_UVS[i];

			INDEXES.push(face.a, face.b, face.c);

			if (!VERTICES[face["a"]].used) {
				this.extractVertexData(face, faceUvs, UVS, NORMALS, COLORS, VERTICES, 0, "a");
			}

			if (!VERTICES[face["b"]].used) {
				this.extractVertexData(face, faceUvs, UVS, NORMALS, COLORS, VERTICES, 1, "b");
			}

			if (!VERTICES[face["c"]].used) {
				this.extractVertexData(face, faceUvs, UVS, NORMALS, COLORS, VERTICES, 2, "c");
			}

			delete FACES[i];

		}

		var posIndex = -1;

		for (i = 0; i < VERTICES_LENGTH; i++) {

			const VERTEX = VERTICES[i];

			POSITIONS[++posIndex] = VERTEX.x;
			POSITIONS[++posIndex] = VERTEX.y;
			POSITIONS[++posIndex] = VERTEX.z;

		}

		delete geometry.faces;
		delete geometry.vertices;
		delete geometry.faceVertexUvs[0];

		return {position: POSITIONS, index: INDEXES, color: COLORS, normal: NORMALS, uv: UVS};

	}

	static extractVertexData(face, faceUvs, uvs, normals, colors, vertices, faceVertex, faceIndexName) {

			const vertexIndex = face[faceIndexName];

			const vertexIndex3 = vertexIndex * 3;
			const vertexIndex2 = vertexIndex * 2;

			if (faceUvs !== undefined) {

				uvs[vertexIndex2] = faceUvs[faceVertex].x;
				uvs[vertexIndex2 + 1] = faceUvs[faceVertex].y;

			}

			if (face.vertexNormals.length === 3) {

				normals[vertexIndex3] = face.vertexNormals[faceVertex].x;
				normals[vertexIndex3 + 1] = face.vertexNormals[faceVertex].y;
				normals[vertexIndex3 + 2] = face.vertexNormals[faceVertex].z;

			} else {

				normals[vertexIndex3] = face.normal.x;
				normals[vertexIndex3 + 1] = face.normal.y;
				normals[vertexIndex3 + 2] = face.normal.z;

			}

			// color per face
			colors[vertexIndex3] = face.color.r;
			colors[(vertexIndex3) + 1] = face.color.g;
			colors[(vertexIndex3) + 2] = face.color.b;

			vertices[vertexIndex].used = true;

	}

	static RED_COLOR = {r: 1, g: 0, b: 0};

}

export default MergedGeometry
