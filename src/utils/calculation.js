/**
 * Created by zhang.huawei.
 */

import { twoline2satrec, propagate, gstime, eciToEcf, eciToGeodetic, degreesLong, degreesLat } from 'satellite.js'


export function calOrbitFromTle(tle, current) {
	let orbit = []
	if (tle != null && tle.length > 2) {
		// 两行根数第2行，53–63	每天环绕地球的圈数
		const motionNumber = parseFloat(tle[2].substring(52, 63))
		// 每圈的运行时间，单位为秒
		const motionPeriod = Math.ceil(86400 / motionNumber)
		
		// Initialize a satellite record
		let satrec = twoline2satrec(tle[1], tle[2])
		for (let i = 0; i < motionPeriod; i += 30) {
			// 时间依次递增30秒
			current.setTime(current.setSeconds(current.getSeconds() + 30))
			
			//  use a JavaScript Date
			let positionAndVelocity = propagate(satrec, current)
			// The position_velocity result is a key-value pair of ECI coordinates.
			// These are the base results from which all other coordinates are derived.
			let positionEci = positionAndVelocity.position
			// GMST for some of the coordinate transforms.
			let gmst = gstime(current)
			// get ECF, Geodetic.
			let positionEcf = eciToEcf(positionEci, gmst)
			let positionGd  = eciToGeodetic(positionEci, gmst)
			
			const position = {
				lng: degreesLong(positionGd.longitude),
				lat: degreesLat(positionGd.latitude),
				alt: positionGd.height * 1000
			}
			orbit.push(position)
		}
	}
	
	return orbit
}

export function calOrbitPeriodFromTle(tle, current) {
	if (tle != null && tle.length > 2) {
		// 两行根数第2行，53–63	每天环绕地球的圈数
		const motionNumber = parseFloat(tle[2].substring(52, 63))
		// 每圈的运行时间，单位为秒
		const motionPeriod = Math.ceil(86400 / motionNumber)
		
		current.setTime(current.setSeconds(current.getSeconds() + motionPeriod))
	}
	
	return current
}