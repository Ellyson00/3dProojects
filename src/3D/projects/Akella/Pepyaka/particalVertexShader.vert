uniform float time;

void main() {
  vec3 p = position;
  p.y += 0.1 * (sin(p.y * 5. + time / 20.) * 0.5 + 0.5 ) ;
  p.z += 0.05 * (sin(p.z * 10. + time / 20.) * 0.5 + 0.5 ) ;

  vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
  gl_PointSize = 3. * (1. / - mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}