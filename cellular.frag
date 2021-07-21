#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    vec2 mouse = u_mouse / u_resolution;
    uv.x *= u_resolution.x / u_resolution.y;
    // uv = fract(uv * 5.);
    vec2 p[4];

    p[0] = vec2(.258, .2255);
    p[1] = vec2(.568, .985);
    p[2] = vec2(.168, .985);
    p[3] = mouse;

    float minFloat = 1.;
    float color = 0.;
    for(int i=0; i < 4; i++) {
        minFloat = min(minFloat, distance(p[i], uv));
    }

    color += minFloat;

    gl_FragColor = vec4(vec3(color), 1.);
}