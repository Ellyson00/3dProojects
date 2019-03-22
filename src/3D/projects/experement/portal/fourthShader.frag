precision highp float;
precision highp int;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat3 normalMatrix;
uniform vec3 cameraPosition;
uniform sampler2D tScene;
uniform vec2 resolution;
void main(){
    vec2 uv = gl_FragCoord.xy / resolution;
    vec3 color = texture2D(tScene, uv).rgb;
    gl_FragColor.rgb = color;
    gl_FragColor.a = 1.0;
}
