/**
 * Created by Ellyson on 6/9/2019.
 */

import * as THREE from 'three';

export const interectiveMeshes = [];

const blueMesh = new THREE.Mesh(new THREE.BoxGeometry(796, 750, 410).translate(-150, -20, 145), new THREE.MeshBasicMaterial({color: new THREE.Color("blue"),transparent: true, opacity: 0}));
blueMesh.name = "blue";

const greenGeometry = new THREE.BoxGeometry(796, 750, 300);
const greenStairs = new THREE.BoxGeometry(300, 350, 300);
greenStairs.vertices[0].y = greenStairs.vertices[1].y = -100;
greenGeometry.merge(greenStairs.translate(550,-200,0));
const greenMesh = new THREE.Mesh(greenGeometry.translate(-150, -20, -220), new THREE.MeshBasicMaterial({color: new THREE.Color("green"),transparent: true, opacity: 0}));
greenMesh.name = "green";

const redMesh = new THREE.Mesh(new THREE.BoxGeometry(786, 650, 740).translate(-160, 1025, 0), new THREE.MeshBasicMaterial({color: new THREE.Color("red"),transparent: true, opacity: 0}));
redMesh.name = "red";

interectiveMeshes.push(blueMesh, greenMesh, redMesh);