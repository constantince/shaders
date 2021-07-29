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
#define MAXRAY          150.0
float sdSphere(vec3 p, float r) {
    
    return length(p) - r;
}

vec3 calcNormal(vec3 p) {
    vec2 e = vec2(1.0, -1.0) * 0.0005; // epsilon
    float r = 1.; // radius of sphere
    return normalize(
      e.xyy * sdSphere(p + e.xyy, r) +
      e.yyx * sdSphere(p + e.yyx, r) +
      e.yxy * sdSphere(p + e.yxy, r) +
      e.xxx * sdSphere(p + e.xxx, r));
}

float rayMarch(vec3 ro, vec3 rd, float start, float end) {
    float dis = start;
    for(int i=0; i<5; i++) {
        vec3 p = ro + dis * rd;
        float q = sdSphere(p, .5);
        dis += q;
        if(dis < 0.001 || dis > end) break;
    }
    return dis;
}



void main() {
    vec2 uv = (gl_FragCoord.xy - .5 * u_resolution.xy) / u_resolution.y;

    // testing line ray, not for rendering;
    vec3 ro = vec3(0.0, 0.0, 5.0);
    vec3 rd = normalize(vec3(uv, -1.0));


    float l = rayMarch(ro, rd, 0.0, MAXRAY);


    vec3 color = vec3(1.0);

    if(l > 5.) {
        color = CYAN;
    } else {
       // real lighting here
       vec3 p = ro + rd * l;
       vec3 lightSource = vec3(cos(u_time) * 2.0, sin(u_time) * 3.0, 5.0);
       vec3 normal = normalize(calcNormal(p));
       vec3 lightDirection = normalize(lightSource - p);
       float fDot = clamp(dot(normal, lightDirection), 0.0, 1.0);
       color = BLUE * fDot;
    }
    


    gl_FragColor = vec4(color, 1.);
}