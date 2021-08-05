#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

float plot(vec2 uv, float width) {
    return smoothstep(uv.x, uv.x, uv.y) - 
    smoothstep(uv.x + width, uv.x + width, uv.y);
}

void main() {
    vec2 uv = (gl_FragCoord.xy - .5 * u_resolution) / u_resolution.y;
    vec2 mouse = u_mouse / u_resolution;
    mouse *= u_resolution.x / u_resolution.y;
    mouse -= .5;
    // vec2 st = vec2(atan(uv.x, uv.y), length(uv));
    // float c;
    // // c = 1. - smoothstep(abs(mouse.y), abs(mouse.y), st.y);
    // uv = rotate2d(atan(-mouse.x, mouse.y)) * uv;
    // if(uv.x > 0. && uv.y > 0.) c =  plot(uv, .01);
    float p = abs(cross(vec3(uv + vec2(.5), 0.0), normalize(vec3(mouse + vec2(.5), 0.0))).z);
    float c = 1. - smoothstep(0.0, .001, p);

    

    gl_FragColor = vec4(vec3(c) ,1.);
}