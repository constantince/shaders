#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    const float factor = 3.;
    vec3 color = vec3(0.);
    vec2 id = floor(uv * factor);
    float c =  mod(id.x+id.y, 2.);
    /* do the same things
    if(m == vec2(1.0, 0.)
        || m == vec2(0., 1.)
     ) {
        color = vec3(1.0);
    }
    */
    color = vec3(c);
    gl_FragColor = vec4(color, 1.0);
}