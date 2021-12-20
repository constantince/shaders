#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;


float rect(float width, float height, vec2 center) {
    center.x += sin(u_time * 0.2) * 1.5;
    float w = step(width/2.0, center.x) + step(width/2.0, -center.x);
    float h = step(height/2.0, center.y) + step(height/2.0, -center.y);
    return 1.0 - (h + w);
}

void main () {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution) / u_resolution.y;


    //draw a circle
    // float circle = 1.0 - smoothstep(.2, 0.203, length(uv));
    // vec3 col = circle * vec3(1.0, 0.0, 0.0);
    // gl_FragColor = vec4(col, 1.0);

    // draw a rect
    // float c = step(0.3, uv.x);
    // float _c = step(0.3, -uv.x);
    // c += _c;

    // float y = step(0.3, uv.y);
    // c += y;
    // float _y = step(0.3, -uv.y);
    // c += _y;

    float c = rect(0.1, 0.1, uv);

    // col = mix(vec3(1.), col, 1.0 - c);

    gl_FragColor = vec4(vec3(c), 1.0);
}