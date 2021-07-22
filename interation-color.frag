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

float Band(float p, float start, float end, float blur) {
    float step1 = smoothstep(start - blur, start + blur, p);
    float step2 = smoothstep(end + blur, end - blur, p);
    return step1 * step2;
}

float Rect(vec2 uv, float startX, float endX, float startY, float endY, float blur) {
    float h = Band(uv.x, startX, endX, blur);
    float v = Band(uv.y, startY, endY, blur);

    return v * h;
}
// 1.
/*
void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    vec2 st = uv;
    st.x = fract(uv.x * 2.);
    float id = floor(uv.x * 2.);
    st -= vec2(.1);
    vec3 brick = vec3(0.745, 0.678, 0.539);
    // uv /= 1.0;
    // uv.x *= fract(uv.x * 2.);
    
    float m = 1. - Rect(st, .3, .51, .3, .51, .001);
    vec3 color = mix(brick, vec3(.653, .918, .985), m);
    if(mod(id, 2.) >= 1. ) {
        color = mix(brick, vec3(.980, .576, .113), m);
    }
    // color *= vec3(step(uv.x, .85) * step(.15, uv.y));
    // color *= vec3(mix(WHITE, RED, mod(id, 2.)));


    gl_FragColor = vec4(color, 1.);
}
*/
/* v2
void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    uv.x = fract(uv.x * 3.);
    float c = 1. - smoothstep(1., 0., uv.y);
    uv -= .1;
    float m = Rect(uv, .2, .5, .1, .8, .001);
    vec3 color = vec3(c);

    color = mix(color, GREEN, m);


    gl_FragColor = vec4(color, 1.);
}
*/

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    vec3 bottom = vec3(0.325,0.278,0.209);
    vec3 top = vec3(0.497,0.364,0.565);
    vec3 brick = vec3(0.5608, 0.5294, 0.4784);
    vec3 c = mix(top, bottom, 1. - step(.5, uv.y));
    vec3 color = c;
    for(int i=0; i<2; i++) {
        float n = float(i) * .5;
        color = mix(color, brick, Rect(uv, .45, .55, .2 + n, .3 + n, .001));
    }
    // uv -= vec2(.5 , .0);
    // float m = Rect(uv, .45, .55, .2, .3, .001);
    // float m2 = Rect(uv, .45, .55, .7, .8, .001);

    
    // color = mix(color, brick, m2);
    gl_FragColor = vec4(color, 1.);
}

