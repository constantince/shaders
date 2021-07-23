#ifdef GL_ES
precision mediump float;

#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
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
#define PI              3.1415926535

const float width = .03;
float plot(vec2 st, float pct) {
    return step(pct - width, st.y) - step(pct, st.y);
}

float circle(vec2 st, float radius) {
    return smoothstep(radius, radius + .001, length(st));
}

void main() {

    vec2 uv = gl_FragCoord.xy / u_resolution;
    vec3 color = vec3(0.);
    uv.x -= .5;
    float radius = .2;
    float stripWidth = .04;
    vec3 colors[7];
    colors[0] = ORANGE;
    colors[1] = VIOLET;
    colors[2] = GREEN;
    colors[3] = BLUE;
    colors[4] = YELLOW;
    colors[5] = RED;
    colors[6] = WHITE;

    // float pct = pow(cos(PI * uv.x / 2.), .5);
    color = mix(WHITE, VIOLET, vec3(circle(uv, radius)));
    for(int i=0; i<7; i++) {
        float n = float(i);
        color = mix(color, colors[i], vec3(circle(uv, radius + n * stripWidth)));
    }
   gl_FragColor = vec4(color, 1.);
}