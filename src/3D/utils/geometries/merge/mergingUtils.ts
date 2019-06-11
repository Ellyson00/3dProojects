import * as THREE from "three";
import {mergeTypedArrays, spliceTypedArray} from "../../arrays/arrayUtils";

// TODO DEPRECATED, delete after deleting MergedGeometry
function getGeometryQty(obj, mergedGeometry) {

    if (mergedGeometry.data.position) {
        mergedGeometry.range["position"] = {offset: obj.position, count: mergedGeometry.data.position.length};
        obj.position += mergedGeometry.data.position.length;
    }

    if (mergedGeometry.data.index) {
        mergedGeometry.range["index"] = {offset: obj.index, count: mergedGeometry.data.index.length};
        obj.index += mergedGeometry.data.index.length;
    }

    if (mergedGeometry.data.color) {
        mergedGeometry.range["color"] = {offset: obj.color, count: mergedGeometry.data.color.length};
        obj.color += mergedGeometry.data.color.length;
    }

    if (mergedGeometry.data.normal) {
        mergedGeometry.range["normal"] = {offset: obj.normal, count: mergedGeometry.data.normal.length};
        obj.normal += mergedGeometry.data.normal.length;
    }

    if (mergedGeometry.data.uv) {
        mergedGeometry.range["uv"] = {offset: obj.uv, count: mergedGeometry.data.uv.length};
        obj.uv += mergedGeometry.data.uv.length;
    }

    if (mergedGeometry.data.position && mergedGeometry.data.index) {
        obj.geometries.push(mergedGeometry);
    }

}

/**
 * Create Three buffer geometry from obj with data arrays
 * @param geometryData
 * @returns {THREE.BufferGeometry}
 */
function initBufferGeometryFromData(geometryData) {
    const BUFFER_GEOMETRY = new THREE.BufferGeometry();

    const POSITIONS = initFloatArray(geometryData.position);
    const INDEXES = new Uint32Array(geometryData.index);
    const COLORS = initFloatArray(geometryData.color);

    const NORMALS = geometryData.normal ? initFloatArray(geometryData.normal) : null;
    const UVS = geometryData.uv ? initFloatArray(geometryData.uv) : null;

    let lastP = 0;
    let lastI = 0;
    let lastN = 0;
    let lastC = 0;
    let lastUVs = 0;

    for (let i = 0, geometriesDataLength = geometryData.geometries.length; i < geometriesDataLength; i++) {

        const MERGED_GEOMETRY = geometryData.geometries[i];

        // offset index!
        if (i > 0) {
            const indexOffset = lastP / 3;

            for (let j = 0, indexLength = MERGED_GEOMETRY.range.index.count; j < indexLength; ++j) {
                MERGED_GEOMETRY.data.index[j] += indexOffset;
                MERGED_GEOMETRY.data.index[++j] += indexOffset;
                MERGED_GEOMETRY.data.index[++j] += indexOffset;
            }

        }

        if (MERGED_GEOMETRY.data.index) {
            INDEXES.set(MERGED_GEOMETRY.data.index, lastI);
            lastI += MERGED_GEOMETRY.range.index.count;
            delete MERGED_GEOMETRY.data.index;
        }

        if (MERGED_GEOMETRY.data.position) {
            POSITIONS.set(MERGED_GEOMETRY.data.position, lastP);
            lastP += MERGED_GEOMETRY.range.position.count;
            delete MERGED_GEOMETRY.data.position;
        }

        if (MERGED_GEOMETRY.data.color) {
            COLORS.set(MERGED_GEOMETRY.data.color, lastC);
            lastC += MERGED_GEOMETRY.range.color.count;
            delete MERGED_GEOMETRY.data.color;
        }

        if (MERGED_GEOMETRY.data.normal && NORMALS) {
            NORMALS.set(MERGED_GEOMETRY.data.normal, lastN);
            lastN += MERGED_GEOMETRY.range.normal.count;
            delete  MERGED_GEOMETRY.data.normal;
        }

        if (MERGED_GEOMETRY.data.uv && UVS) {
            UVS.set(MERGED_GEOMETRY.data.uv, lastUVs);
            lastUVs += MERGED_GEOMETRY.range.uv.count;
            delete MERGED_GEOMETRY.data.uv;
        }

    }

    BUFFER_GEOMETRY.addAttribute('position', new THREE.BufferAttribute(POSITIONS, 3));

    BUFFER_GEOMETRY.setIndex(new THREE.BufferAttribute(INDEXES, 1));

    BUFFER_GEOMETRY.addAttribute('color', new THREE.BufferAttribute(COLORS, 3));

    if (geometryData.normal && NORMALS) {
        BUFFER_GEOMETRY.addAttribute('normal', new THREE.BufferAttribute(NORMALS, 3));
    }

    if (geometryData.uv && UVS) {
        BUFFER_GEOMETRY.addAttribute('uv', new THREE.BufferAttribute(UVS, 2));
    }

    return BUFFER_GEOMETRY;
}

function createNewBufferAttributes(BUFFER_GEOMETRY, geometry) {

    if (geometry.data.position) {
        BUFFER_GEOMETRY.addAttribute('position', new THREE.BufferAttribute(new Float32Array(geometry.data.position), 3));
        geometry.range['position'] = {offset: 0, count: geometry.data.position.length};
    }

    if (geometry.data.index) {
        BUFFER_GEOMETRY.setIndex(new THREE.BufferAttribute(new Uint32Array(geometry.data.index), 1));
        geometry.range['index'] = {offset: 0, count: geometry.data.index.length};
    }

    if (geometry.data.normal) {
        BUFFER_GEOMETRY.addAttribute('normal', new THREE.BufferAttribute(new Float32Array(geometry.data.normal), 3));
        geometry.range['normal'] = {offset: 0, count: geometry.data.normal.length};
    }

    if (geometry.data.color) {
        BUFFER_GEOMETRY.addAttribute('color', new THREE.BufferAttribute(new Float32Array(geometry.data.color), 3));
        geometry.range['color'] = {offset: 0, count: geometry.data.color.length};
    }

    if (geometry.data.uv) {
        BUFFER_GEOMETRY.addAttribute('uv', new THREE.BufferAttribute(new Float32Array(geometry.data.uv), 2));
        geometry.range['uv'] = {offset: 0, count: geometry.data.uv.length};
    }

    return BUFFER_GEOMETRY;

}

function mergeDataToBufferGeometry(BUFFER_GEOMETRY, geometry) {

    let indexOffset;

    const positionAttr = BUFFER_GEOMETRY.getAttribute('position');
    const normalAttr = BUFFER_GEOMETRY.getAttribute('normal');
    const colorAttr = BUFFER_GEOMETRY.getAttribute('color');
    const uvAttr = BUFFER_GEOMETRY.getAttribute('uv');

    if (geometry.data.position && positionAttr) {
        indexOffset = positionAttr.array.length / 3;
        mergeDataToBufferArray(positionAttr, 'position', geometry);
    }

    if (geometry.data.normal && normalAttr) {
        mergeDataToBufferArray(normalAttr, 'normal', geometry);
    }

    if (geometry.data.color && colorAttr) {
        mergeDataToBufferArray(colorAttr, 'color', geometry);
    }

    if (geometry.data.uv && uvAttr) {
        mergeDataToBufferArray(uvAttr, 'uv', geometry);
    }

    if (geometry.data.index && BUFFER_GEOMETRY.index) {

        for (let j = 0; j < geometry.data['index'].length; ++j) {
            geometry.data['index'][j] += indexOffset;
        }

        mergeDataToBufferArray(BUFFER_GEOMETRY.index, 'index', geometry);
    }

    updateGeometryAttributes(BUFFER_GEOMETRY);

    return geometry.range;
}

function deleteDataFromBufferGeometry(BUFFER_GEOMETRY, range) {

    if (range.position) {
        deleteDataFromBufferArray(BUFFER_GEOMETRY.getAttribute('position'), 'position', range);
    }

    if (range.normal) {
        deleteDataFromBufferArray(BUFFER_GEOMETRY.getAttribute('normal'), 'normal', range);
    }

    if (range.color) {
        deleteDataFromBufferArray(BUFFER_GEOMETRY.getAttribute('color'), 'color', range);
    }

    if (range.uv) {
        deleteDataFromBufferArray(BUFFER_GEOMETRY.getAttribute('uv'), 'uv', range);
    }

    if (range.index) {

        const attr = BUFFER_GEOMETRY.index;

        for (let j = range['index'].offset; j < attr.array.length; ++j) {
            attr.array[j] -= range['position'].count / 3;
        }

        deleteDataFromBufferArray(BUFFER_GEOMETRY.index, 'index', range);
    }

    updateGeometryAttributes(BUFFER_GEOMETRY);
}

function mergeDataToBufferArray(buffer_attribute, attrName, geometry) {
    geometry.range[attrName] = {offset: buffer_attribute.array.length, count: geometry.data[attrName].length};
    buffer_attribute.setArray(mergeTypedArrays(buffer_attribute.array, geometry.data[attrName]));
}

function deleteDataFromBufferArray(buffer_attribute, attrName, range) {
    buffer_attribute.setArray(spliceTypedArray(buffer_attribute.array, range[attrName].offset, range[attrName].count));
}

function updateGeometryAttributes(BUFFER_GEOMETRY) {

    BUFFER_GEOMETRY.attributes["position"].needsUpdate = true;
    BUFFER_GEOMETRY.attributes["color"].needsUpdate = true;
    BUFFER_GEOMETRY.index.needsUpdate = true;

    if (BUFFER_GEOMETRY.attributes["normal"]) {
        BUFFER_GEOMETRY.attributes["normal"].needsUpdate = true;
    }

    if (BUFFER_GEOMETRY.attributes["uv"]) {
        BUFFER_GEOMETRY.attributes["uv"].needsUpdate = true;
    }

}

function decreaseRangesByDeletedRange(ranges, deletedRange) {
    const positionAttr = "position";
    for (const objectId in ranges) {
        const currentRange = ranges[objectId];
        if (currentRange[positionAttr].offset >= deletedRange[positionAttr].offset + deletedRange[positionAttr].count) {
            for (const attrName in currentRange) {
                currentRange[attrName].offset -= deletedRange[attrName].count;
            }
        }
    }
}

function initFloatArray(size) {

    let floatArray;

    try {

        floatArray = new Float32Array(size);

    } catch (e) {

        // also try catch could be added here
        floatArray = new Float64Array(size);

    }

    return floatArray;

}

function initGeometryDataObj() {

    return {
        position: 0,
        color: 0,
        normal: 0,
        uv: 0,
        index: 0,
        geometries: []
    };

}

function initGeometryDataObjectWithMaterial(material = {}) {

    // saving material for mesh
    return Object.assign(this.initGeometryDataObj(), {material});

}

function initPickingGeometryDataObj() {

    return {
        position: 0,
        index: 0,
        color: 0,
        geometries: []
    };

}

function setOffset(offsetX, offsetY, offsetZ, count, offset, geometry) {

    const translationMatrix = new THREE.Matrix4();

    translationMatrix.setPosition(new THREE.Vector3(offsetX, offsetY, offsetZ));

    const positionAttr = geometry.getAttribute("position");
    const positionArray = positionAttr.array;

    const currentPositions = positionArray.subarray(offset, offset + count);

    updateVertices(currentPositions, translationMatrix, positionAttr.itemSize);

    setUpdateRangeForAttribute(count, offset, positionAttr);

}

function updateVertices(vertices, translationMatrix, attrItemSize) {
    for (let i = 0; i < vertices.length; i += attrItemSize) {

        const [x, y, z] = [vertices[i], vertices[i + 1], vertices[i + 2]];

        const vec3 = new THREE.Vector3(x, y, z);
        vec3.applyMatrix4(translationMatrix);

        vertices[i] = vec3.x;
        vertices[i + 1] = vec3.y;
        vertices[i + 2] = vec3.z;

    }
}

function setDataForAttr(x, y, z, count, offset, attr) {

    const positionArray = attr.array;

    const currentPositions = positionArray.subarray(offset, offset + count);

    for (let i = 0; i < currentPositions.length; i += attr.itemSize) {

        currentPositions[i] = x;
        currentPositions[i + 1] = y;
        currentPositions[i + 2] = z;

    }

    setUpdateRangeForAttribute(count, offset, attr);

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

function setColor(count, offset, attr, color) {
    const positionArray = attr.array;

    const currentPositions = positionArray.subarray(offset, offset + count);

    for (let i = 0; i < currentPositions.length; i += attr.itemSize) {

        currentPositions[i] = color.r;
        currentPositions[i + 1] = color.g;
        currentPositions[i + 2] = color.b;

    }

    setUpdateRangeForAttribute(count, offset, attr);
}

function setScale(scaleX, scaleY, scaleZ, posX, posY, posZ, count, offset, geometry) {

    const posXcorrection = posX - (posX * scaleX);
    const posYcorrection = posY - (posY * scaleY);
    const posZcorrection = posZ - (posZ * scaleZ);

    const positionAttr = geometry.getAttribute("position");
    const positionArray = positionAttr.array;

    const currentPositions = positionArray.subarray(offset, offset + count);

    for (let i = 0; i < currentPositions.length; i += positionAttr.itemSize) {

        // scaling
        currentPositions[i] *= scaleX;
        currentPositions[i + 1] *= scaleY;
        currentPositions[i + 2] *= scaleZ;

        // correcting pos
        currentPositions[i] += posXcorrection;
        currentPositions[i + 1] += posYcorrection;
        currentPositions[i + 2] += posZcorrection;

    }

    setUpdateRangeForAttribute(count, offset, positionAttr);

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

// todo
export {
    initBufferGeometryFromData,
    initFloatArray,
    initGeometryDataObj,
    initPickingGeometryDataObj,
    initGeometryDataObjectWithMaterial,
    createNewBufferAttributes,
    setOffset,
    setUpdateRangeForAttribute,
    setDataForAttr,
    setSelectedColor,
    setScale,
    getGeometryQty,
    mergeDataToBufferGeometry,
    deleteDataFromBufferGeometry,
    decreaseRangesByDeletedRange,
    setColor,
    updateVertices,
    resetSelectedColor,
};
