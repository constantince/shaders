#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

float len (vec3 ro, vec3 rd, vec3 p) {
    return length(cross(p - ro, rd) / length(rd));
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;

    vec3 ro = vec3(0.0, 0.0, -2.);
    vec3 rd = vec3(uv.x, uv.y, 0.0) - ro;
    vec3 p = vec3(sin(u_time), 0.0, cos(u_time) + .1);

    float c = len(ro, rd, p);

    c = smoothstep(.05, .04, c);

    gl_FragColor = vec4(vec3(c), 1.0);
}