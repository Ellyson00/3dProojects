import {setArrayValuesXYZ} from "../../arrays/arrayUtils";
import {setUpdateRangeForAttribute} from "./geometryUtils";
import {IGeometryData} from "./interfaces/IGeometries";

function initColorsArray(r: number, g: number, b: number, bufferSize: number): number[] {

    const colors: number[] = [];

    colors.length = bufferSize;

    return setArrayValuesXYZ(r, g, b, colors);
}

function initTypedArrayColors(r: number, g: number, b: number, bufferSize: number): Float32Array {

    const colors: number[] = new Float32Array(bufferSize) as any;

    return setArrayValuesXYZ(r, g, b, colors) as any;

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

// todo delete
function setGeometryColor(geometry, color, materialIndex = 0) {
    geometry.faces.forEach(face => {
        face.color = color;
        face.materialIndex = materialIndex;
    });
}

function setGeometryDataColor(r: number, g: number, b: number, data: IGeometryData): IGeometryData {

    const length: number = data.color.length;

    for (let i = 0; i < length; i++) {
        data.color[i] = r;
        data.color[++i] = g;
        data.color[++i] = b;
    }

    return data;

}

function setColor(array: Float32Array, r: number, g: number, b: number) : Float32Array {

    const length: number = array.length;

    for (var i: number = 0; i < length; ++i) {

        array[i] = r;
        array[++i] = g;
        array[++i] = b;

    }

    return array;

}
function generateProductColor(product) {
    product.r = Math.sin(product.productId)/2+0.5;
    product.g = 1-product.r;
    product.b = Math.cos(product.productId)/2+0.5;
}

export {
    setGeometryColor,
    resetSelectedColor,
    setSelectedColor,
    initColorsArray,
    initTypedArrayColors,
    setGeometryDataColor,
    generateProductColor
}
