#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

void main() {
    vec2 uv = 6. * gl_FragCoord.xy / u_resolution;

    for(int n=1; n < 10; n++) {
        float i = float(n);
        uv += vec2(.7 / i * sin(i * uv.y + u_time + .3 * i) + .8, .4 / i *  sin(uv.x + u_time + .3 * i) + 1.6);
    }

    // uv += vec2(.7 / sin(uv.y + u_time + .3) + .8, .4 / sin(uv.x + u_time + .3) + 1.6); 

    vec3 color = vec3(.5 * sin(uv.x) + .5, .5 * sin(uv.y) + .5, sin(uv.x + uv.y));

    gl_FragColor = vec4(color, 1.);
}