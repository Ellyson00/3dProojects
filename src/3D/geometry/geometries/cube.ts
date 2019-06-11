import {IGeometryData} from "./interfaces/IGeometries";

const FRONT_SIDE = {TOP: 1,BOTTOM:2,LEFT:3,RIGHT:4};

function indexedCube(x: number, y: number, z: number, width: number, height: number, depth: number, cr: number, cg: number, cb: number): IGeometryData {

    return {
        position: getCubePositions(x, y, z, width, height, depth),
        color: getCubeColors(cr, cg, cb),
        index: getCubeIndices(),
        normal: getCubeNormals(),
        uv: []
    };

}

function indexedPlaneGeometry(x: number, y: number, z: number, width: number, height: number, depth: number, cr: number, cg: number, cb: number, rackFrontSide: number): IGeometryData {

    return {
        position: getPlanePositions(x, y, z, width, height, depth, rackFrontSide),
        color: getPlaneColors(cr, cg, cb),
        index: getPlaneIndices(),
        normal: getPlaneNormals(),
        uv: createPlaneUvs(rackFrontSide)
    };

}

function getPlanePositions(x: number, y: number, z: number, width: number, height: number, depth: number, rackFrontSide: number): number[] {

    switch (rackFrontSide) {

    case FRONT_SIDE.TOP:
        return [
            x, y, z,
            x, y + height, z,
            x + width, y + height, z,
            x + width, y, z
        ];

    case FRONT_SIDE.BOTTOM:
        return [
            x, y, z + depth,
            x + width, y, z + depth,
            x + width, y + height, z + depth,
            x, y + height, z + depth
        ];

    case FRONT_SIDE.LEFT:
        return [
            x, y, z,
            x, y, z + depth,
            x, y + height, z + depth,
            x, y + height, z
        ];

    case FRONT_SIDE.RIGHT:
        return [
            x + width, y, z,
            x + width, y + height, z,
            x + width, y + height, z + depth,
            x + width, y, z + depth
        ];
    }
}


function getPlaneColors(r: number, g: number, b: number) : number[] {
    return [
        r, g, b,
        r, g, b,
        r, g, b,
        r, g, b
    ];
}

function getPlaneIndices(offset: number = 0): number[] {
    return [
        offset, 1 + offset, 2 + offset,
        offset, 2 + offset, 3 + offset
    ];
}

function getPlaneNormals() : number[] {
    return [
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1
    ];
}

function createPlaneUvs(rackFrontSide): number[] {
    switch (rackFrontSide) {

    case FRONT_SIDE.TOP:
        return [1, 0, 1, 1, 0, 1, 0, 0]
    case FRONT_SIDE.RIGHT:
        return [1, 0, 1, 1, 0, 1, 0, 0]
    case FRONT_SIDE.BOTTOM:
        return [0, 0, 1, 0, 1, 1, 0, 1]
    case FRONT_SIDE.LEFT:
        return [0, 0, 1, 0, 1, 1, 0, 1]
    }
}

function createCubePlaneUvsWithoutTop(): number[] {
    return [
        0, 0, 1, 0, 1, 1, 0, 1,
        0, 0, 0, 1, 1, 1, 1, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 1, 1, 1, 1, 0,
        0, 0, 0, 1, 1, 1, 1, 0,
        0, 0, 1, 0, 1, 1, 0, 1
    ];
}

function getCubeColors(r: number, g: number, b: number) : number[] {
    return [
        r, g, b,
        r, g, b,
        r, g, b,
        r, g, b,

        r, g, b,
        r, g, b,
        r, g, b,
        r, g, b,

        r, g, b,
        r, g, b,
        r, g, b,
        r, g, b,

        r, g, b,
        r, g, b,
        r, g, b,
        r, g, b,

        r, g, b,
        r, g, b,
        r, g, b,
        r, g, b,

        r, g, b,
        r, g, b,
        r, g, b,
        r, g, b
    ];
}

function getCubePositions(x: number, y: number, z: number, width: number, height: number, depth: number) : number[] {
    return [
        // Front Face
        x, y, z + depth,
        x + width, y, z + depth,
        x + width, y + height, z + depth,
        x, y + height, z + depth,

        // Back face
        x, y, z,
        x, y + height, z,
        x + width, y + height, z,
        x + width, y, z,

        // Top face
        x, y + height, z,
        x, y + height, z + depth,
        x + width, y + height, z + depth,
        x + width, y + height, z,

        // Bottom face
        x, y, z,
        x + width, y, z,
        x + width, y, z + depth,
        x, y, z + depth,

        // Right face
        x + width, y, z,
        x + width, y + height, z,
        x + width, y + height, z + depth,
        x + width, y, z + depth,

        // Left face
        x, y, z,
        x, y, z + depth,
        x, y + height, z + depth,
        x, y + height, z
    ];
}

function getCubeIndices(offset: number = 0): number[] {
    return [
        // Front face
        offset, 1 + offset, 2 + offset,
        offset, 2 + offset, 3 + offset,

        // Back face
        4 + offset, 5 + offset, 6 + offset,
        4 + offset, 6 + offset, 7 + offset,

        // Top face
        8 + offset, 9 + offset, 10 + offset,
        8 + offset, 10 + offset, 11 + offset,

        // Bottom face
        12 + offset, 13 + offset, 14 + offset,
        12 + offset, 14 + offset, 15 + offset,

        // Right face
        16 + offset, 17 + offset, 18 + offset,
        16 + offset, 18 + offset, 19 + offset,

        // Left face
        20 + offset, 21 + offset, 22 + offset,
        20 + offset, 22 + offset, 23 + offset
    ];
}

function createCubeUvs(width, height, depth): number[] {
    return [
        0, 0, width, 0, width, height, 0, height,
        0, 0, 0, height, width, height, width, 0,
        0, 0, 0, depth, width, depth, width, 0,
        0, 0, 0, depth, width, depth, width, 0,
        0, 0, 0, height, depth, height, depth, 0,
        0, 0, depth, 0, depth, height, 0, height
    ];
}

function texturedIndexedCube(x: number, y: number, z: number, width: number, height: number, depth: number): IGeometryData {

    const cubeGeometry: IGeometryData = indexedCube(x, y, z, width, height, depth, 1, 1, 1);

    cubeGeometry.uv = createCubeUvs(width, height, depth);

    return cubeGeometry;

}

function getCubeNormals() : number[] {
    return [

        // Front face
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,

        // Back face
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,

        // Top face
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,

        // Bottom face
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,

        // Right face
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,

        // Left face
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0

    ];
}

function indexedCubeNoNormals(x: number, y: number, z: number, width: number, height: number, depth: number, cr: number, cg: number, cb: number): IGeometryData {
    return {
        position: getCubePositions(x, y, z, width, height, depth),
        color: getCubeColors(cr, cg, cb),
        index: getCubeIndices(),
        normal: [],
        uv: []
    };
}

export {
    indexedCube,
    texturedIndexedCube,
    getCubeNormals,
    getCubePositions,
    getCubeIndices,
    getCubeColors,
    createCubeUvs,
    indexedCubeNoNormals,
    indexedPlaneGeometry,
    createCubePlaneUvsWithoutTop
};
