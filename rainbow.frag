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

void main() {

   vec2 uv = gl_FragCoord.xy / u_resolution;
    vec3 color = vec3(0.);
    float pct = pow(cos(PI * uv.x / 2.), .5);
    // pct = 1.0 - pow(abs(uv.x), 2.);
    uv.y += .3;
    color = vec3(plot(uv, pct));
    uv.y += width;
    color += vec3(plot(uv, pct)) * YELLOW;
    uv.y += width;
    color += vec3(plot(uv, pct)) * RED;
    uv.y += width;
    color += vec3(plot(uv, pct)) * BLUE;
     uv.y += width;
    color += vec3(plot(uv, pct)) * ORANGE;
//    vec2 m = vec2(0.);
//    float c = distance(m, vec2(uv.x, uv.y));
//    vec3 c11 = vec3(mix(.2, .5, c));
//    c11 += vec3(step(c, .25)) * BLUE;
//    c11 += vec3(step(c, .30)) * ORANGE;
//    c11 += vec3(step(c, .35)) * ORANGE;
//    c11 += vec3(step(c, .40)) * RED;
//    c11 += vec3(step(c, .45)) * RED;
//    c11 += vec3(step(c, .5)) * AZUR;



   gl_FragColor = vec4(color, 1.);
}