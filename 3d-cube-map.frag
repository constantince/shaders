// #version 330 es

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;
uniform samplerCube u_cubeMap;

mat2 rotate2D(float a) {
    return mat2(
        cos(a), -sin(a),
        sin(a), cos(a)
    );
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
    vec2 uv = (gl_FragCoord.xy) / u_resolution.xy;
    // vec3 col =  vec3(.75);

    vec3 ro = vec3(0.0, 0.0, 5.0);
    vec3 lp = vec3(0.0, 0.0, 0.0);
    vec3 rd = camera(ro, lp) * normalize(vec3(uv, -1.0));

    vec3 col = textureCube(u_cubeMap, rd).rgb;

    gl_FragColor = vec4(col, 1.0);
}