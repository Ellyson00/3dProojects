import {mergeTypedArrays, spliceTypedArray} from "./typedArrayUtils";

function mergeIndexes(baseIndexes: number[], mergeIndexes: number[], offset: number): number[] {

    const length = mergeIndexes.length;
    const baseLength = baseIndexes.length;

    for (let i = 0; i < length; i++) {
        // faster than push!
        baseIndexes[baseLength + i] = mergeIndexes[i] + offset;
    }

    return baseIndexes;

}

function mergeArrays(baseArray: number[], mergeArray: number[]): number[] {

    const length = mergeArray.length;
    const baseLength = baseArray.length;

    for (let i = 0; i < length; i++) {
        // faster than push!
        baseArray[baseLength + i] = mergeArray[i];
    }

    return baseArray;

}

function initFloatArray(size: number): ArrayLike<number> {

    let floatArray;

    try {

        floatArray = new Float32Array(size);

    }

    catch (e) {

        // also try catch could be added here
        floatArray = new Float64Array(size);

    }

    return floatArray;

}

function setArrayValuesXYZ(x: number, y: number, z: number, array: number[]): number[] {

    const length: number = array.length;

    for (let i = 0; i < length; i++) {
        array[i] = x;
        array[++i] = y;
        array[++i] = z;
    }

    return array;

}

function uniqueValue(map, item, idSupplier) {
    const id = idSupplier(item);
    map[id] = item;
    return map;
}

function arrayValue(map, item, idSupplier) {
    const id = idSupplier(item);
    let arrayItems = map[id];
    if (!arrayItems) {
        arrayItems = [];
        map[id] = arrayItems;
    }
    arrayItems.push(item);
    return map;
}

function arrayToMap(array, idSupplier) {
    return array.reduce((memo, item) => {
        return arrayValue(memo, item, idSupplier);
    }, {});
}

function arrayToUniqueMapValue(array, idSupplier) {
    return array.reduce((memo, item) => {
        return uniqueValue(memo, item, idSupplier);
    }, {});
}

export {
    initFloatArray,
    mergeIndexes,
    mergeArrays,
    mergeTypedArrays,
    spliceTypedArray,
    arrayToMap,
    arrayToUniqueMapValue,
    setArrayValuesXYZ
};
