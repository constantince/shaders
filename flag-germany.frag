#ifdef GL_ES
precision mediump float;
#endif

/* Color palette */
#define BLACK           vec3(0.0, 0.0, 0.0)
#define WHITE           vec3(1.0, 1.0, 1.0)
#define RED             vec3(1.0, 0.0, 0.0)
#define GREEN           vec3(0.0, 1.0, 0.0)
#define BLUE            vec3(0.0, 0.0, 1.0)
#define YELLOW          vec3(1.0, 1.0, 0.0)
#define CYAN            vec3(0.0, 1.0, 1.0)
#define MAGENTA         vec3(1.0, 0.0, 1.0)
#define ORANGE          vec3(1.0, 0.5, 0.0)
#define PURPLE          vec3(1.0, 0.0, 0.5)
#define LIME            vec3(0.5, 1.0, 0.0)
#define ACQUA           vec3(0.0, 1.0, 0.5)
#define VIOLET          vec3(0.5, 0.0, 1.0)
#define AZUR            vec3(0.0, 0.5, 1.0)

uniform vec2 u_resolution;
uniform float u_time;


void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;

    // uv = fract(uv * 3.);

    const float size = 1.0 / 3.;
    float v = 1. - step(1. - size, uv.y);

    vec3 color = vec3(v);

    color *= RED;

    float m = 1. - step(size, uv.y);

    color += m * YELLOW;

    gl_FragColor = vec4(color, 1.);
}