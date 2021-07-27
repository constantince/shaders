#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

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

float sdf_circle(vec2 uv, float radius) {
    return length(uv) - radius;
}

float sdf_squard(vec2 uv, float size, vec2 offset) {
    uv -= offset;
    return max(abs(uv.x), abs(uv.y)) - size;
}

float smin(float a, float b, float k) {
    float h = clamp(.5 + .5 * (b-a)/k, .0, 1.);
    return mix(b, a, h) - k*h*(1.0-h);
}

float smax(float a, float b, float k) {
    return -smin(-a, -b, k);
}

float opSym(vec2 p, float r) {
    p.y = abs(p.y);
    return sdf_circle(p, r);
}

float opDisplace(vec2 p, float r) {
    float d1 = sdf_circle(p, .1);
    float s = .5;
    float d2 = sin(s * p.x * 1.8);

    return d1 + d2;
}

mat2 rotate2d(float angle) {
    return mat2(
    cos(angle), -sin(angle),
    sin(angle), cos(angle)
    );
}

mat2 scale2d(vec2 s) {
    return mat2(
        s.x, 0.,
        0., s.y
    );
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    uv *= u_resolution.x / u_resolution.y;
    uv -= .5;

    vec3 background = mix(MAGENTA, AZUR, uv.y + .5);
    vec3 color = background;
    // uv += vec2(sin(u_time), cos(u_time)) * .2;
    float s1 = opSym(uv, .1);
    float s2 = sdf_squard(uv, .1, vec2(.1, 0.));
    float shape;
    // combine two shapes
    shape = min(s2, s1);
    // clip the previous shape by the next;
    shape = max(s2, s1);
    // clip the next shape by the previous
    shape = max(s2, -s1);
    // clip the first shape by the next one
    shape = max(-s2, s1);
    // an exclusive "OR" operation will take the parts of the two shapes that do not intersect with each other.
    shape = max(min(s1, s2), -max(s1, s2));
    // smooth union
    shape = smin(s1, s2, .05);
    // smooth union
    shape = smax(s1, s2, .05);
    
    shape = smoothstep(0., .005, shape);// xor

    float t = (abs(sin(u_time * .5)) + 1.) * 2.;
    uv = scale2d(vec2(t, t)) * uv;
    shape = opDisplace(uv, .1);

    shape = smoothstep(0., 0.01, shape);

    color = mix(RED, color, shape);

    

    // color = mix(RED, color, squard);

    gl_FragColor = vec4(color, 1.);
}