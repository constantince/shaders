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
#define PI              3.1415926535

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;
uniform sampler2D Noise;

const vec3 color1 = vec3(.8, .7, .0);
const vec3 color2 = vec3(.6, .1, .0);
const float NoiseScale = 1.2;

float random(vec2 uv) {
    return fract ( sin(uv.x * 100. + uv.y * 6500.) * 5667.);
}

float SmoothNoise(vec2 uv) {
    vec2 lv =fract(uv);
    vec2 id = floor(uv);
     lv  = lv*lv*(3.- 2. * lv);
    float bl = random(id);
    float br = random(id + vec2(1., 0.));
    float b = mix(bl, br, lv.x);

    float tl = random(id + vec2(0., 1.));
    float tr = random(id + vec2(1., 1.));
    float t = mix(tl, tr, lv.x);

    return mix(b, t, lv.y);
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;

    // vec4 noisevec = texture(Noise, uv * NoiseScale);

    // float intensity = abs(noisevec[0] - .25) + 
    //                     abs(noisevec[0] - .125) + 
    //                     abs(noisevec[0] - .0625) + 
    //                     abs(noisevec[0] - .03125);
    // intensity = clamp(intensity * 6., 0., 1.);
    // vec3 color = mix(color1, color2, intensity) * 1.0;

   
    float c = SmoothNoise(uv * 4.);
    vec3 color = vec3(c);

    gl_FragColor = vec4(color, 1.);
}

