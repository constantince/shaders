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
#define MAX_STEP        30
#define START           0.0
#define END             10.0
#define MIN_PRECISION   0.01

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;


struct Items {
    float d;
    vec3 color;
};

mat2 rotate2D(float a) {
    return mat2(cos(a), -sin(a), sin(a), cos(a));
}

Items sdFloor(vec3 p, vec3 color) {
    return Items(p.y + 1.0, color);
}

Items sdBox(vec3 p, vec3 offset, vec3 b, vec3 color) {
    vec3 q = abs(p - offset) - b;
    return Items(length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0), color);
}

Items findMin(Items obj1, Items obj2) {
    if(obj1.d < obj2.d) return obj1;
    return obj2;
}

Items assembleItems(vec3 p) {
    vec3 size = vec3(.5);
    Items box1 = sdBox(p, vec3(1.5, 0.1, 0.0), vec3(size), RED);
    Items box2 = sdBox(p, vec3(0.0, 0.1, 0.0), vec3(size), GREEN);
    Items box3 = sdBox(p, vec3(-1.5, 0.1, 0.0), vec3(size), BLUE);
    vec3 fCol = vec3(mod(floor(p.x) + floor(p.z), 2.0) * .8);
    Items flo = sdFloor(p, fCol);

    Items tar = findMin(box1, box2);
    tar = findMin(tar, box3);
    tar = findMin(tar, flo);


    return tar;
}

vec3 calcNormal(vec3 p) {
    vec2 e = vec2(1.0, -1.0) * 0.0005; // epsilon
    return normalize(
      e.xyy * assembleItems(p + e.xyy).d +
      e.yyx * assembleItems(p + e.yyx).d +
      e.yxy * assembleItems(p + e.yxy).d +
      e.xxx * assembleItems(p + e.xxx).d);
}

Items rayMarch(vec3 ro, vec3 rd) {
    Items t;
    float depth = START;
    for(int i = 0; i < MAX_STEP; i++) {
        vec3 p = ro + rd * depth;
        t = assembleItems(p);
        depth += t.d;
        if(depth < MIN_PRECISION || depth > END) break;
    }

    return Items(depth, t.color);
}

mat3 camera(vec3 ro, vec3 lp) { // different direction or cross position make different result
    vec3 camera_direction = normalize(lp - ro);
    vec3 camera_right = normalize(cross(vec3(0.0, 1.0, 0.0), camera_direction));
    vec3 camera_up = normalize(cross(camera_direction, camera_right));
    return mat3(
        -camera_right,
        camera_up,
        -camera_direction
    );
}



const float radiusCamera = 10.0;

void main() {
    vec2 uv = (gl_FragCoord.xy - .5 * u_resolution) / u_resolution.y;
    vec2 mouse = (u_mouse - .5 * u_resolution) / u_resolution.y;
    vec3 color;
    vec3 ro = vec3(0.0, 0.1, 5.);
    vec3 lp = vec3(0.0, 0.0, 0.0);
    ro.x = radiusCamera * cos(u_time * .1) + lp.x;
    ro.z = radiusCamera * sin(u_time * .1) + lp.z;
    
    vec3 rd = vec3(uv, -1.0);
    rd *= camera(ro, lp);

    Items u = rayMarch(ro, rd);

    if(u.d > END) {
        color = vec3(1.0);
    } else {
        color = u.color;
    }


    gl_FragColor = vec4(color, 1.);
}