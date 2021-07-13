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

float circle(vec2 uv, float radius) {
    float factor = sin(u_time*2.) + 3.;
    return 1. - smoothstep(radius, radius + .01, dot(uv, uv) * factor);
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    uv -= .5;

    uv.x *= u_resolution.x / u_resolution.y;

    vec3 color = vec3(circle(uv, .5));

    color *= RED;
    
    gl_FragColor = vec4(color, 1.);



}