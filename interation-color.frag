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

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    vec2 st = uv;
    st.x = fract(uv.x * 2.);
    float id = floor(uv.x * 2.);
    st -= vec2(.1);
    // uv /= 1.0;
    // uv.x *= fract(uv.x * 2.);
    
    float m = Rect(st, .3, .51, .3, .51, .001);
    vec3 color = mix(RED, GREEN, step(m, .1));
    // color *= vec3(step(uv.x, .85) * step(.15, uv.y));
    color *= vec3(mix(vec3(0.5608, 0.4392, 0.1725), RED, mod(id, 2.)));


    gl_FragColor = vec4(color, 1.);
}