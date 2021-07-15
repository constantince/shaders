#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;


void main() {

    vec2 uv = gl_FragCoord.xy / u_resolution;

    uv -= .5;

    vec2 st = vec2(atan(uv.x, uv.y), length(uv));

    vec2 r = abs(uv.xy);
// r = abs(st);

    // r = uv;
    float s = step(.2, max(r.x, r.y));
    s = max(r.x, r.y);
    gl_FragColor = vec4(vec3(step(.4, s) * step(s, .42)), 1.);
}