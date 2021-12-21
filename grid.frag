#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    uv *= u_resolution.x / u_resolution.y;

    vec2 mouse = u_mouse / u_resolution;
    mouse *=  u_resolution.x / u_resolution.y;

    vec2 st = fract(uv * 8.0);
    vec2 curId = floor(uv * 8.0);
    vec2 mouse_scale = floor(mouse * 8.0);
    vec3 a = mix(vec3(0.85), vec3(1.0), step(st.x, .98));
    vec3 b = mix(vec3(0.85), vec3(1.0), step(st.y, .98));

    // float c = step(0.1, length(uv - mouse));
    vec3 col = a *b;
    if( mouse_scale == curId) {
        col *= vec3(1.0, 0.0, 0.0);
    }
    
    // gl_FragColor = vec4(b * a, 1.);

    gl_FragColor = vec4(col, 1.0);
}