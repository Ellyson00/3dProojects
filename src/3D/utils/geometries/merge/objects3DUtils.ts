import * as THREE from "three";
import {deleteGeometry} from "../geometry/geometryUtils";

export function createMesh(geometry: THREE.BufferGeometry | THREE.Geometry, materials: THREE.Material, castShadow?: boolean, receiveShadow?: boolean): THREE.Mesh {

    // @ts-ignore
    const MESH = new THREE.Mesh(<THREE.Geometry> geometry, materials);

    MESH.receiveShadow = receiveShadow;
    MESH.castShadow = castShadow;

    MESH.matrixAutoUpdate = false;
    MESH.matrixWorldNeedsUpdate = false;

    return MESH;

}

function createMeshFromGeometry(geometry: THREE.BufferGeometry, material: THREE.Material, castShadow = false) {
    // @ts-ignore
    const MESH = new THREE.Mesh(geometry, material);

    MESH.castShadow = castShadow;

    MESH.matrixAutoUpdate = false;

    MESH.frustumCulled = false;

    return MESH;
}

function deleteMaterial(material: THREE.Material): void {

    if (Array.isArray(material)) {
        material.forEach((m) => deleteMaterial(m));
        return;
    }

    const texture = (material as any).texture;

    texture && texture.isTexture && texture.dispose(); // be careful

    material.dispose();

}

export function deleteMesh(mesh: THREE.Mesh): void {

    deleteGeometry(mesh.geometry);

    // @ts-ignore
    deleteMaterial(mesh.material);

}

function disposeMeshGroup(meshGroup: THREE.Group): void {
    if (meshGroup && meshGroup.children) {
        (meshGroup.children as THREE.Mesh[]).forEach((mesh: THREE.Mesh) => {
            mesh.traverse((node: THREE.Mesh) => {
                disposeMesh(node);
            });
        });
    }
}

function disposeMesh(mesh: THREE.Mesh): void {
    mesh.geometry.dispose();
    disposeMaterial(mesh.material);
}

function disposeMaterial(material): void {
    if (Array.isArray(material)) {
        material.forEach((material) => {
            disposeBufferPositionData(material);
            disposeMaterialTexture(material);
            material.dispose();
        });
    } else {
        disposeBufferPositionData(material);
        disposeMaterialTexture(material);
        material.dispose();
    }
}

function disposeBufferPositionData(material): void {
    if (material && material.uniforms && material.uniforms.bufferPositionData && material.uniforms.bufferPositionData.value) {
        material.uniforms.bufferPositionData.value.dispose();
    }
}

function disposeMaterialTexture(material): void {
    material.map && material.map.dispose();
}

function createBufferGeometry(position: Float32Array, color: Float32Array, uv: Float32Array, normal: Float32Array, index: Uint32Array) : THREE.BufferGeometry {

    const geometry: THREE.BufferGeometry = new THREE.BufferGeometry();

    geometry.addAttribute("position", new THREE.BufferAttribute(position, 3));
    geometry.setIndex(new THREE.BufferAttribute(index, 1));
    geometry.addAttribute("color", new THREE.BufferAttribute(color, 3));
    geometry.addAttribute("normal", new THREE.BufferAttribute(normal, 3));
    geometry.addAttribute("uv", new THREE.BufferAttribute(uv, 2));

    return geometry;

}

function getGeometrySize(meshes: THREE.Mesh[]) {
    let size = 0;
    for (let i = 0; i < meshes.length; i++) {
        const indexes = (meshes[i].geometry as THREE.InstancedBufferGeometry).getAttribute("position");
        size += indexes.count;
    }
    return size;
}
export {
    disposeMeshGroup,
    createMeshFromGeometry,
    deleteMaterial,
    createBufferGeometry,
    getGeometrySize
};
