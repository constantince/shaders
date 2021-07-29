#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

/* Color palette */
#define BLACK           vec3(0.0, 0.0, 0.0)
#define WHITE           vec3(1.0, 1.0, 1.0)
#define RED             vec3(178., 34., 52) / 255.
#define BLUE           vec3(60., 59.0, 110.0) /255.
#define YELLOW          vec3(1.0, 1.0, 0.0)
#define CYAN            vec3(0.0, 1.0, 1.0)
#define MAGENTA         vec3(1.0, 0.0, 1.0)
#define ORANGE          vec3(1.0, 0.5, 0.0)
#define PURPLE          vec3(1.0, 0.0, 0.5)
#define LIME            vec3(0.5, 1.0, 0.0)
#define ACQUA           vec3(0.0, 1.0, 0.5)
#define VIOLET          vec3(0.5, 0.0, 1.0)
#define AZUR            vec3(0.0, 0.5, 1.0)

#define PI            3.1415926535


vec2 Remap(vec2 p, float t, float r, float b, float l) {
    return vec2((p.x - l) / (r - l), (p.y - b) / (t - b));
}

float sdStar5(in vec2 p, in float r, in float rf, vec2 offset)
{
  p -= offset; // This will subtract offset.x from p.x and subtract offset.y from p.y
  const vec2 k1 = vec2(0.809016994375, -0.587785252292);
  const vec2 k2 = vec2(-k1.x,k1.y);
  p.x = abs(p.x);
  p -= 2.0*max(dot(k1,p),0.0)*k1;
  p -= 2.0*max(dot(k2,p),0.0)*k2;
  p.x = abs(p.x);
  p.y -= r;
  vec2 ba = rf*vec2(-k1.y,k1.x) - vec2(0,1);
  float h = clamp( dot(p,ba)/dot(ba,ba), 0.0, r );
  return length(p-ba*h) * sign(p.y*ba.x-p.x*ba.y);
}

float Stars(vec2 uv) {
    uv -= .08;
    float star;
    for(int i=0; i<6; i++) {
        float n = float(i);
        star += 1. - smoothstep(0.,  0.005, sdStar5(uv, .03, .5, vec2(0.16 * n, 0.)));
        for(int u=0; u<5; u++) {
            float x = float(u);
            star += 1. - smoothstep(0.,  0.005, sdStar5(uv, .03, .5, vec2(n * .16, 0.2 * x)));
        }
    }

    for(int i=0; i<5; i++) {
        float n = float(i);
        star += 1. - smoothstep(0.,  0.005, sdStar5(uv, .03, .5, vec2(0.16 * n + .08, .1)));
        for(int u=0; u<4; u++) {
            float x = float(u);
            star += 1. - smoothstep(0.,  0.005, sdStar5(uv, .03, .5, vec2(n * .16 + .08, 0.2 * x + .1)));
        }
    }

    return star;
}

float Start2(vec2 uv, vec2 num) {
    float ratio = 1.;
    float offset = 1.;
    float star;
    vec2 st = fract(uv * num);
     star = 1. - smoothstep(0., 0.005, sdStar5(st, .25 * ratio, .5, vec2(.5 * offset, 0.5)));
    return star;
}


void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    // uv *= 1.1;
    float t = uv.x * 7. - 2. * u_time + uv.y * 3.;
    uv.y +=  sin( t ) * .05;
    // caculate the min pix in y axios;
    float d = 0.01;
    vec3 c = mix(WHITE, RED, smoothstep(d, d + 0.2, sin(uv.y * PI * 13.)));

    vec3 color = c;

   

    color *= smoothstep(d, .005, abs(uv.y - .5) - .5 + d);

    vec2 st = Remap(uv, 1., .4, .46, 0.);

    if(st.x > .0 && st.x <= 1. && st.y <= 1. && st.y > 0.) {
        color = mix(BLUE, WHITE, Start2(st, vec2(6., 5.)));

        st = Remap(st, .9, .9166, .1, .0833);

        if(st.x > .0 && st.x <= 1. && st.y <= 1. && st.y > 0.) {
            color = mix(color, WHITE, Start2(st, vec2(5., 4.)));
        }
    }

    

    color *= .7 + cos(t) * .3;
    gl_FragColor = vec4(color, 1.);
}