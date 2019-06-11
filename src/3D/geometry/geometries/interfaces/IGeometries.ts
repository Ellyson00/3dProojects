import * as THREE from "three";

export interface IGeometryData {
    position: number[],
    normal: number[],
    index: number[],
    color: number[],
    uv: number[];
}

export interface ITypedGeometryData {
    position: Float32Array,
    normal: Float32Array,
    color: Float32Array,
    uv: Float32Array,
    index: Uint32Array
}

export interface IGeometryBufferCount {
    position: number,
    normal: number,
    color: number,
    uv: number,
    index: number,
}

export interface IRange {
    offset: number,
    count: number
}

export interface  IGeometryRanges {
    position: IRange,
    normal: IRange,
    index: IRange,
    color: IRange,
    uv: IRange
}

export interface IObjects3DRanges {
    [objectId: number] : IGeometryRanges
}

export interface IMaterialGroup{
    start: number,
    count: number,
    materialIndex?: number
}

export interface IGeometryByMaterial {
    [materialName: string] : IGeometryData
}

export interface IAttributeData {
    offset: number,
    count: number,
    attribute: THREE.BufferAttribute,
    array: number[]
}

export interface IGeometriesDataMap {
    [id: number] : IGeometryData
}
