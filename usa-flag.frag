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

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    // caculate the min pix in y axios;
    float d = fwidth(uv.y);
    vec3 c = mix(WHITE, RED, smoothstep(d, d, sin(uv.y * PI * 13.)));

    vec3 color = c;

    if(uv.x > .0 && uv.x < .5 && uv.y < 1. && uv.y > 0.46) {
        color = BLUE;
    }

    gl_FragColor = vec4(color, 1.);
}