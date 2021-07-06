#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    vec3 color = vec3(1.0);
    vec3 c = vec3(1.0); 
    if(uv.x < .2 && uv.y < .2) {
        c = vec3(0.);
    }
    

    color = c;
    gl_FragColor = vec4(color, 1.0);
}