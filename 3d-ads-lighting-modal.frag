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

#define MAX_STEP    150
#define START       0.0
#define END         50.0
#define PRECISION   0.01
#define PI          3.1415926535

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

struct Material {
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    float alpha;
};

struct Items {
    float d;
    int id;
    Material m;
};

Items sdShere(vec3 p, vec3 offset, float radius,  Material m, int id) {
    return Items(length(p - offset) - radius, id, m) ;
}

Items sdFloor(vec3 p, Material m, int id) {
    return Items(p.y + 1.0, id, m);
}

Items sdBox(vec3 p, vec3 offset, vec3 b, Material m, int id) {
    vec3 q = abs(p - offset) - b;
    return Items(length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0), id, m);
}

Items findMin(Items obj1, Items obj2) {
    if(obj1.d < obj2.d) return obj1;
    return obj2;
}

Material gold() {
  vec3 aCol = 0.5 * vec3(0.7, 0.5, 0);
  vec3 dCol = 0.6 * vec3(0.7, 0.7, 0);
  vec3 sCol = 0.6 * vec3(1, 1, 1);
  float a = 5.;

  return Material(aCol, dCol, sCol, a);
}

Material silver() {
  vec3 aCol = 0.4 * vec3(0.8);
  vec3 dCol = 0.5 * vec3(0.7);
  vec3 sCol = 0.6 * vec3(1, 1, 1);
  float a = 5.;

  return Material(aCol, dCol, sCol, a);
}

Material buildFloorMaterial(vec3 p) {
    return Material(
        vec3(mod(floor(p.z) + floor(p.x), 2.0) * 0.7),
        vec3(0.0),
        vec3(0.0),
        0.0
    );
}



vec3 phong (Material m, vec3 normal, vec3 ld, vec3 rd) {
    // ambient
    vec3 ambient = m.ambient;

    // diffuse
    float fDot = dot(normal, ld);
    vec3 diffuse = m.diffuse * fDot;

    //specular
    vec3 f = reflect(normal, ld);
    float sDot = clamp(dot(f, -rd), 0.0, 1.0);
    sDot = pow(sDot, m.alpha);
    vec3 specular = m.specular * sDot;


    return ambient + diffuse + specular;
}


Items assembleItems(vec3 p) {
    Items O;
    Items sphere = sdShere(p, vec3(1.5, 0.2, 0.0), 1.0, gold(), 1);
    Items cube = sdShere(p, vec3(-1.5, 0.2, 0.0), 1.0, silver(), 2);
    Items floors = sdFloor(p, buildFloorMaterial(p), 1);

    O = findMin(sphere, floors);
    O = findMin(O, cube);
    return O;

}

Items rayMarch(vec3 ro, vec3 rd) {
    float depth = START;
    Items tar;
    for(int i = 0; i < MAX_STEP; i++) {
        vec3 p = ro + rd * depth;
        tar = assembleItems(p);
        depth += tar.d;
        if( depth < PRECISION || depth > END) break;
    }

    return Items(depth, 0, tar.m);
}

mat3 camera(vec3 ro, vec3 lp) {
    vec3 camera_direction = normalize(lp - ro);
    vec3 camera_right = normalize(cross(camera_direction, vec3(0.0, 1.0, 0.0)));
    vec3 camera_up = normalize(cross(camera_direction, camera_right));
    return mat3(
        camera_right,
        -camera_up,
        -camera_direction
    );
}

vec3 calcNormal(vec3 p) {
    vec2 e = vec2(1.0, -1.0) * 0.0005; // epsilon
    return normalize(
      e.xyy * assembleItems(p + e.xyy).d +
      e.yyx * assembleItems(p + e.yyx).d +
      e.yxy * assembleItems(p + e.yxy).d +
      e.xxx * assembleItems(p + e.xxx).d);
}


const float cameraRadius = 10.0;
void main() {
    vec2 uv = (gl_FragCoord.xy - .5 * u_resolution) / u_resolution.y;
    vec3 color;
    vec3 ro = vec3(0.0, 0.0, 10.0);
    vec3 lp = vec3(0.0);

    ro.x = cameraRadius * cos(u_time * .2) + lp.x;
    ro.z = cameraRadius * sin(u_time * .2) + lp.z;

    vec3 rd = camera(ro, lp) * normalize(vec3(uv, -1.0));

    Items O = rayMarch(ro, rd);

    if( O.d > END) {
        color = vec3(1.);
    } else {
        vec3 p = ro + rd * O.d;
        vec3 normal = normalize(calcNormal(p));

        vec3 ls = vec3(-8.0, -6.0, -0.0);
        vec3 ld = normalize(ls - p);
        float lightIdensity = .9;
        color = phong(O.m, normal, ld, rd) * lightIdensity;

        ls = vec3(1.0, 1.0, 1.0);
        ld = normalize(ls - p);
        lightIdensity = .5;
        color += phong(O.m, normal, ld, rd) * lightIdensity;


    }





    gl_FragColor = vec4(color, 1.0);
}