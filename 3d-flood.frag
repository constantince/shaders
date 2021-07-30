#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

float flood (vec3 p) {
    return p.y + 1.;
}

float carmera(vec3 ro, vec3 rd, float start, float end) {
    float depth = start;

    for(int i=0; i<5; i++) {
        vec3 p = ro + rd * depth;
        float d = flood(p);
        depth += d;
        if( depth < 0.01 || depth > 20.) break;
    }

    return depth;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - .5 * u_resolution) / u_resolution.y;
    vec3 col = vec3(1.);

    vec3 ro = vec3(cos(u_time* .1) * 5.0, 1.0, sin(u_time*.1) * 5.0);
    vec3 rd = vec3(uv, -1.0);

    float d = carmera(ro, rd, 0.0, 100.0);

    if( d >= 20.0) {
        
    } else {
        vec3 p = ro + rd * d;
        col = vec3(mod(floor(p.x) + floor(p.z), 2.0));
    }


    


    gl_FragColor = vec4(col, 1.);
}