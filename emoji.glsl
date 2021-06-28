/* Main function, uniforms & utils */
#ifdef GL_ES
    precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;


    gl_FragColor = vec4(uv, .5+.5*sin(u_time), 1.0);
}