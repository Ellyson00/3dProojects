import * as THREE from "three";
import * as _ from "underscore";
import {IGeometryBufferCount, IGeometryByMaterial, IGeometryData, IGeometryRanges, IRange, ITypedGeometryData} from "./interfaces/IGeometries";
import {mergeArrays, mergeIndexes, mergeTypedArrays, spliceTypedArray} from "../../arrays/arrayUtils";
import {increaseFloat32ArraySize, increaseUint32ArraySize, updateIndexes} from "../../arrays/typedArrayUtils";
import {initColorsArray} from "./geometryColorsUtils";

function setGeometryUVRepeat(geometry, textureRepeat_U, textureRepeat_V) {

    geometry.faceVertexUvs[0].forEach((faceUVs) => {
        faceUVs.forEach((vertexUVs) => {
            vertexUVs.x *= textureRepeat_U;
            vertexUVs.y *= textureRepeat_V;
        });
    });

}

function spliceGeometryAttributes(attribute, deleteIndex) {
    attribute.setArray(spliceTypedArray(attribute.array, deleteIndex * 3, 3));
}

function setCubeUVRepeat(geometry, width, height, depth, textureSize) {
    let i;
    for (i = 0; i < 4; i++) {
        geometry.faceVertexUvs[0][i].forEach((vertexUVs) => {
            vertexUVs.x *= depth / textureSize;
            vertexUVs.y *= height / textureSize;
        });
    }

    for (i = 4; i < 8; i++) {
        geometry.faceVertexUvs[0][i].forEach((vertexUVs) => {
            vertexUVs.x *= width / textureSize;
            vertexUVs.y *= depth / textureSize;
        });
    }

    for (i = 8; i <= 11; i++) {
        geometry.faceVertexUvs[0][i].forEach((vertexUVs) => {
            vertexUVs.x *= width / textureSize;
            vertexUVs.y *= height / textureSize;
        });
    }

}

function setFacesIndexes(geometry, materialIndex) {
    geometry.faces.forEach((face) => {
        face.materialIndex = materialIndex;
    });
}

export function deleteGeometry(geometry: THREE.Geometry | THREE.BufferGeometry): void {

    if (isBufferGeometry(geometry)) {

        deleteBufferGeometry(geometry);

    } else {

        deleteNonBufferGeometry(geometry);

    }

}

export function isBufferGeometry(geometry: THREE.Geometry | THREE.BufferGeometry): geometry is THREE.BufferGeometry {
    return (geometry instanceof THREE.BufferGeometry)
}

function deleteNonBufferGeometry(geometry: THREE.Geometry): void {

    delete geometry.vertices;
    delete geometry.colors;
    delete geometry.faces;
    delete geometry.faceVertexUvs;

    geometry.dispose();

}

function deleteBufferGeometry(geometry: THREE.BufferGeometry): void {

    // todo delete this function and use dispose!
   geometry.dispose();

}

// todo math utils
function getScaleFactor(width, height, depth, sizeX, sizeY, sizeZ) {
    return Math.min(
        width / sizeX,
        height / sizeZ,
        depth / sizeY
    );
}

function mergeGeometryAttributes(attribute, attributeToAdd) {
    attribute.setArray(mergeTypedArrays(attribute.array, attributeToAdd.array));
}

function initGeometryData(): IGeometryData {
    return {
        position: [],
        normal: [],
        index: [],
        color: [],
        uv: []
    };
}

function getTypedGeometryRange(baseGeometry: IGeometryBufferCount, mergeGeometry: IGeometryData): IGeometryRanges {

    return {
        position: {count: mergeGeometry.position.length, offset: baseGeometry.position},
        normal: {count: mergeGeometry.normal.length, offset: baseGeometry.normal},
        index: {count: mergeGeometry.index.length, offset: baseGeometry.index},
        color: {count: mergeGeometry.color.length, offset: baseGeometry.color},
        uv: {count: mergeGeometry.uv.length, offset: baseGeometry.uv}
    };

}

// todo divide in smaller func
function mergeGeometryToTypedAndIncrease(typedGeometry: ITypedGeometryData, geometry: IGeometryData, bufferCount: IGeometryBufferCount, increaseSize: number): void {

    if (bufferCount.position + geometry.position.length > typedGeometry.position.length) {

        const newPosition = increaseFloat32ArraySize(typedGeometry.position, increaseSize);

        delete typedGeometry.position;

        typedGeometry.position = newPosition;

    }

    if (bufferCount.normal + geometry.normal.length > typedGeometry.normal.length) {

        const newNormal = increaseFloat32ArraySize(typedGeometry.normal, increaseSize);

        delete typedGeometry.normal;

        typedGeometry.normal = newNormal;

    }

    if (bufferCount.color + geometry.color.length > typedGeometry.color.length) {

        const newColor = increaseFloat32ArraySize(typedGeometry.color, increaseSize);

        delete typedGeometry.color;

        typedGeometry.color = newColor;

    }

    if (bufferCount.uv + geometry.uv.length > typedGeometry.uv.length) {

        const newUv = increaseFloat32ArraySize(typedGeometry.uv, increaseSize);

        delete typedGeometry.uv;

        typedGeometry.uv = newUv;

    }

    if (bufferCount.index + geometry.index.length > typedGeometry.index.length) {

        const newIndex = increaseUint32ArraySize(typedGeometry.index, increaseSize);

        delete typedGeometry.index;

        typedGeometry.index = newIndex;

    }

    updateIndexes(geometry.index as any, bufferCount.position / 3);

    typedGeometry.position.set(geometry.position, bufferCount.position);
    bufferCount.position += geometry.position.length;
    delete geometry.position;

    typedGeometry.normal.set(geometry.normal, bufferCount.normal);
    bufferCount.normal += geometry.normal.length;
    delete geometry.normal;

    typedGeometry.color.set(geometry.color, bufferCount.color);
    bufferCount.color += geometry.color.length;
    delete geometry.color;

    typedGeometry.uv.set(geometry.uv, bufferCount.uv);
    bufferCount.uv += geometry.uv.length;
    delete geometry.uv;

    typedGeometry.index.set(geometry.index, bufferCount.index);
    bufferCount.index += geometry.index.length;
    delete geometry.index;

}

function mergeGeometryDataToTypedArraysAndRange(typedGeometry: ITypedGeometryData, geometry: IGeometryData, bufferSizes: IGeometryBufferCount, increaseSize: number): IGeometryRanges {

    const ranges: IGeometryRanges = getTypedGeometryRange(bufferSizes, geometry);

    mergeGeometryToTypedAndIncrease(typedGeometry, geometry, bufferSizes, increaseSize);

    return ranges;

}

function mergeGeometryDataAndRange(baseGeometry: IGeometryData, mergeGeometry: IGeometryData): { ranges: IGeometryRanges, geometry: IGeometryData } {

    const ranges: IGeometryRanges = mergeGeometryRange(baseGeometry, mergeGeometry);

    const geometry: IGeometryData = mergeGeometryData(baseGeometry, mergeGeometry);

    return {ranges, geometry};

}

function mergeGeometryRange(baseGeometry: IGeometryData, mergeGeometry: IGeometryData): IGeometryRanges {

    return {
        position: {count: mergeGeometry.position.length, offset: baseGeometry.position.length},
        normal: {count: mergeGeometry.normal.length, offset: baseGeometry.normal.length},
        index: {count: mergeGeometry.index.length, offset: baseGeometry.index.length},
        color: {count: mergeGeometry.color.length, offset: baseGeometry.color.length},
        uv: {count: mergeGeometry.uv.length, offset: baseGeometry.uv.length}
    };

}

function mergeGeometryData(baseGeometry: IGeometryData, mergeGeometry: IGeometryData): IGeometryData {

    if (mergeGeometry.normal.length !== mergeGeometry.position.length) {
        console.warn("Geometry have positions but don't have normals!");
    }

    return {
        index: mergeIndexes(baseGeometry.index, mergeGeometry.index, baseGeometry.position.length / 3), // before merge
        position: mergeArrays(baseGeometry.position, mergeGeometry.position),
        normal: mergeArrays(baseGeometry.normal, mergeGeometry.normal),
        color: mergeArrays(baseGeometry.color, mergeGeometry.color),
        uv: mergeArrays(baseGeometry.uv, mergeGeometry.uv)
    };

}

function mergeGeometryByMaterials(baseGeometry: IGeometryByMaterial, mergedGeometry: IGeometryByMaterial): IGeometryByMaterial {

    _.each(baseGeometry, (geometryData: IGeometryData, materialName: string) => {

        if (mergedGeometry[materialName]) {
            baseGeometry[materialName] = mergeGeometryData(geometryData, mergedGeometry[materialName]);
        }

    });

    return baseGeometry;

}

function mergeDataToBufferAndRange(geometry: THREE.BufferGeometry, geometryData: IGeometryData): { ranges: IGeometryRanges, geometry: THREE.BufferGeometry } {

    return {
        ranges: mergeGeometryRange(bufferGeometryToData(geometry), geometryData),
        geometry: mergeDataToBufferGeometry(geometry, geometryData)
    };

}

function bufferGeometryToData(geometry: THREE.BufferGeometry): IGeometryData {

    const {position, color, index, normal, uv} = getGeometryAttributes(geometry);

    return {
        position: position.array as number[],
        color: color.array as number[],
        index: index.array as number[],

        // for picking geometry, it don't have normals and uvs
        normal: normal ? normal.array as number[] : [],
        uv: uv ? uv.array as number[] : []
    };

}

function setSelectedColor(count, offset, attr) {

    const positionArray = attr.array;

    const currentPositions = positionArray.subarray(offset, offset + count);

    const length = currentPositions.length;

    for (let i = 0; i < length; i += attr.itemSize) {

        currentPositions[i] /= 2;
        currentPositions[i + 1] /= 2;
        currentPositions[i + 2] /= 2;

    }

    setUpdateRangeForAttribute(count, offset, attr);

}

function resetSelectedColor(count, offset, attr) {

    const positionArray = attr.array;

    const currentPositions = positionArray.subarray(offset, offset + count);

    const length = currentPositions.length;

    for (let i = 0; i < length; i += attr.itemSize) {

        currentPositions[i] *= 2;
        currentPositions[i + 1] *= 2;
        currentPositions[i + 2] *= 2;

    }

    setUpdateRangeForAttribute(count, offset, attr);

}

function mergeDataToBufferGeometry(geometry: THREE.BufferGeometry, geometryData: IGeometryData): THREE.BufferGeometry {

    const {position, color, index, normal, uv} = getGeometryAttributes(geometry);

    if (index && geometryData.index.length > 0) {

        const offset: number = position ? position.array.length / 3 : 0;

        // don't update init geometry
        const indexes = geometryData.index.map((index: number) => {
            return index + offset;
        });

        mergeDataToBufferArray(index, indexes);
    }

    if (position && geometryData.position.length > 0) {
        mergeDataToBufferArray(position, geometryData.position);
    }

    if (color && geometryData.color.length > 0) {
        mergeDataToBufferArray(color, geometryData.color);
    }

    if (normal && geometryData.normal.length > 0) {
        mergeDataToBufferArray(normal, geometryData.normal);
    }

    if (uv && geometryData.uv.length > 0) {
        mergeDataToBufferArray(uv, geometryData.uv);
    }

    return geometry;

}

function deleteDataFromBufferGeometry(geometry: THREE.BufferGeometry, range: IGeometryRanges): void {

    const {position, color, index, normal, uv} = getGeometryAttributes(geometry);

    if (range.position && position) {
        deleteDataFromBufferArray(position, range.position);
    }

    if (range.normal && normal) {
        deleteDataFromBufferArray(normal, range.normal);
    }

    if (range.color && color) {
        deleteDataFromBufferArray(color, range.color);
    }

    if (range.uv && uv) {
        deleteDataFromBufferArray(uv, range.uv);
    }

    if (range.index && index) {

        const length = index.array.length;
        const positionCount = range.position.count / 3;

        for (let i = range.index.offset; i < length; ++i) {
            (index.array as number[])[i] -= positionCount;
        }

        deleteDataFromBufferArray(geometry.index, range.index);
    }

}

function mergeDataToBufferArray(attribute: any, geometryData: number[]) {

    attribute.setArray(mergeTypedArrays(attribute.array, geometryData));

    attribute.needsUpdate = true;

}

function deleteDataFromBufferArray(attribute: any, range: IRange): void {

    attribute.setArray(spliceTypedArray(attribute.array, range.offset, range.count));

    attribute.needsUpdate = true;

}

function initGeometryRange(): IGeometryRanges {

    return {
        position: {offset: 0, count: 0},
        color: {offset: 0, count: 0},
        normal: {offset: 0, count: 0},
        index: {offset: 0, count: 0},
        uv: {offset: 0, count: 0},
    };

}

function setGeometryColor(geometry, color, materialIndex = 0) {
    geometry.faces.forEach((face) => {
        face.color = color;
        face.materialIndex = materialIndex;
    });
}
function setGeometryRGBColor(color, pathObject) {
    pathObject.mesh.geometry.faces.forEach((face) => {
        face.color.r = color.r;
        face.color.g = color.g;
        face.color.b = color.b;
    });
    pathObject.mesh.geometry.colorsNeedUpdate = true;
}
function setSelectedGeometryColor(geometry) {
    geometry.faces.forEach((face) => {
        face.color.r /= 2;
        face.color.g /= 2;
        face.color.b /= 2;
    });
    geometry.colorsNeedUpdate = true;
}

function resetSelectedGeometryColor(geometry) {
    geometry.faces.forEach((face) => {
        face.color.r *= 2;
        face.color.g *= 2;
        face.color.b *= 2;
    });
    geometry.colorsNeedUpdate = true;
}

function getGeometryAttributes(geometry: THREE.BufferGeometry): {
    position: THREE.BufferAttribute, normal: THREE.BufferAttribute,
    color: THREE.BufferAttribute, uv: THREE.BufferAttribute, index: THREE.BufferAttribute
} {

    const position: THREE.BufferAttribute = (geometry.getAttribute("position") as THREE.BufferAttribute);
    const normal: THREE.BufferAttribute = (geometry.getAttribute("normal") as THREE.BufferAttribute);
    const color: THREE.BufferAttribute = (geometry.getAttribute("color") as THREE.BufferAttribute);
    const uv: THREE.BufferAttribute = (geometry.getAttribute("uv") as THREE.BufferAttribute);
    const index: THREE.BufferAttribute = (geometry.index as THREE.BufferAttribute);

    return {position, normal, color, uv, index};

}

function setUpdateRangeForAttribute(count, offset, attr) {

    // if we need update before, create wide range update in one frame
    if (attr.updateRange.count > 0 || attr.updateRange.offset > 0) {

        const currentUpdateRangeEnd = attr.updateRange.offset + attr.updateRange.count;
        const updateRangeEnd = offset + count;

        attr.updateRange.offset = (attr.updateRange.offset > offset) ? offset : attr.updateRange.offset;
        attr.updateRange.count = (currentUpdateRangeEnd > updateRangeEnd) ?
            currentUpdateRangeEnd - attr.updateRange.offset : updateRangeEnd - attr.updateRange.offset;

    } else {

        attr.updateRange.count = count;
        attr.updateRange.offset = offset;

    }

    attr.needsUpdate = true;

}

function updateVertices(vertices: number[], translationMatrix: THREE.Matrix4): number[] {

    const length: number = vertices.length;
    const vec3 = new THREE.Vector3();

    const updatedVertices: number[] = [];

    for (let i = 0; i < length; i += 3) {

        vec3.set(vertices[i], vertices[i + 1], vertices[i + 2]).applyMatrix4(translationMatrix);

        updatedVertices[i] = vec3.x;
        updatedVertices[i + 1] = vec3.y;
        updatedVertices[i + 2] = vec3.z;

    }

    return updatedVertices;

}

function convertToPickingGeometry(geometry: IGeometryData, r: number, g: number, b: number, ): IGeometryData {

    return {
        position: geometry.position,
        color: initColorsArray(r, g, b, geometry.position.length / 3),
        index: geometry.index,
        normal: [],
        uv: []
    };

}

function changeGeometryDataPositions(geometry: IGeometryData, posX: number, posY: number, posZ: number, scaleX: number, scaleY: number, scaleZ: number,
                                     rotationX: number, rotationY: number, rotationZ: number): IGeometryData {

    return {
        position: changeGeometryPositions(geometry.position, posX, posY, posZ, scaleX, scaleY, scaleZ, rotationX, rotationY, rotationZ),
        color: geometry.color,
        index: geometry.index,
        normal: rotateVertices(geometry.normal, rotationX, rotationY, rotationZ),
        uv: geometry.uv
    };

}

function rotateVertices(vertices: number[], rotationX: number, rotationY: number, rotationZ: number): number[] {

    const mat = getRotationMatrix(rotationX, rotationY, rotationZ);

    return updateVertices(vertices, mat);

}

function changeGeometryPositions(position: number[], posX: number, posY: number, posZ: number, scaleX: number, scaleY: number, scaleZ: number,
                                 rotationX: number, rotationY: number, rotationZ: number): number[] {

    const mat = getMatrix(posX, posY, posZ, scaleX, scaleY, scaleZ, rotationX, rotationY, rotationZ);

    return updateVertices(position, mat);

}

function getRotationMatrix(rotationX: number, rotationY: number, rotationZ: number): THREE.Matrix4 {

    const mat = new THREE.Matrix4();

    mat.makeRotationFromEuler(new THREE.Euler(rotationX, rotationY, rotationZ));

    return mat;

}

function getMatrix(posX: number, posY: number, posZ: number, scaleX: number, scaleY: number, scaleZ: number,
                   rotationX: number, rotationY: number, rotationZ: number): THREE.Matrix4 {

    const mat = getRotationMatrix(rotationX, rotationY, rotationZ);

    mat.scale(new THREE.Vector3(scaleX, scaleY, scaleZ));

    mat.setPosition(new THREE.Vector3(posX, posY, posZ));

    return mat;

}

export {
    getScaleFactor,
    spliceGeometryAttributes,
    spliceTypedArray,
    mergeGeometryAttributes,
    initGeometryData,
    deleteNonBufferGeometry,
    mergeGeometryData,
    initGeometryRange,
    setGeometryColor,
    mergeDataToBufferAndRange,
    setGeometryUVRepeat,
    setFacesIndexes,
    setCubeUVRepeat,
    getGeometryAttributes,
    mergeDataToBufferGeometry,
    deleteDataFromBufferGeometry,
    resetSelectedColor,
    setSelectedColor,
    setUpdateRangeForAttribute,
    updateVertices,
    initColorsArray,
    convertToPickingGeometry,
    changeGeometryPositions,
    getMatrix,
    changeGeometryDataPositions,
    mergeGeometryByMaterials,
    mergeGeometryDataToTypedArraysAndRange,
    rotateVertices,
    deleteBufferGeometry,
    bufferGeometryToData,
    setGeometryRGBColor,
    setSelectedGeometryColor,
    resetSelectedGeometryColor
};
