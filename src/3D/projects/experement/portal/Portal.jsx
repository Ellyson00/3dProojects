/*! by @vlucendo -- http://vlucendo.com */ ! function(c) {
	function e(e) {
		for (var t, n, i = e[0], r = e[1], a = e[2], o = 0, s = []; o < i.length; o++) n = i[o], l[n] && s.push(l[n][0]), l[n] = 0;
		for (t in r) Object.prototype.hasOwnProperty.call(r, t) && (c[t] = r[t]);
		for (h && h(e); s.length;) s.shift()();
		return m.push.apply(m, a || []), u()
	}

	function u() {
		for (var e, t = 0; t < m.length; t++) {
			for (var n = m[t], i = !0, r = 1; r < n.length; r++) {
				var a = n[r];
				0 !== l[a] && (i = !1)
			}
			i && (m.splice(t--, 1), e = o(o.s = n[0]))
		}
		return e
	}
	var n = {},
		l = {
			0: 0
		},
		m = [];

	function o(e) {
		if (n[e]) return n[e].exports;
		var t = n[e] = {
			i: e,
			l: !1,
			exports: {}
		};
		return c[e].call(t.exports, t, t.exports, o), t.l = !0, t.exports
	}

	o.m = c, o.c = n, o.d = function(e, t, n) {
		o.o(e, t) || Object.defineProperty(e, t, {
			enumerable: !0,
			get: n
		})
	}, o.r = function(e) {
		"undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
			value: "Module"
		}), Object.defineProperty(e, "__esModule", {
			value: !0
		})
	}, o.t = function(t, e) {
		if (1 & e && (t = o(t)), 8 & e) return t;
		if (4 & e && "object" == typeof t && t && t.__esModule) return t;
		var n = Object.create(null);
		if (o.r(n), Object.defineProperty(n, "default", {
			enumerable: !0,
			value: t
		}), 2 & e && "string" != typeof t)
			for (var i in t) o.d(n, i, function(e) {
				return t[e]
			}.bind(null, i));
		return n
	}, o.n = function(e) {
		var t = e && e.__esModule ? function() {
			return e.default
		} : function() {
			return e
		};
		return o.d(t, "a", t), t
	}, o.o = function(e, t) {
		return Object.prototype.hasOwnProperty.call(e, t)
	}, o.p = "";
	var t = window.webpackJsonp = window.webpackJsonp || [],
		i = t.push.bind(t);
	t.push = e, t = t.slice();
	for (var r = 0; r < t.length; r++) e(t[r]);
	var h = i;
	m.push([25, 1]), u()
}([, , , , , , , , , , , function(e, t) {
	e.exports = function(e) {
		return '<canvas></canvas><div class="info">Scroll to travel through the portal.<br>The (bad quality) skyboxes are from <a href="http://www.custommapmakers.org/skyboxes.php" target="_blank">here</a>.</div>'
	}
}, function(e, t) {
	e.exports = "precision highp float;\nprecision highp int;\nattribute vec2 uv;\nattribute vec3 position;\nattribute vec3 normal;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform mat4 modelMatrix;\nuniform mat4 viewMatrix;\nuniform mat3 normalMatrix;\nuniform vec3 cameraPosition;\n\n\nvarying vec2 vUv;\n\nvoid main() {\n    vUv = uv;\n    gl_Position = vec4(position, 1.0);\n}\n"
}, function(e, t) {
	e.exports = "\nprecision highp float;\nprecision highp int;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform mat4 modelMatrix;\nuniform mat4 viewMatrix;\nuniform mat3 normalMatrix;\nuniform vec3 cameraPosition;\n\n\nvarying vec2 vUv;\nuniform sampler2D tScene;\n\nvoid main()\n{\n    gl_FragColor = texture2D(tScene, vUv);\n}\n"
}, function(e, t) {
	e.exports = "precision highp float;\nprecision highp int;\nattribute vec2 uv;\nattribute vec3 position;\nattribute vec3 normal;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform mat4 modelMatrix;\nuniform mat4 viewMatrix;\nuniform mat3 normalMatrix;\nuniform vec3 cameraPosition;\n\n\nvoid main() {\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}\n"
}, function(e, t) {
	e.exports = "precision highp float;\nprecision highp int;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform mat4 modelMatrix;\nuniform mat4 viewMatrix;\nuniform mat3 normalMatrix;\nuniform vec3 cameraPosition;\n\n\nuniform sampler2D tScene;\nuniform vec2 resolution;\n\nvoid main()\n{\n    vec2 uv = gl_FragCoord.xy / resolution;\n    vec3 color = texture2D(tScene, uv).rgb;\n\n    gl_FragColor.rgb = color;\n    gl_FragColor.a = 1.0;\n}\n"
}, function(e, t) {
	e.exports = "precision highp float;\nprecision highp int;\nattribute vec2 uv;\nattribute vec3 position;\nattribute vec3 normal;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform mat4 modelMatrix;\nuniform mat4 viewMatrix;\nuniform mat3 normalMatrix;\nuniform vec3 cameraPosition;\n\n\nvarying vec2 vUv;\n\nvoid main() {\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}\n"
}, function(e, t) {
	e.exports = "\nprecision highp float;\nprecision highp int;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform mat4 modelMatrix;\nuniform mat4 viewMatrix;\nuniform mat3 normalMatrix;\nuniform vec3 cameraPosition;\n\n\nuniform float time;\nuniform sampler2D frame1;\n\nvarying vec2 vUv;\n\nvec2 transformUV(vec2 uv, float a[9]) {\n    vec3 u = vec3(uv, 1.0);\n    mat3 mo1 = mat3(\n    1, 0, -a[7], 0, 1, -a[8], 0, 0, 1);\n    mat3 mo2 = mat3(\n    1, 0, a[7], 0, 1, a[8], 0, 0, 1);\n    mat3 mt = mat3(\n    1, 0, -a[0], 0, 1, -a[1], 0, 0, 1);\n    mat3 mh = mat3(\n    1, a[2], 0, a[3], 1, 0, 0, 0, 1);\n    mat3 mr = mat3(\n    cos(a[4]), sin(a[4]), 0, -sin(a[4]), cos(a[4]), 0, 0, 0, 1);\n    mat3 ms = mat3(\n    1.0 / a[5], 0, 0, 0, 1.0 / a[6], 0, 0, 0, 1);\n    u = u * mt;\n    u = u * mh;\n    u = u * mo1;\n    u = u * mr;\n    u = u * mo2;\n    u = u * mo1;\n    u = u * ms;\n    u = u * mo2;\n    return u.xy;\n}\nvec2 rotateUV(vec2 uv, float r) {\n    float a[9];\n    a[0] = 0.0;\n    a[1] = 0.0;\n    a[2] = 0.0;\n    a[3] = 0.0;\n    a[4] = r;\n    a[5] = 1.0;\n    a[6] = 1.0;\n    a[7] = 0.5;\n    a[8] = 0.5;\n    return transformUV(uv, a);\n}\nvec2 translateUV(vec2 uv, vec2 translate) {\n    float a[9];\n    a[0] = translate.x;\n    a[1] = translate.y;\n    a[2] = 0.0;\n    a[3] = 0.0;\n    a[4] = 0.0;\n    a[5] = 1.0;\n    a[6] = 1.0;\n    a[7] = 0.5;\n    a[8] = 0.5;\n    return transformUV(uv, a);\n}\nvec2 scaleUV(vec2 uv, vec2 scale) {\n    float a[9];\n    a[0] = 0.0;\n    a[1] = 0.0;\n    a[2] = 0.0;\n    a[3] = 0.0;\n    a[4] = 0.0;\n    a[5] = scale.x;\n    a[6] = scale.y;\n    a[7] = 0.5;\n    a[8] = 0.5;\n    return transformUV(uv, a);\n}\nvec2 scaleUV(vec2 uv, vec2 scale, vec2 origin) {\n    float a[9];\n    a[0] = 0.0;\n    a[1] = 0.0;\n    a[2] = 0.0;\n    a[3] = 0.0;\n    a[4] = 0.0;\n    a[5] = scale.x;\n    a[6] = scale.y;\n    a[7] = origin.x;\n    a[8] = origin.x;\n    return transformUV(uv, a);\n}\n\nvoid main()\n{\n    vec2 uv1 = rotateUV(vUv, time * 1.8);\n    float f1 = texture2D(frame1, uv1).r;\n\n    vec2 uv2 = rotateUV(vUv, -time * 1.25);\n    float f2 = texture2D(frame1, uv2).g;\n\n    vec2 uv3 = rotateUV(vUv, time * 2.7565);\n    float f3 = texture2D(frame1, uv3).b;\n\n    float f = min(1.0, f1 + f2 + f3);\n\n    vec3 color = vec3(0.95) * f;\n\n    gl_FragColor = vec4(color, f);\n}\n"
}, , , , , , function(e, t, n) {}, function(e, t, n) {}, function(e, t, n) {
	"use strict";
	n.r(t);
	n(23);
	var s = n(0),
		r = n(9),
		c = n(7),
		a = n(22),
		u = {
			main: null,
			rootUrl: null,
			appData: null,
			client: {
				browser: "",
				device: "",
				lang: "",
				os: "",
				sizes: {
					width: window.innerWidth,
					height: window.innerHeight
				},
				mousePosition: {
					x: 0,
					y: 0
				}
			}
		},
		i = n(11),
		l = n.n(i),
		m = (n(24), n(8)),
		o = n(6);
	var h = function e(t, n, i) {
			! function(e, t) {
				if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
			}(this, e), this.camera = t, this.mainUniforms = n, this.scene = new s.o, this.cubeTexture = 0 === i ? this.mainUniforms.texture1 : this.mainUniforms.texture2, this.scene.background = this.cubeTexture, this.pass = new o.a(this.scene, this.camera, !1, !1, !1), this.pass.clear = !1, this.pass.needsSwap = !1, this.pass.setSize = function(e, t) {}, this.pass.renderToScreen = !1
		},
		f = n(4),
		p = n(12),
		v = n.n(p),
		d = n(13),
		g = n.n(d),
		w = n(14),
		y = n.n(w),
		b = n(15),
		x = n.n(b),
		M = n(16),
		S = n.n(M),
		_ = n(17),
		P = n.n(_);

	function C(e, t) {
		for (var n = 0; n < t.length; n++) {
			var i = t[n];
			i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
		}
	}
	var k = function() {
			function r(e, t, n) {
				var i = this;
				! function(e, t) {
					if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
				}(this, r), this.camera = e, this.mainUniforms = t, this.scene = new s.o, this.createBg(), this.createPortal(), this.createPortalFrame(), this.pass = new o.a(this.scene, this.camera, !1, !1, !1), this.pass.clear = !1, this.pass.needsSwap = !1, this.pass.setSize = function(e, t) {
					i.portalMaterial.uniforms.resolution.value.x = e, i.portalMaterial.uniforms.resolution.value.y = t
				}, this.pass.renderToScreen = !1
			}
			var e, t, n;
			return e = r, (t = [{
				key: "createBg",
				value: function() {
					this.bgMaterial = new s.n({
						uniforms: {
							tScene: {
								value: null
							}
						},
						vertexShader: v.a,
						fragmentShader: g.a
					}), this.bgMaterial.depthWrite = !1, this.bgMaterial.depthTest = !1, this.bgMesh = new s.i(Object(f.a)(), this.bgMaterial), this.bgMesh.frustumCulled = !1, this.bgMesh.renderOrder = -5, this.scene.add(this.bgMesh)
				}
			}, {
				key: "createPortal",
				value: function() {
					var e = new s.e(this.mainUniforms.portalRadius, 70);
					this.portalMaterial = new s.n({
						uniforms: {
							tScene: {
								value: null
							},
							resolution: {
								value: new s.r
							}
						},
						vertexShader: y.a,
						fragmentShader: x.a
					}), this.portalMaterial.depthWrite = !1, this.portalMaterial.depthTest = !1, this.portalMesh = new s.i(e, this.portalMaterial), this.portalMesh.frustumCulled = !1, this.portalMesh.renderOrder = -4, this.scene.add(this.portalMesh)
				}
			}, {
				key: "createPortalFrame",
				value: function() {
					var e = new s.l(5.08, 5.08, 1, 1);
					this.frameMaterial = new s.n({
						uniforms: {
							frame1: {
								value: (new s.p).load("img/frame1.png")
							},
							time: {
								value: 0
							}
						},
						transparent: !0,
						vertexShader: S.a,
						fragmentShader: P.a
					}), this.frameMaterial.depthWrite = !1, this.frameMaterial.depthTest = !1, this.frameMesh = new s.i(e, this.frameMaterial), this.frameMesh.frustumCulled = !1, this.frameMesh.renderOrder = -3, this.scene.add(this.frameMesh)
				}
			}]) && C(e.prototype, t), n && C(e, n), r
		}(),
		T = n(18);
	var U = function e(t, n, i) {
		! function(e, t) {
			if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
		}(this, e), this.pass = new T.a(new s.r(window.innerWidth, window.innerHeight), n, t, i), this.pass.renderToScreen = !0
	};

	function j(e) {
		return (j = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
			return typeof e
		} : function(e) {
			return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
		})(e)
	}

	function z(e, t) {
		for (var n = 0; n < t.length; n++) {
			var i = t[n];
			i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
		}
	}

	function O(e) {
		return (O = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
			return e.__proto__ || Object.getPrototypeOf(e)
		})(e)
	}

	function V(e, t) {
		return (V = Object.setPrototypeOf || function(e, t) {
			return e.__proto__ = t, e
		})(e, t)
	}

	function A(e) {
		if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		return e
	}
	document;
	var D = "ontouchstart" in document,
		q = (document, document, function(e) {
			function o(e, t, n) {
				var i, r, a;
				return function(e, t) {
					if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
				}(this, o), r = this, (i = !(a = O(o).call(this, {
					eventHub: {},
					store: u,
					router: {
						resize: function() {}
					},
					url: e,
					client: t,
					appData: n,
					appType: "DESKTOP",
					templateFunction: l.a
				})) || "object" !== j(a) && "function" != typeof a ? A(r) : a).mainUniforms = {
					texture2: (new s.g).setPath("img/1/").load(["city_lf.png", "city_rt.png", "city_up.png", "city_dn.png", "city_ft.png", "city_bk.png"]),
					texture1: (new s.g).setPath("img/2/").load(["drakeq_lf.png", "drakeq_rt.png", "drakeq_up.png", "drakeq_dn.png", "drakeq_ft.png", "drakeq_bk.png"]),
					portalRadius: 2,
					lookAtRange: 3,
					bloomRadius: .42,
					bloomStr: .76,
					threshold: .8
				}, i._isFirefox = "firefox" === i.store.client.browser, i._isEdge = "edge" === i.store.client.browser || "explorer" === i.store.client.browser, i._mouseMultiplier = 1, i._touchMultiplier = 1, i._firefoxMultiplier = 33, i._edgeMultiplier = .4, i._generalMultiplier = 8e-5, i._generalTouchMultiplier = 5e-4, i.scrollAmount = 0, i.progress = {
					live: 0,
					total: 0
				}, i._touchStartValues = {
					x: 0,
					y: 0
				}, i.mousePosition = new s.r, i.prevMousePosition = new s.r, i.mousePositionAnimation = Object(c.b)(i.mousePosition, 1.5, {
					x: [0, 0, !1],
					y: [0, 0, !1]
				}, {
					immediate: !0,
					paused: !0,
					precision: 8,
					ease: "P4.out"
				}), i.animation = Object(c.b)(i.progress, 1.5, {
					live: [0, 0, !1]
				}, {
					immediate: !0,
					precision: 8,
					ease: "P4.out"
				}), i.events.add(document.querySelector("#app"), "wheel", i.onWheel, A(A(i))), i.events.add(document, "mousemove", i.move, A(A(i))), D && (i.events.add(document.querySelector("#app"), "touchstart", i._onTouchStart, A(A(i))), i.events.add(document.querySelector("#app"), "touchmove", i._onTouchMove, A(A(i)))), i
			}
			var t, n, i;
			return function(e, t) {
				if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
				e.prototype = Object.create(t && t.prototype, {
					constructor: {
						value: e,
						writable: !0,
						configurable: !0
					}
				}), t && V(e, t)
			}(o, a["a"]), t = o, (n = [{
				key: "move",
				value: function(e) {
					var t = e.targetTouches ? e.targetTouches[0] : e;
					this.store.client.mousePosition.x = t.clientX / this.store.client.sizes.width * 2 - 1, this.store.client.mousePosition.y = t.clientY / this.store.client.sizes.height * 2 - 1
				}
			}, {
				key: "onWheel",
				value: function(e) {
					var t = e.deltaY;
					this._isFirefox && 1 === e.deltaMode && (t *= this._firefoxMultiplier), this._isEdge && 100 < Math.abs(t) && (t *= this._edgeMultiplier), t *= this._mouseMultiplier, t *= this._generalMultiplier, this.scrollAmount += t, e.preventDefault()
				}
			}, {
				key: "_onTouchStart",
				value: function(e) {
					var t = e.targetTouches ? e.targetTouches[0] : e;
					this._touchStartValues.y = t.clientY
				}
			}, {
				key: "_onTouchMove",
				value: function(e) {
					var t = e.targetTouches ? e.targetTouches[0] : e,
						n = (this._touchStartValues.y - t.clientY) * this._touchMultiplier;
					this._touchStartValues.y = t.clientY, n *= this._generalTouchMultiplier, this.scrollAmount += n, e.preventDefault()
				}
			}, {
				key: "setup",
				value: function() {
					var t = this;
					this.renderer = new s.u({
						canvas: document.querySelector("canvas"),
						antialias: !1,
						transparent: !0
					}), this.renderer.setClearColor("#ffffff"), this.renderer.autoClear = !1, this.camera = new s.k(45, this.store.client.sizes.width / this.store.client.sizes.height, 1e-4, 100), this.camera.target = new s.s(0, -.5, 0), this.camera.position.set(0, 0, 10), this.camera.lookAt(this.camera.target), this.baseTarget = new s.s(0, -.5, 0), this.createCameraSpline(), this.effectComposerScene1 = new m.a(this.renderer), this.passScene1 = new h(this.camera, this.mainUniforms, 0), this.effectComposerScene1.addPass(this.passScene1.pass), this.effectComposerScene2 = new m.a(this.renderer), this.passScene2 = new h(this.camera, this.mainUniforms, 1), this.effectComposerScene2.addPass(this.passScene2.pass), this.effectComposerScenePortal = new m.a(this.renderer), this.passPortal = new k(this.camera, this.mainUniforms), this.passPortal.bgMaterial.uniforms.tScene.value = this.effectComposerScene1.readBuffer.texture, this.passPortal.portalMaterial.uniforms.tScene.value = this.effectComposerScene2.readBuffer.texture, this.effectComposerScenePortal.addPass(this.passPortal.pass), this.passBloom = new U(this.mainUniforms.bloomRadius, this.mainUniforms.bloomStr, this.mainUniforms.threshold), this.effectComposerScenePortal.addPass(this.passBloom.pass), this.prevCameraPosition = (new s.s).copy(this.camera.position), this._v0 = new s.r, this._v1 = new s.s, this._v2 = new s.s, this._v3 = new s.s, this.side = 0, Object(c.a)(-1, function() {
						if (t.mousePositionAnimation.pause().reset(), t.mousePositionAnimation._els[0].properties[0].from = t.mousePosition.x, t.mousePositionAnimation._els[0].properties[0].to = t.store.client.mousePosition.x, t.mousePositionAnimation._els[0].properties[1].from = t.mousePosition.y, t.mousePositionAnimation._els[0].properties[1].to = t.store.client.mousePosition.y, t.mousePositionAnimation.play(), t.updateScroll(), t.updateCamera(), (0 === t.side && t.camera.position.z < 0 && 0 <= t.prevCameraPosition.z || 1 === t.side && 0 <= t.camera.position.z && t.prevCameraPosition.z < 0) && (t._v0.x = t.camera.position.x, t._v0.y = t.camera.position.y, t._v0.length() <= t.mainUniforms.portalRadius)) {
							t.side = Math.abs(t.side - 1);
							var e = t.passScene1.cubeTexture;
							t.passScene1.cubeTexture = t.passScene2.cubeTexture, t.passScene1.scene.background = t.passScene2.cubeTexture, t.passScene2.cubeTexture = e, t.passScene2.scene.background = e, t.passPortal.portalMaterial.side = t.side, t.passPortal.frameMaterial.side = t.side
						}
						t.prevCameraPosition.copy(t.camera.position), t.passPortal.frameMaterial.uniforms.time.value += .005, t.effectComposerScene1.render(), t.effectComposerScene2.render(), t.effectComposerScenePortal.render()
					})
				}
			}, {
				key: "createCameraSpline",
				value: function() {
					this.cameraSpline = new s.d([new s.s(0, 0, 10), new s.s(1, 0, 5), new s.s(-1, 0, -5), new s.s(0, 0, -10), new s.s(1, 0, -5), new s.s(-1, 0, 5)], !0, "centripetal", .5)
				}
			}, {
				key: "updateScroll",
				value: function() {
					var e = this.progress.total + this.scrollAmount;
					e !== this.progress.live && (this.progress.total = e, this.scrollAmount = 0, this.animation.pause().reset(), this.animation._els[0].properties[0].from = this.progress.live, this.animation._els[0].properties[0].to = this.progress.total, this.animation.play())
				}
			}, {
				key: "updateCamera",
				value: function() {
					var e = this.progress.live % 1;
					this.cameraSpline.getPoint(e, this._v1), this.camera.position.copy(this._v1), this.camera.target.copy(this.baseTarget), this.camera.target.x = Math.sin(2 * Math.PI * (1 - e)) * this.mainUniforms.lookAtRange, this._v2.copy(this.camera.target).sub(this.camera.position), this._v3.copy(this._v2).cross(this.camera.up).normalize(), this._v2.cross(this._v3).normalize(), this.camera.target.add(this._v3.multiplyScalar(1.7 * this.mousePosition.x)), this.camera.target.add(this._v2.multiplyScalar(this.mousePosition.y)), this.camera.lookAt(this.camera.target)
				}
			}, {
				key: "createGui",
				value: function() {
					(new r.a).close()
				}
			}, {
				key: "resize",
				value: function(e, t) {
					this.renderer && (this.camera.aspect = this.store.client.sizes.width / this.store.client.sizes.height, this.camera.updateProjectionMatrix(), this.renderer.setSize(this.store.client.sizes.width, this.store.client.sizes.height), this.effectComposerScene1 && (this.effectComposerScene1.setSize(this.store.client.sizes.width, this.store.client.sizes.height), this.effectComposerScene2.setSize(this.store.client.sizes.width, this.store.client.sizes.height), this.effectComposerScenePortal.setSize(this.store.client.sizes.width, this.store.client.sizes.height)))
				}
			}]) && z(t.prototype, n), i && z(t, i), o
		}());
	"loading" !== document.readyState ? (new q).render() : document.addEventListener("DOMContentLoaded", function() {
		(new q).render()
	}, !1)
}]);