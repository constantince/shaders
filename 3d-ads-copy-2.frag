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
uniform vec2 u_mouse;


#define MAX_STEP    200
#define START    0.0
#define END    100.0
#define PI    3.1415926535
#define PRECISON    0.0005

struct Material {
    vec3 ambient;
    vec3 diffuse;
    vec3 spcular;
    float alpha;
};

struct Things {
    int id;
    float d;
    Material m;
};

Things combine(Things o1, Things o2) {
    if(o1.d < o2.d) return o1;
    return o2;
}

Material createSphere(vec3 p) {
    return Material(
        0.5 * vec3(0.7, 0.5, 0),
        0.6 * vec3(0.7, 0.7, 0),
        0.6 * vec3(1, 1, 1),
        12.0
    );
}

Material createFloor(vec3 p) {
    return Material(
        vec3(
            mod(floor(p.z) + floor(p.x), 2.0) * 1.0
        ),
        vec3(0.0),
        vec3(0.0),
        0.0
    );
}

Things sdSphere(vec3 p, vec3 offset, float radius, Material m, int id) {
    return Things(
        id,
        length(p - offset) - radius,
        m
    );
}

Things sdFloor(vec3 p, Material m, int id) {
    return Things(id, p.y + 0.3, m);
}

Things scene(vec3 p) {
    Things sphere = sdSphere(p, vec3(0.0, .8, 0.0), .5, createSphere(p), 1);
    Things floors = sdFloor(p, createFloor(p), 2);

    Things O = combine(sphere, floors);

    return O;
}

Things rayMarch(vec3 ro, vec3 rd) {
    float depth = START;
    Things tar;
    for(int i=0; i<MAX_STEP; i++) {
        vec3 d = ro + rd * depth;
        tar = scene(d);
        depth += tar.d;
        if( depth < PRECISON || depth > END) break;
    }

    return Things(0, depth, tar.m);
}

mat3 camera(vec3 ro, vec3 lp) {
    vec3 camera_direction = normalize(  lp - ro );
    vec3 camera_right = normalize(cross(camera_direction, vec3(0.0, 1.0, 0.0)));
    vec3 camera_up = normalize(cross(camera_direction, camera_right));

    return mat3(
        camera_right,
        -camera_up,
        -camera_direction
    );
}

vec3 phong(vec3 ld, vec3 rd, vec3 normal, Material m) {
    vec3 ambient = m.ambient;

    float fDot = dot(normal, ld);
    vec3 diffuse = fDot * m.diffuse;


    vec3 reflection = reflect(normal, ld);
    float sDot = clamp(dot(reflection, -rd), 0.0, 1.0);
    vec3 specular = pow(sDot, m.alpha) * m.spcular;

    return ambient + diffuse + specular;

}

vec3 calcNormal(vec3 p) {
    vec2 e = vec2(1.0, -1.0) * 0.0005; // epsilon
    return normalize(
      e.xyy * scene(p + e.xyy).d +
      e.yyx * scene(p + e.yyx).d +
      e.yxy * scene(p + e.yxy).d +
      e.xxx * scene(p + e.xxx).d);
}


void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution)/ u_resolution.y;
    vec3 ro = vec3(0.0, 0.0, 5.0);
    vec3 lp = vec3(0.0);
    vec3 rd = camera(ro, lp) * normalize(vec3(uv, -1));
    vec3 color;
    Things O = rayMarch(ro, rd);

    if( O.d > END) {
        color = vec3(1.0);
    } else {
        vec3 p = ro + rd * O.d;
        vec3 ls = vec3(sin(u_time), 1.0, cos(u_time));
        vec3 ld = normalize(ls - p);
        vec3 normal = normalize(calcNormal(p));
        color += phong(ld, rd, normal, O.m);
    }

    color = mix(color, vec3(0.2), 1.0 - exp(-0.002 * O.d * O.d * O.d));

    gl_FragColor = vec4(color, 1.0);
}
