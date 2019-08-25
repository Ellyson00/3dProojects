import {
	Clock,
	EffectComposer,
	FXAAShader,
	PerspectiveCamera,
	RenderPass,
	ShaderPass,
	Vector3,
	WebGLRenderer,
} from './three.js';

class Renderer {
	constructor({
						debug,
						mount,
						scene,
					}) {
		// Initialize state
		this.animations = [];
		this.portals = [];
		this.aux = new Vector3();
		this.camera = new PerspectiveCamera(75, 1, 0.1, 1000);
		this.camera.rotation.order = 'YXZ';
		this.clock = new Clock();
		this.fps = {
			count: 0,
			lastTick: this.clock.oldTime / 1000,
		};
		this.portalCamera = this.camera.clone();
		this.debug = debug;
		this.mount = mount;
		this.updateScene(scene);

		// Setup renderer
		this.renderer = new WebGLRenderer();
		this.renderer.setPixelRatio(window.devicePixelRatio || 1);
		this.renderer.setAnimationLoop(this.onAnimationTick.bind(this));
		this.mount.appendChild(this.renderer.domElement);

		// Setup composer
		this.composer = new EffectComposer(this.renderer);

		// Setup render pass
		const renderPass = new RenderPass(scene, this.camera);
		this.composer.addPass(renderPass);
		this.renderPass = renderPass;

		// Setup FXAA pass
		const fxaaPass = new ShaderPass(FXAAShader);
		this.composer.addPass(fxaaPass);
		this.fxaaPass = fxaaPass;

		// Setup viewport resize
		window.addEventListener('resize', this.onResize.bind(this), false);
		this.onResize();
	}

	onAnimationTick() {
		const {
			camera,
			composer,
			clock,
			debug,
			fps,
			portalCamera,
			portals,
			renderer,
			renderPass,
		} = this;

		// Store the frame timings into the renderer
		// So that they are accesible from the meshes onBeforeRender
		renderer.animation = {
			delta: Math.min(clock.getDelta(), 1 / 30),
			time: clock.oldTime / 1000,
		};
		// Run animations
		this.animations.forEach(animate => animate(renderer.animation));
		const { scene } = this;
		scene.animations.forEach(animate => animate(renderer, scene, camera));

		// Render portals
		scene.portals.forEach((portal) => {
			this.updatePortalCamera(portal);
			renderer.setRenderTarget(portal.renderTarget);
			renderer.render(portal.scene, portalCamera);
		});
		// Render scene
		renderer.setRenderTarget(null);
		renderPass.scene = scene;
		composer.render();

		// Output debug info
		if (renderer.animation.time >= fps.lastTick + 1) {
			debug.innerText = `${fps.count}fps`;
			fps.count = 0;
			fps.lastTick = renderer.animation.time;
		}
		fps.count += 1;
	}

	onResize() {
		const {
			camera,
			composer,
			fxaaPass,
			mount,
			renderer,
		} = this;

		// Resize viewport
		const { width, height } = mount.getBoundingClientRect();
		const pixelRatio = renderer.getPixelRatio();
		renderer.setSize(width, height);
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
		composer.setSize(width, height);
		fxaaPass.material.uniforms.resolution.value.x = 1 / (width * pixelRatio);
		fxaaPass.material.uniforms.resolution.value.y = 1 / (height * pixelRatio);
	}

	updatePortalCamera(portal) {
		const {
			aux,
			camera: { position: viewer },
			portalCamera: camera,
		} = this;
		const { position, quaternion, scale } = portal;

		// Compute asymmetric projection
		camera.position.copy(viewer);
		camera.quaternion.copy(quaternion);
		camera.updateMatrixWorld();
		camera.worldToLocal(portal.getWorldPosition(aux.copy(position)));

		const { x: width, y: height } = scale;
		camera.aspect = width / height;
		camera.near = Math.abs(aux.z);
		camera.far = camera.near + 1000;

		camera.projectionMatrix.makePerspective(
			(aux.x - width / 2),
			(aux.x + width / 2),
			(aux.y + height / 2),
			(aux.y - height / 2),
			camera.near,
			camera.far
		);
		camera.projectionMatrixInverse.getInverse(camera.projectionMatrix);
	}

	updateScene(scene) {
		if (this.scene) {
			this.scene.portals.forEach((portal) => { portal.visible = false; });
		}
		this.scene = scene;
		scene.animations = [];
		scene.portals = [];
		scene.traverse((child) => {
			if (child.isPortal) {
				scene.portals.push(child);
			}
			if (child.onAnimationTick) {
				scene.animations.push(child.onAnimationTick.bind(child));
			}
		});
		scene.portals.forEach((portal) => { portal.visible = true; });
	}
}

export default Renderer;
