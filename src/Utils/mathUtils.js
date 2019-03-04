export function normalize(v, vmin, vmax, tmin, tmax){

	const nv = Math.max(Math.min(v, vmax));
	const dv = vmax - vmin;
	const pc = (nv - vmin) / dv;
	const dt = tmax - tmin;
	return tmin + (pc * dt); //tv
}