#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

/* Color palette */
#define BLACK           vec3(0.0, 0.0, 0.0)
#define WHITE           vec3(1.0, 1.0, 1.0)
#define RED             vec3(178., 34., 52) / 255.
#define BLUE           vec3(60., 59.0, 110.0) /255.
#define YELLOW          vec3(1.0, 1.0, 0.0)
#define CYAN            vec3(0.0, 1.0, 1.0)
#define MAGENTA         vec3(1.0, 0.0, 1.0)
#define ORANGE          vec3(1.0, 0.5, 0.0)
#define PURPLE          vec3(1.0, 0.0, 0.5)
#define LIME            vec3(0.5, 1.0, 0.0)
#define ACQUA           vec3(0.0, 1.0, 0.5)
#define VIOLET          vec3(0.5, 0.0, 1.0)
#define AZUR            vec3(0.0, 0.5, 1.0)

#define PI            3.1415926535


vec2 Remap(vec2 p, float t, float r, float b, float l) {
    return vec2((p.x - l) / (r - l), (p.y - b) / (t - b));
}


void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    // uv *= 1.1;
    float t = uv.x * 7. - 2. * u_time + uv.y * 3.;
    uv.y +=  sin( t ) * .05;
    // caculate the min pix in y axios;
    float d = 0.01;
    vec3 c = mix(WHITE, RED, smoothstep(d, d, sin(uv.y * PI * 13.)));

    vec3 color = c;

    vec2 st = Remap(uv, 1., .4, .46, 0.);

    if(st.x > .0 && st.x <= 1. && st.y <= 1. && st.y > 0.) {
        color = BLUE;
    }

    color *= smoothstep(d, .0, abs(uv.y - .5) - .5 + d);


    color *= .7 + cos(t) * .3;
    gl_FragColor = vec4(color, 1.);
}