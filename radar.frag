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


float px = 0.005;

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}
mat2 scale(vec2 _scale){
    return mat2(_scale.x,0.0,
                0.0,_scale.y);
}

float circle (vec2 st, float radius) {
    return smoothstep(radius, radius + radius * px, length(st));
}

float plot(vec2 st, float radius, float blur) {
    return smoothstep(radius, radius + px, length(st))
        - smoothstep(radius + blur, radius + blur + px, length(st));
}

float line(vec2 st, float width) {
    return smoothstep(st.x, st.x + px, st.y) - smoothstep(st.x + width, st.x + width+ px, st.y);
}

float line3(vec2 st, float width ) {
    float m = st.x;
    float q = st.y;
    // st *= rotate2d(sin(u_time) * 3.1415926535);
    return smoothstep(m, m+ px, q) - smoothstep(m + width, m + width + px, q);
}

float line2(vec2 st, float width) {
    return smoothstep(-st.x, -st.x+ px, st.y) - smoothstep(-st.x + width, -st.x + width+ px, st.y);
}

vec2 random(float a, float b, float c, float d, float t) {
    return vec2(a*cos(t)+b*cos(0.1*(t)), c*sin(t)+d*cos(0.1*(t)));
}

#define blue1 vec3(0.74,0.95,1.00)
#define blue2 vec3(0.87,0.98,1.00)
#define blue3 vec3(0.35,0.76,0.83)
#define blue4 vec3(0.953,0.969,0.89)
#define red   vec3(1.00,0.38,0.227)

vec3 trangle(vec2 uv, vec2 po, float rotate) {
    uv += po;
    uv = rotate2d(radians(rotate)) * uv;
    uv = scale(vec2(12., 10.)) * uv;
    uv.y -= sin(u_time);
    float c = 1. - step(uv.x, uv.y);
    float b = step(uv.y, -uv.x);
    float d = 1. - step(uv.y, -.2);
    vec3 color = vec3(b * c * d);
    return color;
}

vec3 target (vec2 uv) {
    uv /= .5;
    uv += random(0.63,-0.1,0.2,0.2,.2+sin(0.1*u_time)+0.5*u_time);
    float c = plot(uv, .05, .01);
    vec3 color = vec3(c);
    color *= red;

    // yellow inside circle
    float y =  1. - circle(uv, .04 * step(.5, sin(u_time * 25.) + .5));
    color += y * red;

    float wave = plot(uv, mod(u_time * .20, .3) + .05, .03);
    color += wave * RED;

    return color;
}

float baseCirleWidth = .003;
void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    uv *= u_resolution.x / u_resolution.y;
    uv -= .5;
    
    vec2 polar = vec2(atan(uv.x, uv.y), length(uv));
    vec3 color = vec3(0.);


    float cross1 = line(uv, .001);
    float cross2 = line2(uv, .001);
    if(abs(uv.x) <= .3*cos(radians(45.))) {
        color += vec3(cross1 + cross2);
    }

   
    color += target(uv);

    // color = mix(color, BLACK, color);

    float c0 = plot(uv, .01, baseCirleWidth - .001);
    color += c0 * blue1;

    float c1 = plot(uv, .1, baseCirleWidth - .001);
    color += c1 * blue2;

    float c2 = plot(uv, .2, baseCirleWidth - .001);
    color += c2 * blue3;

    float c3 = plot(uv, .3, baseCirleWidth);
    color += c3 * blue4;


    float c4 = plot(uv, .35, baseCirleWidth - .001);
    if(abs(uv.y) >= (abs(sin(u_time)) + 1.) * .1)
        color += c4 * CYAN;

    float c5 = plot(uv, .45, baseCirleWidth);
    color += c5 * CYAN;
    if(abs(uv.y) <= (abs(uv.x) * .05) && abs(uv.x) > .45) {
        color = vec3(0.);
    }

    if(abs(uv.x) <= (abs(uv.y) * .05) && abs(uv.y) > .45) {
        color = vec3(0.);
    }

    vec3 t = trangle(uv, vec2(-.5, 0.), 90.);
    color += t;

    vec3 q = trangle(uv, vec2(.5, 0.), 270.);
    color += q;

    vec3 top = trangle(uv, vec2(.0, 0.5), 0.);
    color += top;

    vec3 left = trangle(uv, vec2(.0, -0.5), 180.);
    color += left;

   uv = rotate2d(-u_time - 1.20) * uv;
//    uv.y += .2 * radians(-45.);
   float scaner = line3(uv, .005);
    // scaner = rotate2d(sin(u_time) * 3.141592) * scaner;
   if(abs(uv.x) <= .3*cos(radians(45.)) && uv.x >= 0.) {
        color += scaner * blue3;
    }


    polar.x -= u_time;
    polar.x = mod(polar.x, radians(360.));

    float shadow = 
    smoothstep(polar.x, polar.x + radians(2.) + px, 2.) -
    smoothstep(polar.x + radians(5.), polar.x + radians(70.) + radians(5.), 2.);
    float u = 1. - smoothstep(.3, .31, polar.y);
    vec3 vator = vec3(u * shadow * blue3);
    color += vator;


    gl_FragColor = vec4(color, 1.);
    
}

float niddle(vec2 st) {
    return smoothstep(st.x, st.x, sin(u_time * .5) * PI);
}

