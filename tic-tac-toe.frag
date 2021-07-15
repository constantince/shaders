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
uniform vec2 u_mouse;

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

void main() {
    vec2 uv = gl_FragCoord.xy/ u_resolution;
    vec2 m = u_mouse / u_resolution;
    vec2 mouse = vec2(fract(m.x), fract(m.y));
    const float devidedFactor = 4.;
    float everyDevied = 1. / 4.;
    float width = everyDevied / 2.;
    vec3 color = vec3(0.);
   

    // uv.x = u_resolution.x / u_resolution.y;
    // 分成4 * 4
    // uv = fract(uv * 4.);

    vec2 id = floor(uv * 2.);

    if( mod(id, vec2(2.0)) == vec2(1.)){
        color *= BLACK;
    }

    // if(mod(uv.x, .25) > 1. ) {
    //     color *= RED;
    // }
    // float border = clamp(sin(u_time * 1.) - .8, .1, .2);
    const float border = .01;
    float r = step(uv.x, 1. - border);
    float l = 1. - step(uv.x, border);
    float c = l * r;

    float t = step(uv.y, 1. - border);
    float b = 1. - step(uv.y, border);

    c *= t * b;

    // color.rg = id;
  
    
    gl_FragColor = vec4(color, 1.);
    //  gl_FragColor = vec4(vec3(0., 1., 0.), 1.);
}