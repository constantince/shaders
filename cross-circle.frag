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

const vec2 factor = vec2(10., 10.);
float circle(float radius, vec2 uv) {
    uv -= .5;
    float c = smoothstep(radius, radius + radius * .1, dot(uv, uv));
    return c;

}

vec2 brickTile(vec2 _st, float _zoom) {
   
    _st *= _zoom;
    // _st.x += step(1., mod(_st.y, 2.0)) * 2.;
    // _st.x += step(1., mod(_st.y, 2.0));

    float t = mod(u_time, 2.) > 1. ? u_time * 1. : 0.;
    float t1 = mod(u_time, 2.) < 1. ? u_time * 1. : 0.;
    //euqal effect==================>float t = fract(u_time) > .5 === mod(u_time, 2.) > 1.

    if(mod(_st.y, 2.0) < 1.) {
        _st.x += t;
    } else {
        _st.x -= t;
    }


    if(mod(_st.x, 2.0) < 1.) {
        _st.y += t1;
    } else {
        _st.y -= t1;
    }

    return fract(_st);

}


void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    uv.x *= u_resolution.x / u_resolution.y;
    vec3 color = vec3(1.);
   
    /*
        Plan A
    */
    // float devided = 2.;
    // // 注意先后顺序 必须要在分割之前
    // float id = floor(uv.x * devided);
    // uv = fract(uv * devided);
    // uv -= .5;

    // //
    // if(mod(id, 2.0) == 1.0) {
       
    // }
   

    // vec2 st = vec2(atan(uv.x, uv.y), length(uv));
   
    // float c = 1.0 - smoothstep(.25, .28, st.y);
    // vec3 color = vec3(c);
    
    // if(mod(id, 2.0) == 1.0) {
    //     color *= AZUR;
    // }

    /*
        Plan B
    */


   uv = brickTile(uv, 20.0);

   color = vec3(circle(.05, uv));


    gl_FragColor = vec4(color, 1.);

}