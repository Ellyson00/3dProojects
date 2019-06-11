function updateIndexes(indexes: Uint32Array, offset: number) : Uint32Array {

    const length: number = indexes.length;

    for (var i = 0; i < length; i++) {
        // faster than push!
        indexes[i] += offset;
    }

    return indexes;

}

function mergeTypedArrayIndexes(baseIndexes: Uint32Array, mergeIndexes: Uint32Array, offset: number) : Uint32Array {

    return mergeUintArray(baseIndexes, updateIndexes(mergeIndexes, offset));

}

function toFloat32(array: number[]) : Float32Array {

    const float32: Float32Array = new Float32Array(array.length);

    float32.set(array);

    return float32;

}

function mergeUintArray(arrA:Uint32Array, arrB: Uint32Array) : Uint32Array {

    const result: any = new Uint32Array(arrA.length + arrB.length);

    result.set(arrA);
    result.set(arrB, arrA.length);

    return result;

}

function mergeFloatArray(arrA: Float32Array, arrB: Float32Array) : Float32Array {

    const result: any = new Float32Array(arrA.length + arrB.length);

    result.set(arrA);
    result.set(arrB, arrA.length);

    return result;

}

function mergeTypedArrays(arrA, arrB) {

    const result = new arrA.constructor(arrA.length + arrB.length);

    result.set(arrA);
    result.set(arrB, arrA.length);

    return result;
}

function spliceTypedArray(arr, starting, deleteCount) {

    if (arguments.length === 1) {
        return arr;
    }
    starting = Math.max(starting, 0);
    deleteCount = Math.max(deleteCount, 0);
    const newSize = arr.length - deleteCount;
    const splicedArray = new arr.constructor(newSize);

    splicedArray.set(arr.subarray(0, starting));
    splicedArray.set(arr.subarray(starting + deleteCount), starting);

    return splicedArray;
}

function increaseFloat32ArraySize(array: Float32Array, addSize: number) : Float32Array {

    const newArray = new Float32Array(array.length + addSize);

    newArray.set(array);

    return newArray;

}

function increaseUint32ArraySize(array: Uint32Array, addSize: number) : Uint32Array {

    const newArray = new Uint32Array(array.length  + addSize);

    newArray.set(array);

    return newArray;

}

function typedArrayToArray(array: ArrayLike<number> ) : number[] {

    const newArray: number[] = [];

    const length: number = array.length;

    for (var i = 0 ; i < length; i++) {
        newArray[i] = array[i];
    }

    return newArray;
}

export {
    mergeTypedArrays,
    spliceTypedArray,
    mergeTypedArrayIndexes,
    mergeFloatArray,
    mergeUintArray,
    updateIndexes,
    increaseFloat32ArraySize,
    increaseUint32ArraySize,
    toFloat32,
    typedArrayToArray
}
