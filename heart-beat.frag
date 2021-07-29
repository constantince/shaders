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


float sphere(vec3 p, float radius) {
    return length(p) - radius;
}

float rayMarch(vec3 ro, vec3 rd, float start, float end) {
    float depth = start;
    for(int i=0; i<255; i++) {
        vec3 p = start + depth * rd;
        float d = sphere(p, 1.);
        depth += d;
        if(d < 0.001 || depth > 100.) break;
    }

    return depth;
}

float makeHeart(vec2 uv, float size) {
    float x = uv.x;
    float y = uv.y;
    float xx = dot(x, x);
    float yy = dot(y, y);
    float yyy = yy * y;
    float group = xx + yy - size;
    return group * dot(group , group) - xx * yyy;
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    uv -= .5;
    uv.x *= u_resolution.x / u_resolution.y;

    float c = makeHeart(uv, .04 * abs(sin(u_time * 4.)) * 1.5 + .05) ;

    vec3 color = mix(RED, WHITE, step(0., c));

    gl_FragColor = vec4(color, 1.);
}