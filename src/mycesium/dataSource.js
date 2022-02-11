/*
 * @Author: zhang.huawei
 * @Date: 2020-10-25 17:11:22
 * @LastEditors: zhang.huawei
 * @LastEditTime: 2020-10-25 17:11:22
 * @Description: czml轨道数据
 */

function addDataSource(viewer, czmlPolyline) {
    // 加载提供的URL或CZML对象，替换任何现有数据。
	let dataSourcePromise = Cesium.CzmlDataSource.load(czmlPolyline)
	viewer.dataSources.removeAll()
	viewer.dataSources.add(dataSourcePromise)
	
}


function initCzmlPolyline(){
	let czmlPolyline = [{
		"id": "document",
		"name": "CZML Geometries: Polyline",
	    "version": "1.0"
	}]
	
	return czmlPolyline
}

function getCzmlPolyline(param){
	const { id, name, orbit } = param
	
	const positions = []
	for (let i = 0, length = orbit.length; i < length; i++) {
	    positions.push(orbit[i].lng)
	    positions.push(orbit[i].lat)
		positions.push(orbit[i].alt)
	}
	
	const polyline = {
		"id": id,
		"name": name,
		"polyline": {
		    "positions": {
		  	    "cartographicDegrees": positions
		  	},
			"material": {
				"solidColor": {
					"color": {
						"rgba": [0,255,255,255]
					}
				}
			}
	    }
    }
	
	return polyline
}

function genCzmlPolyline(czmlPolyline, polylines) {
	if (polylines === null || polylines.length === 0)
	    return czmlPolyline
		
	polylines.forEach(polyline => {
		czmlPolyline.push(polyline)
	})
	
	return czmlPolyline
}

export { initCzmlPolyline, getCzmlPolyline, genCzmlPolyline, addDataSource };