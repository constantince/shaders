#ifdef GL_ES
precision mediump float;
#endif

#define MAX_STEPS   100
#define START       0.
#define END         50.
#define MIN_DIS     0.01
#define MAX_DIS     10.
#define PI          3.1415926535
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

struct Surface {
    vec3 color;
    float d;
};

mat2 rotate2D(float a) {
    return mat2(cos(a), -sin(a),sin(a), cos(a));
}

Surface sdBox(vec3 p, vec3 b, vec3 color) {
    vec3 q = abs(p) - b;
    return Surface(color, length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0));
}

Surface floor(vec3 p, vec3 color) {
    return Surface(color, p.y + 1.0);
}

Surface mix_c(Surface obj1, Surface obj2) {
    if(obj1.d < obj2.d) return obj1;
    return obj2;
}

Surface Sence(vec3 p) {
    Surface box = sdBox(p - vec3(0.0, .1, 0.0), vec3(.5, .5, .5), vec3(1.0, 0.0, 0.0));
    Surface fl = floor(p, vec3(mod(floor(p.x) + floor(p.z), 2.0) * 1.));
    return mix_c(box, fl);
}

Surface rayMarch(vec3 ro, vec3 rd) {
    float depth = START;
    Surface d;
    for(int i = 0; i < MAX_STEPS; i++) {
        vec3 p = ro + rd * depth;
        d = Sence(p);
        depth += d.d;
        if(depth < MIN_DIS || depth > END) break;
    }
    return Surface(d.color, depth);
}

vec3 calcNormal(vec3 p) {
    vec2 e = vec2(1.0, -1.0) * 0.0005; // epsilon

    return normalize(
      e.xyy * Sence(p + e.xyy).d +
      e.yyx * Sence(p + e.yyx).d +
      e.yxy * Sence(p + e.yxy).d +
      e.xxx * Sence(p + e.xxx).d);
}


void main() {
    vec2 uv = (gl_FragCoord.xy - .5 * u_resolution) / u_resolution.y;
    vec2 mouse = (u_mouse - .5 * u_resolution) / u_resolution.y;
    vec3 col;
    // create camera
    // vec3 ro = vec3(mouse.x, mouse.y, 5.0);
    vec3 ro = vec3(0.0, 0.0, 3.0);
    // ro.xy = rotate2D(u_time*PI) * ro.xy;
    
    vec3 rd = vec3(uv, -1.0);
    // rd = vec3(5.0, 0.0, 5.0);
    rd.xz *= rotate2D(mouse.x);
    rd.yz *= rotate2D(mouse.y);
    Surface sences = rayMarch(ro, rd);

    
    
    if(sences.d > MAX_DIS) {
        col = vec3(1.0);
    } else {
        vec3 p = ro + rd * sences.d;
        vec3 ls = vec3(0.0, 4.0, 5.0);
        vec3 normal = calcNormal(p);
        vec3 ld = normalize(ls - p);
        float fDot = clamp(dot(normal, ld), 0.7, 1.0);
        
        col = sences.color * fDot;
    }


    gl_FragColor = vec4(col, 1.);
}