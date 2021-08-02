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

struct Surface {
    float d;
    vec3 color;
};

Surface flood (vec3 p, vec3 color) {
    return Surface(p.y + 1., color);
}

Surface compare(Surface obj1, Surface obj2) {
    if(obj1.d < obj2.d) return obj1;

    return obj2;
}

Surface sdRoundBox( vec3 p, vec3 b, vec3 offset, vec3 color )
{
  vec3 q = abs(p - offset) - b;
  return Surface(length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0), color);
}

Surface scene(vec3 p) {
    Surface f = flood(p, vec3(mod(floor(p.x) + floor(p.z), 2.0)));
    Surface box = sdRoundBox(p, vec3(1.), vec3(0.0, 1.0, -4.0), CYAN);
    // return box;
    return compare(f, box);
}

Surface carmera(vec3 ro, vec3 rd, float start, float end) {
    float depth = start;
    Surface d;
    for(int i=0; i<25; i++) {
        vec3 p = ro + rd * depth;
        d = scene(p);
        depth += d.d;
        if( depth < 0.01 || depth > 10.) break;
    }

    return Surface(depth, d.color);
}

vec3 calcNormal(in vec3 p) {
    vec2 e = vec2(1.0, -1.0) * 0.0005; // epsilon
    return normalize(
      e.xyy * scene(p + e.xyy).d +
      e.yyx * scene(p + e.yyx).d +
      e.yxy * scene(p + e.yxy).d +
      e.xxx * scene(p + e.xxx).d);
}


void main() {
    vec2 uv = (gl_FragCoord.xy - .5 * u_resolution) / u_resolution.y;
    vec3 col = vec3(1.);

    vec3 ro = vec3(0.0, 0.0, 5.0);
    vec3 rd = vec3(uv, -1.0);

    Surface ray = carmera(ro, rd, 0.0, 10.0);

    if( ray.d >= 10.0) {
        
    } else {
        vec3 p = ro + rd * ray.d;
        vec3 ls = vec3(10.0, 10.0, 10.0);
        vec3 normal = calcNormal(p);
        vec3 ld = normalize(ls - p);
        float fDot = clamp(dot(ld, normal), 0.0, 1.0);
        col = fDot * ray.color;
       
    }


    


    gl_FragColor = vec4(col, 1.);
}