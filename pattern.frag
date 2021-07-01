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
#define PI              3.1415926535

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

float random(in vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float noise(in vec2 st) {
     vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    
    // // uv -= .5;
    uv *= 20.;
    // uv = fract(uv);
    uv.x *= u_resolution.x / u_resolution.y;
    
    // vec3 color = vec3(1.0);
    // float c = Rect(uv, sin(u_time * .01), cos(u_time * .10));
    
    // color = vec3(c);

    vec2 pos = vec2(uv * 6.);

    float n = noise(pos);
    gl_FragColor = vec4(vec3(n), 1.0);

}