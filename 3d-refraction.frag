#ifdef GL_ES
precision mediump float;
#endif

#define MAX_STEP        100
#define START           0.0
#define END             120.0
#define PRECISION       0.001
#define AIR             1.0
#define BOLL            2.73
#define EPSILON         0.0005

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;


struct Material {
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    vec3 refraction;
    float alpha;
};

struct Options {
    float d;
    int id;
    Material material;
};

Options sdfSphere(vec3 p, vec3 offset, float radius, int id, Material material) {
    return Options(length(p - offset) - radius, id, material);
}

Options sdfFloor(vec3 p, int id, Material material) {
    return Options(p.y + 1.0, id, material);
}

Options findMin(Options obj1, Options obj2) {
    if( obj1.d < obj2.d) return obj1;
    return obj2;
}

Material gold() {
  vec3 aCol = 0.5 * vec3(0.7, 0.5, 0);
  vec3 dCol = 0.6 * vec3(0.7, 0.7, 0);
  vec3 sCol = 0.6 * vec3(1, 1, 1);
  vec3 rCol = 0.5 * vec3(0.2314, 0.1843, 0.1843);
  float a = 5.;
  return Material(aCol, dCol, sCol, rCol, a);
}

Material makefloors(vec3 p) {
    float fc = mod(floor(p.x) + floor(p.z), 2.0) * 0.7;
    // fc = .79;
    return Material(
        vec3(fc),
        vec3(0.0),
        vec3(0.0),
        vec3(0.0),
        0.0
    );
}

vec3 phong(vec3 n, vec3 ld, vec3 rd, Material material) {
    // ambient
    vec3 ambient = material.ambient;

    //diffuse
    float fDot = clamp(dot(n, ld), 0.0, 1.0);
    vec3 diffuse = fDot * material.diffuse;

    // speculr
    vec3 sDot = clamp(reflect(n, ld), 0.0, 1.0);
    float _sDot = dot(sDot, -rd);
    _sDot = pow(_sDot, material.alpha);
    vec3 specular = _sDot * material.specular;

    // refraction
    float r = (AIR - BOLL) / (AIR - BOLL);
    r = dot(r, r);
    float refractionIndex = r + pow((1.0 - r) * ( 1.0 - dot(n, -rd)), 5.);
    vec3 refraction = refractionIndex * material.refraction;

    return ambient + diffuse + specular + refraction;
}

Options Sence(vec3 p) {

    Options sphere = sdfSphere(p, vec3(0.0, 0.0, 0.0), 1.0, 2, gold());
    Options floors = sdfFloor(p, 1, makefloors(p));

    Options O = findMin(sphere, floors);

    return O;
}

Options rayMarch(vec3 ro, vec3 rd) {
    float depth = START;
    Options O;
    for(int i = 0; i < MAX_STEP; i++) {
        vec3 p = ro + rd * depth;
        O = Sence(p);
        depth += O.d;
        if(depth < PRECISION || depth > END) break;
    }

    return Options(depth, 0, O.material);
}

vec3 normal(vec3 p) {
    vec2 e = vec2(1.0, -1.0) * 0.0005; // epsilon
    return normalize(
      e.xyy * Sence(p + e.xyy).d +
      e.yyx * Sence(p + e.yyx).d +
      e.yxy * Sence(p + e.yxy).d +
      e.xxx * Sence(p + e.xxx).d);
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


void main() {
    vec2 uv = (gl_FragCoord.xy - .5 * u_resolution) / u_resolution.y;
    vec3 ro = vec3(0.0, 1.0, 5.0);
    vec3 lp = vec3(0.0);
    vec3 rd = camera(ro, lp) * vec3(uv, -1.0);
    vec3 col;
    Options O = rayMarch(ro, rd);

    if(O.d > END) {
        col = vec3(.0);
    } else {
        vec3 p = ro + rd * O.d;
        vec3 ls = vec3(sin(u_time) * 10., 10.0, cos(u_time) * 10.);
        vec3 n = normal(p);
        vec3 ld = normalize(ls - n);

        col = phong(n, ld, rd, O.material);
        float dif = clamp(dot(n, ld), 0.0, 1.0);
        vec3 newOrigin = p + n * PRECISION * 2.0;
        Options shadow = rayMarch(newOrigin, ld);
        if( shadow.d < length(ls - newOrigin) ) dif *= 0.0;

        col = col * vec3(dif);

        
    }
    col = mix(col, vec3(0.0), 1.0 - exp(-0.0002 * O.d * O.d * O.d));// fog
    col = pow(col, vec3(1.0/2.2)); // gamma correction
    gl_FragColor = vec4(col, 1.0);
}