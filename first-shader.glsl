#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

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

float Circle(vec2 uv, float radius, vec2 p, float blur) {
    uv -= p;               // -0.5 <> 0.5
    uv.x *= u_resolution.x / u_resolution.y;
    float d = length(uv);
    float pct = smoothstep(radius, radius-blur, d);
    return pct;
}

void main() {
    
    vec2 uv = gl_FragCoord.xy / u_resolution.xy; // 0 <> 1
   
    float mask = Circle(uv, .1, vec2(.5), .005); // create face;
    mask -= Circle(uv, .01, vec2(.4, .52), .005); // add new eyes;
    mask -= Circle(uv, .01, vec2(.6, .52), .005);

    float mouth = Circle(uv, .05, vec2(.5, .47), 0.01);
    mouth -= Circle(uv, .05, vec2(.5, .48), 0.01); 

    mask -= mouth;

    vec3 color = YELLOW;
    color *= mask;
    // vec3 color = vec3(mask);
    gl_FragColor = vec4(color, 1.0);
}