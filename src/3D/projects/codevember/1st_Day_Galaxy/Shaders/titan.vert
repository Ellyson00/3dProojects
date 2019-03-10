uniform float delta;
	uniform float radius;
	uniform float time;
	uniform sampler2D texture;
	varying vec3 vNormal;

	varying vec2 vUv;
	varying vec3 p;

	void main()
	{
		p = position;

		// Specify the axis to rotate about:
		float x = 0.0;
		float y = 1.0;
		float z = 0.0;

		vNormal = normal;

		// Specify the angle in radians:
		float angle = 90.0 * 3.14 / 180.0 + time * 15.; // 90 degrees, CCW

		// rotate
		vec3 q;
		vNormal.x = q.x = p.x * (x*x * (1.0 - cos(angle)) + cos(angle))
    	+ p.y * (x*y * (1.0 - cos(angle)) + z * sin(angle))
    	+ p.z * (x*z * (1.0 - cos(angle)) - y * sin(angle));

		vNormal.y = q.y = p.x * (y*x * (1.0 - cos(angle)) - z * sin(angle))
			 + p.y * (y*y * (1.0 - cos(angle)) + cos(angle))
			 + p.z * (y*z * (1.0 - cos(angle)) + x * sin(angle));

		vNormal.z = q.z = p.x * (z*x * (1.0 - cos(angle)) + y * sin(angle))
			 + p.y * (z*y * (1.0 - cos(angle)) - x * sin(angle))
			 + p.z * (z*z * (1.0 - cos(angle)) + cos(angle));

		vUv = uv;

		p.x = q.x += (time*0.03+200.0)*cos(time) + 50.;
		p.z = q.z += (time*0.03+200.0)*sin(time);
		p.y = q.y += 70.0 + 60. * cos(time);

		gl_Position = projectionMatrix * modelViewMatrix * vec4(q, 1.0);
	}