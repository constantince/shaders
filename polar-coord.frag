#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

void main() {

    vec2 uv = gl_FragCoord.xy / u_resolution;
    uv -= .5;
    // st.x -PI ~ PI st.y 0~1
    vec2 st = vec2(atan(uv.x, uv.y), length(uv));

    float f = cos(st.x * .5) * 1.;

    gl_FragColor = vec4(vec3(f), 1.0);
}