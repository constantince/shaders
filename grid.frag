#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;


void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    uv = fract(uv * 8.);
    float a = step(uv.x, .9);
    float b = step(.1, uv.y);

    // float e = 1. - step(.9, uv.x);
    // a += step(.1, uv.x);
    // float b = step(.9, uv.y);
    float c = a * b;
    // float c = b * a;
    gl_FragColor = vec4(vec3(c), 1.);
}