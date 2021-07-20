#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;


void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;

    vec3 color = vec3(0.);

    float c = mod(uv.y, 2.0);

    color = vec3(c);

    gl_FragColor = vec4(color, 1.);

}