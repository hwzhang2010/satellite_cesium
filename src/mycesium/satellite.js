/*
 * @Author: wangchaoxu
 * @Date: 2020-07-20 16:15:06
 * @LastEditors: wangchaoxu
 * @LastEditTime: 2020-07-21 11:03:05
 * @Description:实体的增删改查
 */
import { cloneDeep } from './core';
/**
 * @description: 添加广告牌和label结合的标记(卫星)
 * @param {Object} viewer对象
 * @return:{Object} entity 实体对象
 * @author: zhang.huawei
 */

// function addSatellite(viewer, param, option) {
//   const satellite_png = require('../assets/satellite.png');
//   //console.log(param);
//   const { id, name, lng, lat, alt } = param;
  
//   let config = {
//     id: id,
//     name: name,
// 	position: Cesium.Cartesian3.fromDegrees(Number(lng), Number(lat), Number(alt)),
//     billboard: {
//       image: satellite_png,
//       pixelOffset: new Cesium.Cartesian2(0, 0),
//       eyeOffset: new Cesium.Cartesian3(0.0, 0.0, 0.0),
//       horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
//       verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
//       width: 42,
//       height: 32
//     },
//     label: {
//       text: name,
//       font: '14pt monospace',
//       style: Cesium.LabelStyle.FILL_AND_OUTLINE,
//       outlineWidth: 2,
//       verticalOrigin: Cesium.VerticalOrigin.TOP,
//       pixelOffset: new Cesium.Cartesian2(0, 2)
//     }
//   };
//   option = cloneDeep(config, option);
//   let entity = viewer.entities.add(option);
//   return entity;
// }

function addSatellite(viewer, param, option) {
  const satellite_png = require('../assets/satellite.png');
  //console.log(param);
  const { id, name, positionProperty } = param;
  
  let config = {
    id: id,
    name: name,
	position: positionProperty,
    billboard: {
      image: satellite_png,
      pixelOffset: new Cesium.Cartesian2(0, 0),
      eyeOffset: new Cesium.Cartesian3(0.0, 0.0, 0.0),
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      width: 42,
      height: 32
    },
    label: {
      text: name,
      font: '14pt monospace',
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      outlineWidth: 2,
      verticalOrigin: Cesium.VerticalOrigin.TOP,
      pixelOffset: new Cesium.Cartesian2(0, 2)
    }
  };
  option = cloneDeep(config, option);
  let entity = viewer.entities.add(option);
  return entity;
}

const genRandom = (min, max) => (Math.random() * (max - min + 1) | 0) + min
function  randomColor() {
	let aqua=Cesium.Color.AQUA.withAlpha(0.5)
    let anuamarine=Cesium.Color.AQUAMARINE.withAlpha(0.5)
	let blueviolet=Cesium.Color.BLUEVIOLET.withAlpha(0.5)
	let coral = Cesium.Color.CORAL.withAlpha(0.5)
	let colors = []
	colors.push(aqua)
	colors.push(anuamarine)
	colors.push(blueviolet)
	colors.push(coral)

    return colors[genRandom(0, 4)]

}

function addSatelliteWithCircle(viewer, param, option) {
  const satellite_png = require('../assets/satellite.png');
  //console.log(param);
  const { id, name, positionProperty, radiusProperty, heightProperty } = param;
  
  let config = {
    id: id,
    name: name,
	position: positionProperty,
    billboard: {
      image: satellite_png,
      pixelOffset: new Cesium.Cartesian2(0, 0),
      eyeOffset: new Cesium.Cartesian3(0.0, 0.0, 0.0),
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      width: 42,
      height: 32
    },
    label: {
      text: name,
      font: '14pt monospace',
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      outlineWidth: 2,
      verticalOrigin: Cesium.VerticalOrigin.TOP,
      pixelOffset: new Cesium.Cartesian2(0, 2)
    },
	ellipse: {
		semiMinorAxis : radiusProperty,
		semiMajorAxis : radiusProperty,
		height: heightProperty,
		//material : Cesium.Color.AQUAMARINE.withAlpha(0.5),
		material : randomColor(),
		fill: true,
		outline: true,
		outlineColor: Cesium.Color.AQUAMARINE.withAlpha(0.5),
		outlineWidth: 2.0
	}
	
  };
  option = cloneDeep(config, option);
  let entity = viewer.entities.add(option);
  return entity;
}

function addSatelliteInsitu(viewer, param, option) {
  const satellite_png = require('../assets/satellite.png');
  //console.log(param);
  const { id, name, posProperty, situProperty } = param;
  
  let config = {
    id: id,
    name: name,
	position: posProperty,
	plane: {
	  plane: new Cesium.Plane(Cesium.Cartesian3.UNIT_Z, 0.0),
	  //dimensions: new Cesium.Cartesian2(400000.0, 200000.0),
	  dimensions: situProperty,
	  material: Cesium.Color.PALEGREEN.withAlpha(0.5),
	  fill: true,
	  outline: true,
	  outlineColor: Cesium.Color.AQUA ,
	},
	
	
  };
  option = cloneDeep(config, option);
  let entity = viewer.entities.add(option);
  return entity;
}

function addSatelliteRectangle(viewer, param, option) {
  const satellite_png = require('../assets/satellite.png');
  //console.log(param);
  const { id, name, coordinateProperty } = param;
  
  let config = {
    id: id,
    name: name,
	rectangle: {
	    coordinates: coordinateProperty,
	    material: Cesium.Color.PALEGREEN.withAlpha(0.5),
    },
	
	
  };
  option = cloneDeep(config, option);
  let entity = viewer.entities.add(option);
  return entity;
}

/**
 * @description: 添加多段线的标记(卫星轨道)
 * @param {Object} viewer对象
 * @return:{Object} entity 实体对象
 * @author: zhang.huawei
 */
function addOribt(viewer, param, option) {
	const { id, positions } = param;
	
	let config = {
	  id: id,
	  name: name,
	  polyline : {
	    show : true,
	    positions : positions,
	    material : Cesium.Color.CORNFLOWERBLUE,
	    width : 2
	  }
	};
	option = cloneDeep(config, option);
	let entity = viewer.entities.add(option);
	return entity;
}

/**
 * @description: 添加广告牌和label结合的标记(地面站)
 * @param {Object} viewer对象
 * @return:{Object} entity 实体对象
 * @author: zhang.huawei
 */
function addGroundStation(viewer, param, option) {
  const groundstation_png = require('../assets/groundstation.png');
  //console.log(param);
  const { id, name, text, lng, lat, alt } = param;
  
  let config = {
    id: id,
    name: 'markerOfGroundStation-' + id,
	position: Cesium.Cartesian3.fromDegrees(Number(lng), Number(lat), Number(alt)),
    billboard: {
      image: groundstation_png,
      pixelOffset: new Cesium.Cartesian2(0, 0),
      eyeOffset: new Cesium.Cartesian3(0.0, 0.0, 0.0),
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      width: 32,
      height: 32
    },
    label: {
      text: name,
      font: '14pt monospace',
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      outlineWidth: 2,
      verticalOrigin: Cesium.VerticalOrigin.TOP,
      pixelOffset: new Cesium.Cartesian2(0, 4)
    }
  };
  option = cloneDeep(config, option);
  let entity = viewer.entities.add(option);
  return entity;
}

export { addSatellite, addSatelliteWithCircle, addSatelliteInsitu, addSatelliteRectangle, addOribt, addGroundStation };
