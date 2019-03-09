/**
 * Created by Ellyson on 5/11/2018.
 */
import * as THREE from 'three';
import Delaunator from 'delaunator';
import TemplateFor3D from '../../template3D/temp';

let dots = [];
// dots.push([0, 0]);
dots.push([0, 1]);
dots.push([-0.25, 0.5]);
dots.push([-1, 0.5]);
dots.push([-.5, 0]);
dots.push([-1, -.5]);
dots.push([-0.25, -0.5]);
dots.push([0, -1]);
dots.push([0.25, -0.5]);
dots.push([1, -0.5]);
dots.push([.5, 0]);
dots.push([1, 0.5]);
dots.push([0.25, 0.5]);
dots.push([0, 1]);


const delaunay = new Delaunator.from(dots);
let triangles = delaunay.triangles;

export default class FourthWork extends TemplateFor3D {

	initControls(){
		super.initControls();
		this.camera.position.z = 10;
	}

	initStar(){
		this.geometry = new THREE.Geometry();
		dots.forEach((dot) => {
			this.geometry.vertices.push(new THREE.Vector3(dot[0], dot[1], 0));
		});

		for(let i = 0; i < triangles.length; i = i + 3){
			if(i === 3 || i ===12 || i === 30 || i === 39 || i === 42 || i === 45) continue;
			this.geometry.faces.push(new THREE.Face3(triangles[i],triangles[i+1],triangles[i+2]));
		}

		this.geometry.computeBoundingBox();
		this.material = new THREE.MeshBasicMaterial({side: THREE.DoubleSide});
		this.mesh = new THREE.Mesh(this.geometry, this.material);
		this.mesh.position.set(0, 0, 0);
		this.pointLight = new THREE.PointLight(0xffffff, 1, 24);
		this.mesh.add(this.pointLight);
		console.log(this.mesh);
		this.scene.add(this.mesh);


		const width = 10;
		const height = 2	;
		const intensity = 5;
		const rectLight = new THREE.RectAreaLight( 0xffffff, intensity,  width, height );
		rectLight.position.set( 0, 4.5, .5 );
		rectLight.rotation.set( 3.14/2, 0, 0 );
		// rectLight.rotation.x = Math.Pi/3;
		// rectLight.lookAt( 0, 0, 0 );
		this.scene.add( rectLight );
		const ambient = new THREE.AmbientLight( 0xffffff, 0.1 );

		this.scene.add( ambient );
		const rectLightHelper = new THREE.RectAreaLightHelper( rectLight );
		this.scene.add( rectLightHelper );

	}
	initGround(){
		this.planeGeometry = new THREE.PlaneGeometry(10, 10);
		this.planeMaterial = new THREE.MeshPhysicalMaterial({ metalness: 0.2, roughness: 0.2 ,side: THREE.DoubleSide});
		this.planeMesh = new THREE.Mesh(this.planeGeometry, this.planeMaterial);
		this.scene.add(this.planeMesh);
		this.planeMesh.position.set(0, -.5, -.5);
		this.planeMesh.rotation.x = -Math.PI;
	}

	componentDidMount() {
		super.componentDidMount();
		this.initStar();
		this.initGround();
		this.initControls();
		this.animate();

	}

	animate() {
		if(!this.looped) return;
		super.animate();
	}
}
