#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;


void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    // uv = fract(uv * 5.);
    vec2 id = floor(uv * 7.);
    vec3 color = vec3(1.);

    color = vec3(mod(id.y, 2.));


    gl_FragColor = vec4(color, 1.);
}