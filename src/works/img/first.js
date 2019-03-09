/**
 * Created by Ellyson on 5/11/2018.
 */
class firstWork extends React.Component {
	constructor(){
		super();
		this.time=0;
		this.initRenderer();
		this.initScene();
		this.initCamera();
		this.initLight();
		this.initControls();
		this.pos = new Mouse(this.renderer.domElement);
		let loader = new THREE.TextureLoader();
		loader.load(image, (texture)=>{
			this.geometry = new THREE.Geometry();
			// const material = new THREE.MeshBasicMaterial( { map: texture ,wireframe:true} );
			var material = new THREE.ShaderMaterial( {
				extensions: {
					derivatives: "#extension GL_OES_standard_derivatives : enable"
				},
				uniforms: {

					textureSampler:{type:"t",value:null}

				},

				vertexShader: document.getElementById( 'vertShader' ).textContent,

				fragmentShader: document.getElementById( 'fragShader' ).textContent,
				side:THREE.DoubleSide

			} );

			material.uniforms.textureSampler.value = texture;
			// dots.forEach((d)=>{
			//  geometry.vertices.push( THREE.Vector3(d.x,d.y,d.z));
			// });
			dots.forEach((d)=>{
				this.geometry.vertices.push(new THREE.Vector3(d[0],d[1],0));
			});

			for(let i = 0; i< triangles.length;i=i+3){
				this.geometry.faces.push(new THREE.Face3(triangles[i],triangles[i+1],triangles[i+2]));
			}
			this.geometry.computeBoundingBox();

			var max = this.geometry.boundingBox.max,
				min = this.geometry.boundingBox.min;
			var offset = new THREE.Vector2(0 - min.x, 0 - min.y);
			var range = new THREE.Vector2(max.x - min.x, max.y - min.y);
			var faces = this.geometry.faces;

			this.geometry.faceVertexUvs[0] = [];

			for (var i = 0; i < faces.length ; i++) {

				var v1 = this.geometry.vertices[faces[i].a],
					v2 = this.geometry.vertices[faces[i].b],
					v3 = this.geometry.vertices[faces[i].c];

				this.geometry.faceVertexUvs[0].push([
					new THREE.Vector2((v1.x + offset.x)/range.x ,(v1.y + offset.y)/range.y),
					new THREE.Vector2((v2.x + offset.x)/range.x ,(v2.y + offset.y)/range.y),
					new THREE.Vector2((v3.x + offset.x)/range.x ,(v3.y + offset.y)/range.y)
				]);
			}
			this.geometry.uvsNeedUpdate = true;
			// for(let i = 0; i< 50;i++){
			//  geometry.vertices.push(new THREE.Vector3(0,0,0));
			//  geometry.vertices.push(new THREE.Vector3(50,0,0));
			//  geometry.vertices.push(new THREE.Vector3(50,50,0));
			//  geometry.vertices.push(new THREE.Vector3(150,50,0));
			//
			//  geometry.faces.push(new THREE.Face3(0,1,2));
			//  geometry.faces.push(new THREE.Face3(1,2,3));
			// }
			this.pointCloud = new THREE.Mesh( this.geometry, material );
			this.scene.add( this.pointCloud );
		});
		// ------------------------------------------------
		const geometry = new THREE.BoxGeometry(1,1);
		const material = new THREE.MeshLambertMaterial({color:0xab23df});
		this.box = new THREE.Mesh( geometry, material );
		this.scene.add( this.box );


		this.raycaster = new THREE.Raycaster();

		document.addEventListener( 'mousemove', this.onDocumentMouseDown.bind(this), false );


		this.animate();
	}

	onDocumentMouseDown( event ) {
		// create a Ray with origin at the mouse position
		//   and direction into the scene (camera direction)
		var mouse = new THREE.Vector2();
		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

		// var raycaster = new THREE.Raycaster();
		this.raycaster.setFromCamera( mouse, this.camera );
		this.intersects = this.raycaster.intersectObject( this.pointCloud );

	}
	initScene(){
		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color(0xffffff);
	}
	initLight(){
		// this.light = new THREE.AmbientLight(0x000000, 0.8);
		// this.dirLight = new THREE.DirectionalLight(0x000000, 0.8);
		// this.scene.add(this.light);
		// this.scene.add(this.dirLight);
		var light = new THREE.AmbientLight( 0x404040, 1.6 ); // soft white light
		this.scene.add( light );
	}
	initRenderer(){
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize( window.innerWidth, window.innerHeight/* - 195*/  );
	}
	initCamera(){
		this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / (window.innerHeight/* - 195*/), 0.1, 2000 );
		this.camera.position.set(281, 253, 411);
		this.camera.rotation.set( -0.101,-0.021,-0.002);
	}

	initControls(){
		this.controls = new OrbitControls(this.camera, this.renderer.domElement)
	}

	animate() {
		requestAnimationFrame( this.animate.bind(this));
		this.time++;
		this.renderer.render( this.scene, this.camera );

		if(this.geometry){
			// this.geometry.vertices.forEach((v,i)=>{
			// 	v.z = 100*Math.sin(i/10 + this.time/100)
			// })
			myDots.forEach((d,i)=>{
				if(this.intersects && this.intersects.length > 0) d.think(this.intersects[0].point);
				this.geometry.vertices[i].z = d.z;
				// this.geometry.vertices[i].z = 100*Perlin(d.x/50,d.y/50,this.time/100);
			});
			this.geometry.verticesNeedUpdate=true;
		}
	}

	componentDidMount() {
		window.renderer.appendChild(this.renderer.domElement);
	}
	render() {
		return (
			<div className="App">
				<header className="">
					LoL
				</header>
				{this.renderer.domElement ? this.renderer.domElement : null};
			</div>)
	}
}
