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

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    uv.x *= u_resolution.x / u_resolution.y;
    float devided = 2.;
    // 注意先后顺序 必须要在分割之前
    float id = floor(uv.x * devided);
    uv = fract(uv * devided);
    uv -= .5;

    //
    if(mod(id, 2.0) == 1.0) {
       
    }
   

    vec2 st = vec2(atan(uv.x, uv.y), length(uv));
   
    float c = 1.0 - smoothstep(.25, .28, st.y);
    vec3 color = vec3(c);
    
    if(mod(id, 2.0) == 1.0) {
        color *= AZUR;
    }
   


    gl_FragColor = vec4(color, 1.);

}