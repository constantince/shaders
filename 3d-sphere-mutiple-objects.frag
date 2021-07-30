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
#define LIME            vec3(0.6824, 0.8392, 0.5216)
#define ACQUA           vec3(0.0, 1.0, 0.5)
#define VIOLET          vec3(0.5, 0.0, 1.0)
#define AZUR            vec3(0.0, 0.5, 1.0)

#define MAXSTEPS        255
#define START           0.0
#define END             100.0
#define PRECISION       0.001

uniform vec2 u_resolution;
uniform float u_time;

struct Surface {
    float sd;
    vec3 color;
};

Surface sdShere(vec3 p, float radius, vec3 offect, vec3 color) {
    return Surface(length(p - offect) - radius, color);
}

Surface flood(vec3 p, vec3 color) {
    return Surface(p.y + 1., color);
}

Surface mix_c(Surface obj1, Surface obj2) {
    if(obj1.sd < obj2.sd)  return obj1;
    return obj2;
}

Surface sdSence(vec3 p) {
    Surface s_l = sdShere(p, 1.0, vec3(2.5, 0.0, -2.0), YELLOW); // left sphere;
    Surface s_r = sdShere(p, 1.0, vec3(-2.5, 0.0, -2.5), BLUE);// right sphere;
    Surface f = flood(p, vec3(1. + .7* mod(floor(p.x)+floor(p.z), 2.0)));
    Surface res = mix_c(s_l, s_r);
    res = mix_c(res, f);
    return res;
}

Surface rayMarch(vec3 ro, vec3 rd, float start, float end) {
    float depth = start;
    Surface co;
    for(int i=0; i < MAXSTEPS; i++) {
        vec3 p = ro + rd * depth; // point to test
        co = sdSence(p);
        depth += co.sd;
        if( depth < PRECISION || depth > end) break;
    }

    return Surface(depth, co.color);
}

vec3 calcNormal(vec3 p) {
    vec2 e = vec2(1.0, -1.0) * 0.0005; // epsilon
    return normalize(
      e.xyy * sdSence(p + e.xyy).sd +
      e.yyx * sdSence(p + e.yyx).sd +
      e.yxy * sdSence(p + e.yxy).sd +
      e.xxx * sdSence(p + e.xxx).sd);
}

void main() {
    vec2 uv = (gl_FragCoord.xy - .5 * u_resolution.xy ) / u_resolution.y;

    vec3 ro = vec3(0.0, 0.0, 10.0);
    vec3 rd = vec3(uv.x, uv.y, -1.0);

    Surface ray = rayMarch(ro, rd, START, END);

    vec3 col;
    if(ray.sd > END) {
        col = LIME;
    } else {
       vec3 po = ro + rd * ray.sd;
       vec3 lightSource = vec3(2.0, 2.0, 10.0);
       vec3 normal = calcNormal(po);
       vec3 lightDirection = normalize(lightSource - po);
       float fDot = clamp(dot(normal, lightDirection), 0.0, 1.0);
       col = ray.color * fDot;
    }


    gl_FragColor = vec4(col, 1.);
}