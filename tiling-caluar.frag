#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec2 random( vec2 p ) {
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    vec2 mouse = u_mouse / u_resolution;
    uv *= u_resolution.x / u_resolution.y;
    uv *= 3.;
    float m_dist = 1.;
    // tiling the screen; 
    vec2 i_uv = floor(uv);
    //get every pixel point in each tile;
    vec2 f_uv = fract(uv);
    
    // create a random point in each pixel;
    vec2 point = random(i_uv);
    /*
    Each pixel inside that
    tile (stored in the float coordinate, f_st) 
    will check their distance to that random point.
    */
    // vec2 mx = point - f_uv;

    // float color = length(mx);

    for(int y =-1; y<=1; y++) {
        for(int x=-1; x<=1; x++) {
            vec2 neighbor = vec2(float(x), float(y));

            vec2 point = random(neighbor + i_uv);
            // there must be a point value in right equalation,for vec2 must equal to vec2;
            point = .5 + .5 * sin(u_time + point * 6.28);

            float dist = distance(neighbor + point, f_uv);

            m_dist = min(dist, m_dist);

        }
    }
    float color = 0.;
    color += m_dist;
    color += 1. - step(.02, m_dist);

    gl_FragColor = vec4(vec3(color), 1.);
}