import {IGeometryData} from "./interfaces/IGeometries";
import {addFourVerticesDoubleSided} from "./baseGeometries";
import {initGeometryData, mergeGeometryData} from "../../utils/geometries/geometry/geometryUtils";
import {Color} from "three";

// horizontal // todo delete
function indexedPlane(x: number, y: number, z: number, width: number, height: number, depth: number, cr: number, cg: number, cb: number): IGeometryData {

    // todo delete depth?
    return {
        position: [
            // Top face from indexedCube
            x, y + height, z,
            x, y + height, z + depth,
            x + width, y + height, z + depth,
            x + width, y + height, z
        ],
        index: [0, 1, 2, 0, 2, 3],
        normal: [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0],
        color: [
            cr, cg, cb,
            cr, cg, cb,
            cr, cg, cb,
            cr, cg, cb
        ],
        uv: []
    };

}

function customPlane(vec) {

    return {
        position: [
            vec[0][0], 0, vec[0][1],
            vec[1][0], 0, vec[1][1],
            vec[2][0], 0, vec[2][1],
            vec[3][0], 0, vec[3][1],

        ],
        index: [0, 1, 2, 0, 2, 3],
        normal: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        color: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        uv: []
    };

}

// horizontal
function planeGeometry(x: number, y: number, z: number, width: number, height: number, cr: number, cg: number, cb: number): IGeometryData {

    return {
        position: getPlanePosition(x, y, z, width, height),
        index: getPlaneIndex(),
        normal: getPlaneNormal(),
        color: getPlaneColor(cr, cg, cb),
        uv: []
    };

}

/**
 * center in center of plane geometry
 * @param x
 * @param y
 * @param z
 * @param width
 * @param height
 * @returns {[number,number,number,number,number,number,number,number,number,number,number,number]}
 */
function getPlanePosition(x: number, y: number, z: number, width: number, height: number): number[] {

    const halfWidth = width / 2;
    const halfHeight = height / 2;

    return [
        x - halfWidth, y - halfHeight, z,
        x + halfWidth, y - halfHeight, z,
        x + halfWidth, y + halfHeight, z,
        x - halfWidth, y + halfHeight, z
    ];
}

function getPlaneIndex(): number[] {
    return [0, 1, 2, 0, 2, 3];
}

function getPlaneNormal(): number[] {
    return [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0];
}

function getPlaneColor(cr: number, cg: number, cb: number): number[] {
    return [
        cr, cg, cb,
        cr, cg, cb,
        cr, cg, cb,
        cr, cg, cb
    ];
}

function getPlaneUV(): number[] {
    return [0, 0, 1, 0, 1, 1, 0, 1];
}

// todo delete, use indexedPlane
function drawPlane(x: number, y: number, z: number, b: number, h: number, t: number, frontSide: number, color: Color): IGeometryData {

    let planeGeometry: IGeometryData = initGeometryData();

    if (frontSide % 2 == 0) {

        planeGeometry = mergeGeometryData(planeGeometry, addFourVerticesDoubleSided(
            x, y, z,
            x + b, y, z,
            x + b, y + h, z + t,
            x, y + h, z + t,
            color.r, color.g, color.b
        ));

    } else {

        planeGeometry = mergeGeometryData(planeGeometry, addFourVerticesDoubleSided(
            x, y, z + t,
            x, y, z,
            x + b, y + h, z,
            x + b, y + h, z + t,
            color.r, color.g, color.b
        ));

    }

    return planeGeometry;

}

function indexedPlaneWithUVs(x, y, z, width, height, depth, cr, cg, cb): IGeometryData {

    const data: IGeometryData = indexedPlane(x, y, z, width, height, depth, cr, cg, cb);

    data.uv = [0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0];

    return data;

}

export {
    indexedPlane,
    indexedPlaneWithUVs,
    drawPlane,
    planeGeometry,
    getPlaneColor,
    getPlanePosition,
    getPlaneIndex,
    getPlaneNormal,
    getPlaneUV,
    customPlane
};
