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
#define PI               3.1415926535
mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

float circle (vec2 st, float radius) {
    return smoothstep(radius, radius + radius * .001, length(st));
}

float plot(vec2 st, float radius, float blur) {
    return smoothstep(radius, radius, length(st))
        - smoothstep(radius + blur, radius + blur, length(st));
}

float line(vec2 st, float width) {
    return smoothstep(st.x, st.x, st.y) - smoothstep(st.x + width, st.x + width, st.y);
}

float line3(vec2 st, float width ) {
    // st *= rotate2d(sin(u_time) * 3.1415926535);
    return smoothstep(st.x, st.x, st.y) - smoothstep(st.x + width, st.x + width, st.y);
}

float line2(vec2 st, float width) {
    return smoothstep(-st.x, -st.x, st.y) - smoothstep(-st.x + width, -st.x + width, st.y);
}

vec3 target (vec2 uv) {
    uv /= .5;
    uv += vec2(cos(u_time), sin(u_time)) * .1;
    float c = plot(uv, .05, .01);
    vec3 color = vec3(c);
    color *= RED;

    // yellow inside circle
    float y =  1. - circle(uv, .04 * step(.5, sin(u_time * 25.) + .5));
    color += y * YELLOW;

    float wave = plot(uv, mod(u_time * .20, .3) + .05, .03);
    color += wave * RED;

    return color;
}

float baseCirleWidth = .003;
/*
void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    uv -= .5;

    vec2 polar = vec2(atan(uv.x, uv.y), length(uv));
    vec3 color = vec3(0.);


    float cross1 = line(uv, .003);
    float cross2 = line2(uv, .003);
    if(abs(uv.x) <= .3*cos(radians(45.))) {
        color += vec3(cross1 + cross2);
    }

   
    // color += target(uv);
    float c1 = plot(uv, .1, baseCirleWidth - .001);
    color += c1 * CYAN;

    float c2 = plot(uv, .2, baseCirleWidth - .001);
    color += c2 * CYAN;

    float c3 = plot(uv, .3, baseCirleWidth);
    color += c3 * WHITE;


    float c4 = plot(uv, .35, baseCirleWidth - .002);
    if(abs(uv.y) >= (abs(sin(u_time)) + 1.) * .1)
        color += c4 * CYAN;

    float c5 = plot(uv, .45, baseCirleWidth);

    color += c5 * CYAN;


    float scaner = line3(uv, .005);
    // scaner = rotate2d(sin(u_time) * 3.141592) * scaner;
   if(abs(uv.x) <= .3*cos(radians(45.))) {
        color += scaner * RED;
    }

    gl_FragColor = vec4(color, 1.);
    
}
*/

float niddle(vec2 st) {
    return step(st.x, sin(u_time) * PI);
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    uv -= .5;

    vec3 color = vec3(0.);
    vec2 polar = vec2(atan(uv.x, uv.y), length(uv));

    float n = niddle(polar);
    if(polar.y <= .3)
        color = vec3(n);

    gl_FragColor = vec4(color, 1.);
}