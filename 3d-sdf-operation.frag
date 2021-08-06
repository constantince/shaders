#ifdef GL_ES
precision mediump float;
#endif

#define MAX_STEP	105
#define START		0.0
#define END			100.0
#define PI			3.1415926535
#define PRECISION	0.001
#define EPISCON		0.0005

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

struct Material {
	vec3 ambient;
	vec3 diffuse;
	vec3 specular;
	float alpha;
};

struct Options {
	int id;
	float d;
	Material material;
};

Material gold() {
  vec3 aCol = 0.5 * vec3(0.8314, 0.8078, 0.749);
  vec3 dCol = 1.0 * vec3(1.0, 1.0, 1.0);
  vec3 sCol = 1.0 * vec3(1, 1, 1);
  float a = 5.;
  return Material(aCol, dCol, sCol, a);
}

Options sdfSphere(vec3 p, vec3 offset, float radius, int id, Material material) {
	return Options(id, length(p - offset) - radius, material);
}


Options findMin(Options obj1, Options obj2) {
	if(obj1.d < obj2.d) return obj1;
	return obj2;
}

Options sdRoundBox( vec3 p, vec3 offset, vec3 b, float r, int id, Material material )
{
  vec3 q = abs(p - offset) - b;
  float d = length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0) - r;
  return Options(id, d, material);
}

// operation 1 smooth_min;
float opSmoothUnion( float d1, float d2, float k ) {
    float h = clamp( 0.5 + 0.5*(d2-d1)/k, 0.0, 1.0 );
    return mix( d2, d1, h ) - k*h*(1.0-h); 
}

// operation 2 smooth_substraction
float opSmoothSubtraction( float d1, float d2, float k ) {
    float h = clamp( 0.5 - 0.5*(d2+d1)/k, 0.0, 1.0 );
    return mix( d2, -d1, h ) + k*h*(1.0-h); 
}

// operation 3 smooth_intersection;
float opSmoothIntersection( float d1, float d2, float k ) {
    float h = clamp( 0.5 - 0.5*(d2-d1)/k, 0.0, 1.0 );
    return mix( d2, d1, h ) + k*h*(1.0-h);
}

Options opSymX(vec3 p, vec3 offset, float radius, int id, Material material) {
	// opSymX with x axsio in the right sphere direction;
	return Options(id, length(p - offset) - radius, material); 
}
const float c = 5.0;
const vec3 l = vec3(2.0, 1.0, 2.0);
Options Sence(vec3 p) {
	// p.xyz = abs(p.xyz);
	// p = mod(p+0.5 * c, c) - .5 * c;
	p = p - c*clamp(floor(p/c), -l, l);

	Options sphere = sdfSphere(p, vec3(1.0, sin(u_time) * 3.0, 1.0), 1.0, 1, gold());
	Options box = sdRoundBox(p, vec3(1.0, 2.0, 1.0), vec3(2.0, .5, 1.5), 0.1, 2, gold());
	
	return Options(3, opSmoothUnion(sphere.d, box.d, .4), gold());

	// return sphere;
}

vec3 getNormal(vec3 p) {
	vec2 e = vec2(1.0, -1.0) * EPISCON;
	return normalize(
		  e.xyy * Sence(p + e.xyy).d +
		  e.yyx * Sence(p + e.yyx).d +
		  e.yxy * Sence(p + e.yxy).d +
		  e.xxx * Sence(p + e.xxx).d
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


vec3 phong(vec3 normal, vec3 rd, vec3 ld, Material material) {
	vec3 ambient = material.ambient;
	
	
	float fDot = clamp(dot(normal, ld), 0.0, 1.0);
	vec3 diffuse = material.diffuse * fDot;
	
	
	vec3 sDot = reflect(normal, ld);
	float _sDot = clamp(dot(sDot, -rd), 0.0, 1.0);
	_sDot = pow(_sDot, material.alpha);
	vec3 specular = _sDot * material.specular;

	return ambient + diffuse;

}





Options rayMarch(vec3 ro, vec3 rd) {
	float depth = START;
	Options O;
	
	for(int i=0; i<MAX_STEP; i++) {
		vec3 p = ro + rd * depth;
		O = Sence(p);
		depth += O.d;
		if(depth < PRECISION || depth > END) break;
	}
	
	return Options(0, depth, O.material);
}

mat2 rotate2D(float a) {
	return mat2(
		cos(a), -sin(a),
		sin(a), cos(a)
	);
}





float cameraRadius = 8.0;
void main() {
	vec2 uv = (gl_FragCoord.xy - .5 * u_resolution) / u_resolution.y;
	vec3 col = vec3(0.1054451, 0.012477, 0.022541);
	vec2 mouse = (u_mouse - .5 * u_resolution) / u_resolution.y;
	
	
	vec3 ro = vec3(0.0, 20.0, 28.0);
	vec3 lp = vec3(0.0, 0.0, 0.0);
	ro.xz = ro.xz * rotate2D(mix(-PI, PI, mouse.x)) + vec2(lp.x, lp.z);
	ro.yz = ro.yz * rotate2D(mix(-PI, PI, mouse.y));
	
	vec3 rd = camera(ro, lp) * vec3(uv, -1.0);
	Options O = rayMarch(ro, rd);
	
	if(O.d > END) {
		col *= 1.0;
	} else {
		vec3 p = ro + rd * O.d;
		//p.yz = p.yz * rotate2D(mix(-PI, PI, mouse.y));
		vec3 ls = vec3(abs(cos(u_time * .1)) * 10.0, 20.0, abs(sin(u_time * .1)) * 10.0);
		vec3 n = getNormal(p);
		vec3 ld = normalize(ls - p);
		
		col = phong(n, rd, ld, O.material);

		// float diff= clamp(dot(n, ld), 0.0, 1.0);

		// vec3 newO = p + n * PRECISION * 2.0;
		// Options shadow = rayMarch(newO, ld);
		// if( shadow.d < length(ls - newO)) diff = 0.0;

		// col *= diff;
	}
	
	gl_FragColor = vec4(col, 1.0);
	
}




