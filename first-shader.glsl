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
#define ACQUA           vec3(0.1294, 0.3255, 0.2275)
#define VIOLET          vec3(0.5, 0.0, 1.0)
#define AZUR            vec3(0.2824, 0.5137, 0.7451)

void main() {
    
    vec2 uv = gl_FragCoord.xy / u_resolution.xy; // 0 <> 1
   
   float color = abs(sin(u_time));
   vec3 pct = vec3(uv.x, uv.y, 0.0);
    // vec3 color = vec3(mask);
    gl_FragColor = vec4(pct, 1.0);
}