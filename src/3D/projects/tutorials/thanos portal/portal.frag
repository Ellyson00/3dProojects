varying vec2 vUv;
varying vec3 vPos;
varying vec3 vNormal;

struct PointLight {
    vec3 position;
    vec3 color;
    float decay;
};

struct DirectionalLight {
    vec3 direction;
    vec3 color;
};

uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
uniform PointLight pointLights[NUM_POINT_LIGHTS];
uniform sampler2D texture;

void main() {
    vec4 addedLights = vec4(0.0, 0.0, 0.0, 1.);
    vec4 ddd = vec4(1., 1., 1., 1.);
    vec4 directLight = vec4(0.0, 0.0, 0.0, 1.0);
    vec4 t = texture2D(texture, vUv);
    for(int l = 0; l < NUM_POINT_LIGHTS; l++) {
        vec3 lightDirection = normalize(vPos - pointLights[l].position);
        addedLights.rgb += clamp(dot(lightDirection, -vNormal), 0.0, 1.0) * pointLights[l].color * pointLights[l].decay;
    }
    for(int k = 0; k < NUM_DIR_LIGHTS; k++) {
        vec3 lightDirection = directionalLights[k].direction;
        directLight.rgb += clamp(dot(lightDirection, vNormal), 0.0, 1.0) * directionalLights[k].color;
    }
    directLight.rgb =  mix( -vPos.zzz / 666., directLight.rgb, 0.7);
    if(vPos.z < -1211.){
        gl_FragColor = vec4(t.xyz * directLight.rgb * 1.6 * addedLights.rgb,  t.w);
    } else if(vPos.z < -1191.){
        gl_FragColor = vec4(t.xyz * directLight.rgb * 1.3 * addedLights.rgb,  t.w);
    } else if(vPos.z < -1181.){
        gl_FragColor = vec4(t.xyz * directLight.rgb * 1.0* addedLights.rgb ,  t.w);
    }  else if(vPos.z < -1178.){
        gl_FragColor = vec4(t.xyz * directLight.rgb * .9 * addedLights.rgb,  t.w);
    } else {
        gl_FragColor = vec4(t.xyz * directLight.rgb * .8 * addedLights.rgb ,  t.w);
    }
}