#ifdef GL_ES
precision mediump float;
#endif

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
#define ACQUA           vec3(0.1294, 0.3255, 0.2275)
#define VIOLET          vec3(0.5, 0.0, 1.0)
#define AZUR            vec3(0.2824, 0.5137, 0.7451)


uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

float Band(float c, float start, float end) {
    float step1 = smoothstep(start, end, c);
    float step2 = smoothstep(start, end, 1.0 - c);
    return step1 * step2;
}

float Rect(vec2 coord, float width, float height) {
    width = (1.0 - width ) / 2.0;
    height = (1.0 - height ) / 2.0;
    float step1 = Band(coord.x, width, width);
    float step2 = Band(coord.y, height, height);
    return step1 * step2;
}

vec3 makeOneStrip(float a, float start, float end, vec3 colors) {
    float stripV = smoothstep(start, start, a);

    vec3 color = vec3(stripV);

    color *= colors;

    float strip1 = smoothstep(end, end, a);

    color -= strip1 * color;

    return color;
}

const vec2 grid = vec2(50);

void main() {

    vec2 uv = gl_FragCoord.xy;
    vec2 m = mod(uv, vec2(100., 100.));
    vec3 color = BLACK;

    if( m.x < grid.x && m.y < grid.y || m.x >= grid.x && m.y>= grid.y) {
        color = WHITE;
    }

    gl_FragColor = vec4(color, 1.);
}