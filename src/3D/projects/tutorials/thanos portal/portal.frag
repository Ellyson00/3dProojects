uniform sampler2D texture;
uniform vec3 ambientLightColor;
uniform vec3 pointLightColor;
uniform vec3 pointLightPosition;
uniform float pointLightDistance;

varying vec2 vUv;
varying vec3 vPos;
varying vec3 vNormal;

struct PointLight {
  vec3 position;
  vec3 color;
  float decay;
};

uniform PointLight pointLights[NUM_POINT_LIGHTS];

void main() {
	 vec4 t = texture2D(texture, vUv * vec2(1, 1));
     vec3 c = t.rgb;
     vec4 addedLights = vec4(0.1, 0.1, 0.1, 1.0);
     for(int l = 0; l < NUM_POINT_LIGHTS; l++) {
           vec3 lightDirection = normalize(vPos - pointLights[l].position);
           t.rgb += clamp(dot(-lightDirection, vNormal), 0.0, 1.0) * pointLights[l].color * pointLights[l].decay;
      }
//     vec3 lightDirection = normalize(vPos - pointLights.position.xyz);
//     t.rgb += clamp(dot(-lightDirection, vNormal), 0.0, 1.0) * pointLights.color.rgb;
     gl_FragColor = t;
//     gl_FragColor = vec4(c*ambientLightColor,t.w);
}