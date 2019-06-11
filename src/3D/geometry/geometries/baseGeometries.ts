import * as THREE from "three";
import {IGeometryData} from "./interfaces/IGeometries";
import {mergeGeometryData} from "../../utils/geometries/geometry/geometryUtils";
import {createCubeUvs, getCubeColors, getCubeIndices, indexedCube, texturedIndexedCube} from "./cube";

export const CUBE_POSITIONS_QUANTITY = 72;

/**
 *
 * @param x - position of bottom polygon
 * @param y - position of bottom polygon
 * @param z - position of bottom polygon
 * @param b - width
 * @param h - height
 * @param t - depth
 * @param ex - position of top polygon
 * @param ez - position of top polygon
 * @param cr - red
 * @param cg - green
 * @param cb - blue
 * @returns {{position: number[], index: number[], normal: number[], color: number[], uv: Array}}
 *
 * a quad that goes diagonal, that means all position at y+h get different x and z values.
 *
 */
function indexedDiagonalCuboid(x: number, y: number, z: number, b: number, h: number, t: number, ex: number, ez: number, cr: number, cg: number, cb: number): IGeometryData {

    const position: number[] = [

        // Front face
        x, y, z + t,
        x + b, y, z + t,
        ex + b, y + h, ez + t,
        ex, y + h, ez + t,

        // Back face
        x, y, z,
        ex, y + h, ez,
        ex + b, y + h, ez,
        x + b, y, z,

        // Top face
        ex, y + h, ez,
        ex, y + h, ez + t,
        ex + b, y + h, ez + t,
        ex + b, y + h, ez,

        // Bottom face
        x, y, z,
        x + b, y, z,
        x + b, y, z + t,
        x, y, z + t,

        // Right face
        x + b, y, z,
        ex + b, y + h, ez,
        ex + b, y + h, ez + t,
        x + b, y, z + t,

        // Left face
        x, y, z,
        x, y, z + t,
        ex, y + h, ez + t,
        ex, y + h, ez

    ];

    // Front face
    const normals_1: number[] = generateFourNormals(position[0], position[1], position[2], position[3], position[4], position[5],
        position[6], position[7], position[8], position[9], position[10], position[11]);

    // Back face
    const normals_2 = generateFourNormals(position[12], position[13], position[14], position[15], position[16], position[17],
        position[18], position[19], position[20], position[21], position[22], position[23]);

    // Right face
    const normals_3 = generateFourNormals(position[48], position[49], position[50], position[51], position[52], position[53],
        position[54], position[55], position[56], position[57], position[58], position[59]);

    // Left face
    const normals_4 = generateFourNormals(position[60], position[61], position[62], position[63], position[64], position[65],
        position[66], position[67], position[68], position[69], position[70], position[71]);

    const normal: number[] = [

        // Front face
        normals_1[0], normals_1[1], normals_1[2],
        normals_1[3], normals_1[4], normals_1[5],
        normals_1[6], normals_1[7], normals_1[8],
        normals_1[9], normals_1[10], normals_1[11],

        // Back face
        normals_2[0], normals_2[1], normals_2[2],
        normals_2[3], normals_2[4], normals_2[5],
        normals_2[6], normals_2[7], normals_2[8],
        normals_2[9], normals_2[10], normals_2[11],

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
        normals_3[0], normals_3[1], normals_3[2],
        normals_3[3], normals_3[4], normals_3[5],
        normals_3[6], normals_3[7], normals_3[8],
        normals_3[9], normals_3[10], normals_3[11],

        // Left face
        normals_4[0], normals_4[1], normals_4[2],
        normals_4[3], normals_4[4], normals_4[5],
        normals_4[6], normals_4[7], normals_4[8],
        normals_4[9], normals_4[10], normals_4[11],

    ];

    return {position, index: getCubeIndices(), normal, color: getCubeColors(cr, cg, cb), uv: []};

}

// TODO refactor, use method from three js
// TODO don't work proper
function generateIndexedNormals(position: number[]): number[] {  //they HAVE to be like [0,1,2,0,2,3]  --> use with caution

    const posLength = position.length;
    const normal: number[] = [];

    let v1, v2, v3, va, vb, n;

    let dif = false; //toggle between using n, n+1, n+2 and n-2,n,n+1  because of [0,1,2,0,2,3]

    for (let i = 0; i < posLength; i += 6) {  //only 6 vertices on average

        if (dif) {
            v1 = new THREE.Vector3(position[i - 6], position[i - 5], position[i - 4]);
            v2 = new THREE.Vector3(position[i], position[i + 1], position[i + 2]);
            v3 = new THREE.Vector3(position[i + 3], position[i + 4], position[i + 5]);
        } else {
            v1 = new THREE.Vector3(position[i], position[i + 1], position[i + 2]);
            v2 = new THREE.Vector3(position[i + 3], position[i + 4], position[i + 5]);
            v3 = new THREE.Vector3(position[i + 6], position[i + 7], position[i + 8]);
        }

        va = new THREE.Vector3().subVectors(v2, v1);
        vb = new THREE.Vector3().subVectors(v3, v1);

        n = va.cross(vb);

        if (dif) {
            normal.push(n.x);
            normal.push(n.y);
            normal.push(n.z * -1);
        } else {
            normal.push(n.x);
            normal.push(n.y);
            normal.push(n.z * -1);
            normal.push(n.x);
            normal.push(n.y);
            normal.push(n.z * -1);
            normal.push(n.x);
            normal.push(n.y);
            normal.push(n.z * -1);
        }

        dif = !dif;
    }

    return normal;

}

function addFourVerticesDoubleSided(x: number, y: number, z: number, x1: number, y1: number, z1: number, x2: number, y2: number, z2: number,
                                    x3: number, y3: number, z3: number, r: number, g: number, b: number) {

    return mergeGeometryData(addFourVertices(x, y, z, x1, y1, z1, x2, y2, z2, x3, y3, z3, r, g, b), addFourVertices(x, y, z, x3, y3, z3, x2, y2, z2, x1, y1, z1, r, g, b));

}

/**
 * @param x - 0 index point
 * @param y - 0 index point
 * @param z - 0 index point
 * @param x1 - 1 index point
 * @param y1 - 1 index point
 * @param z1 - 1 index point
 * @param x2 - 2 index point
 * @param y2 - 2 index point
 * @param z2 - 2 index point
 * @param x3 - 3 index point
 * @param y3 - 3 index point
 * @param z3 - 3 index point
 * @param r
 * @param g
 * @param b
 * @returns {{position: [number,number,number,number,number,number,number,number,number,number,number,number], color:
 *         [number,number,number,number,number,number,number,number,number,number,number,number], normal:
 *         [number,number,number,number,number,number,number,number,number,number,number,number], index: [number,number,number,number,number,number], uv:
 *         Array}}
 */
/*
 indexes
 3----2
 |   /|
 |  / |
 | /  |
 |/   |
 0----1
 */
function addFourVertices(x: number, y: number, z: number, x1: number, y1: number, z1: number, x2: number, y2: number, z2: number,
                         x3: number, y3: number, z3: number, r: number, g: number, b: number): IGeometryData {

    return {

        position: [
            x, y, z,
            x1, y1, z1,
            x2, y2, z2,
            x3, y3, z3
        ],

        color: [
            r, g, b,
            r, g, b,
            r, g, b,
            r, g, b
        ],

        normal: generateFourNormals(x, y, z, x1, y1, z1, x2, y2, y3, x3, y3, z3),

        index: [
            0, 1, 2,
            0, 2, 3
        ],

        uv: []

    };

}

// todo looks like takes a lot of time
function generateFourNormals(x: number, y: number, z: number, x1: number, y1: number, z1: number,
                             x2: number, y2: number, z2: number, x3: number, y3: number, z3: number): number[] {

    const vec01 = {x: x1 - x, y: y1 - y, z: z1 - z};
    const vec03 = {x: x3 - x, y: y3 - y, z: z3 - z};

    const vec12 = {x: x2 - x1, y: y2 - y1, z: z2 - z1};
    const vec10 = {x: x - x1, y: y - y1, z: z - z1};

    const vec21 = {x: x1 - x2, y: y1 - y2, z: z1 - z2};
    const vec23 = {x: x3 - x2, y: y3 - y2, z: z3 - z2};

    const vec32 = {x: x2 - x3, y: y2 - y3, z: z2 - z3};
    const vec30 = {x: x - x3, y: y - y3, z: z - z3};

    return [

        vec01.y * vec03.z - vec01.z * vec03.y,
        vec01.z * vec03.x - vec01.x * vec03.z,
        vec01.x * vec03.y - vec01.y * vec03.x,

        vec12.y * vec10.z - vec12.z * vec10.y,
        vec12.z * vec10.x - vec12.x * vec10.z,
        vec12.x * vec10.y - vec12.y * vec10.x,

        vec23.y * vec21.z - vec23.z * vec21.y,
        vec23.z * vec21.x - vec23.x * vec21.z,
        vec23.x * vec21.y - vec23.y * vec21.x,

        vec30.y * vec32.z - vec30.z * vec32.y,
        vec30.z * vec32.x - vec30.x * vec32.z,
        vec30.x * vec32.y - vec30.y * vec32.x

    ];

}

function indexedTriangle(x: number, y: number, z: number, x1: number, y1: number, z1: number, x2: number, y2: number, z2,
                         r: number, g: number, b: number): IGeometryData {

    // todo TEST normal
    const vec01 = {x: x1 - x, y: y1 - y, z: z1 - z};
    const vec02 = {x: x2 - x, y: y2 - y, z: z2 - z};

    return {
        position: [
            x, y, z,
            x1, y1, z1,
            x2, y2, z2
        ],
        index: [
            0, 1, 2
        ],
        color: [
            r, g, b,
            r, g, b,
            r, g, b
        ],
        normal: [
            vec01.y * vec02.z - vec01.z * vec02.y,
            vec01.z * vec02.x - vec01.x * vec02.z,
            vec01.x * vec02.y - vec01.y * vec02.x,
        ],
        uv: []
    };

}

/**
 * draws cut block with 0, 0, 0 positions
 * @param width
 * @param height
 * @param length
 * @param r
 * @param g
 * @param b
 * @returns {{position:
 *         [number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number],
 *         normal:
 *         [number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number],
 *         color:
 *         [number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number],
 *         index:
 *         [number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number],
 *         uv: Array}}
 */
function indexedCutBlock(width: number, height: number, length: number, r: number, g: number, b: number): IGeometryData {

    const halfWidth: number = width / 2;
    const halfHeight: number = height / 2;
    const halfLength: number = length / 2;

    return {
        position: [

            // bottom plane
            -halfWidth, -halfHeight, halfLength,
            -halfWidth, -halfHeight, -halfLength,
            halfWidth, -halfHeight, -halfLength,
            halfWidth, -halfHeight, halfLength,

            // cut plane
            -halfWidth, -halfHeight, halfLength,
            halfWidth, halfHeight, halfLength,
            halfWidth, halfHeight, -halfLength,
            -halfWidth, -halfHeight, -halfLength,

            // right plane
            halfWidth, halfHeight, halfLength,
            halfWidth, -halfHeight, halfLength,
            halfWidth, -halfHeight, -halfLength,
            halfWidth, halfHeight, -halfLength,

            // front plane
            -halfWidth, -halfHeight, halfLength,
            halfWidth, -halfHeight, halfLength,
            halfWidth, halfHeight, halfLength,

            // back plane
            -halfWidth, -halfHeight, -halfLength,
            halfWidth, halfHeight, -halfLength,
            halfWidth, -halfHeight, -halfLength,

        ],

        normal: [

            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,

            -1, 1, 0,
            -1, 1, 0,
            -1, 1, 0,
            -1, 1, 0,

            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,

            0, 0, 1,
            0, 0, 1,
            0, 0, 1,

            0, 0, -1,
            0, 0, -1,
            0, 0, -1

        ],

        color: [
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
        ],

        index: [

            0, 1, 2,
            0, 2, 3,

            4, 5, 6,
            4, 6, 7,

            8, 9, 10,
            8, 10, 11,

            12, 13, 14,

            15, 16, 17

        ],

        uv: []
    };

}

/**
 * for back sided geometry just change order of points 1 <=> 2
 * @param x
 * @param y
 * @param z
 * @param x1
 * @param y1
 * @param z1
 * @param x2
 * @param y2
 * @param z2
 * @param r
 * @param g
 * @param b
 * @returns {{position: number[], normal: number[], color: number[], index: number[], uv: Array}}
 */
function drawIndexedTriangle(x: number, y: number, z: number, x1: number, y1: number, z1: number, x2: number, y2: number, z2: number,
                             r: number, g: number, b: number): IGeometryData {

    const vec01 = {x: x1 - x, y: y1 - y, z: z1 - z};
    const vec02 = {x: x2 - x, y: y2 - y, z: z2 - z};

    const vec12 = {x: x2 - x1, y: y2 - y1, z: z2 - z1};
    const vec10 = {x: x - x1, y: y - y1, z: z - z1};

    const vec21 = {x: x1 - x2, y: y1 - y2, z: z1 - z2};
    const vec20 = {x: x - x2, y: y - y2, z: z - z2};

    return {

        position: [
            x, y, z,
            x1, y1, z1,
            x2, y2, z2
        ],

        normal: [
            vec01.y * vec02.z - vec01.z * vec02.y,
            vec01.z * vec02.x - vec01.x * vec02.z,
            vec01.x * vec02.y - vec01.y * vec02.x,

            vec12.y * vec10.z - vec12.z * vec10.y,
            vec12.z * vec10.x - vec12.x * vec10.z,
            vec12.x * vec10.y - vec12.y * vec10.x,

            vec20.y * vec21.z - vec20.z * vec21.y,
            vec20.z * vec21.x - vec20.x * vec21.z,
            vec20.x * vec21.y - vec20.y * vec21.x
        ],

        color: [
            r, g, b,
            r, g, b,
            r, g, b
        ],

        index: [
            0, 1, 2
        ],

        uv: []
    };

}

export {
    indexedCube,
    indexedDiagonalCuboid,
    generateIndexedNormals,
    createCubeUvs,
    texturedIndexedCube,
    addFourVertices,
    indexedTriangle,
    addFourVerticesDoubleSided,
    drawIndexedTriangle,
    indexedCutBlock
}