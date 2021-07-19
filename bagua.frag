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

float random (vec2 uv) {
    return fract(sin(dot(uv.xy, vec2(653428.25, 25165.25))) * 15478.);
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    uv.y -= .5;
    uv.x *= u_resolution.x / u_resolution.y;
    const float factor = 40.;
    const float maxs = 20. - 1.;
    const float mins = -20.;
    vec2 f = uv * factor;
    vec2 st = fract(f);
    vec2 id = floor(f);
    vec3 color = vec3(1.);
    // float v = min(factor - 1., floor(u_time * 20.));
    // v = mod(v, 2.) == 0. ? v: 0.;
    float v = floor((sin(u_time * 1.5)) * factor * 1.5);

    if(id.y == maxs && v >= maxs - 1. && v - maxs == id.x) {
        color = RED;
    }

    if(id.y == -20. && v < -20. && abs(v) - maxs == id.x) {
        color = RED;
    }
    


    float v1 = min(maxs, v);
    v1 = max(mins, v);

    float h = floor(abs((sin(u_time) + 1.) * .5) * factor);
    h = 0.;
    // h = mod(h, 2.) >= 1. ? h: 0.;

    

    if(0. == id.x && v1 == id.y) {
        color = RED;
    }

  

    // if(v == factor - 1. && 0. == id.x && id.y == v) {
    //     color = RED;
    // }

    // if(0. == id.y && h == id.x) {
    //     color = vec3(0.);
    // }

    // if( 0. == id.x && (v == factor - 1. || v == 0.) && id.y == v) {
    //      color = vec3(1., 0., 0.);
    // }

    // if(0. == id.x && h == id.y) {
    //      color = vec3(0.);
    // }

    

    // if(0. == id.x && v + 1. == id.y) {
    //     color = vec3(1., 0., 0.);
    // }


    // color = vec3(mod(id.y, 2.));

    // color = vec3(id.x + id.y);

    // color = vec3(fract((id.x*id.y) * random(uv)));
    // color = mix(vec3(1.), vec3(0.), color);
    // color = vec3(random(id));

    gl_FragColor = vec4(color, 1.);
}