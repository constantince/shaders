#version 300 es

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
out vec4 FragCoor;

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
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;

    uv -= vec2(.5);
    uv /= 1.0;
    float x = uv.x;

    float m = sin(x * 5.0) * .2;

    float y = uv.y - m;

    // x += y * .2;
    float blur = .01;
    float pct = Rect(vec2(x, y), -.3, .3, -.2, .2, blur);

    vec3 color = pct * YELLOW;

    FragCoor = vec4(color, 1.0);
}