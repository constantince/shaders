#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;


float sdSphere(vec3 p, float radius) {
    return length(p) - radius;
}

float testPoint(vec3 ro, vec3 rd, vec3 p) {
    return length(cross(p - ro, rd)) / length(rd);
}


void main() {
    vec2 uv = (gl_FragCoord.xy - .5 * u_resolution ) / u_resolution.y;

    vec3 ro = vec3(0.0, 0.0, 5.0); // ray origin
    vec3 rd = vec3(uv, 0.0) - ro; // ray rediection
    vec3 p = vec3(-1.0, -1.0, -1.0);
    float c;
    // float c = testPoint(ro, rd, p);
    // c = smoothstep(.1, .099, c);

    float circle = sdSphere(p, .6);
    float x = testPoint(ro, rd, p);

    if(circle <= 0. || x <= circle) {
        c = .7;
    }


    gl_FragColor = vec4(vec3(c), 1.);
}

