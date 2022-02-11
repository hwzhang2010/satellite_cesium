/*
 * @Author: wangchaoxu
 * @Date: 2020-07-21 09:07:12
 * @LastEditors: wangchaoxu
 * @LastEditTime: 2020-07-21 18:38:03
 * @Description:关于视图的操作
 */

import config from './config';
import { cloneDeep } from './core';

function initViewer(config = {}) {
  let option = {
    //放大镜图标，查找位置工具，查找到之后会将镜头对准找到的地址，默认使用bing地图
    geocoder: false,
    //房子图标，视角返回初始位置
    homeButton: false,
    //经纬网图标，选择视角的模式，有三种：3D，2D，哥伦布视图（2.5D)
    sceneModePicker: true,
    //地图图标，图层选择器，选择要显示的地图服务和地形服务
    baseLayerPicker: false,
    //问号图标，导航帮助按钮，显示默认的地图控制帮助
    navigationHelpButton: false,
    //动画器件，显示当前时间，允许跳转特定时间
    animation: true,
    //时间轴
    timeline: true,
    //全屏图标，全屏按钮
    fullscreenButton: false,
    //虚拟现实
    vrButton: false,
    //阴影
    shadows: false,
    //点击后显示详细信息
    infoBox: false,
    //展示数据版权属性
    CreditsDisplay: false,
    //关闭点击要素铝框
    selectionIndicator: false,
    terrainExaggeration: 3.0 //地形夸大
  };
  option = cloneDeep(option, config);
  Cesium.Ion.defaultAccessToken = config.CESIUM_TOKEN;
  let viewer = new Cesium.Viewer('cesiumContainer', option);
  viewer.cesiumWidget._creditContainer.style.display = 'none'; //移除版权
  viewer.scene.debugShowFramesPerSecond = true; //显示帧率
  viewer.scene.backgroundColor = Cesium.Color.TRANSPARENT; //背景颜色
  viewer.scene.postProcessStages.fxaa.enabled = false; // 抗锯齿
  viewer.scene.globe.showGroundAtmosphere = true; // 水雾特效
  // viewer.scene.requestRenderMode = true; //空闲状态下停止渲染
  // 设置最大俯仰角，[-90,0]区间内，默认为-30，单位弧度
  viewer.scene.screenSpaceCameraController.constrainedPitch = Cesium.Math.toRadians(-20);
  // 取消默认的双击事件
  viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
  viewer.scene.screenSpaceCameraController.minimumZoomDistance = 3000; //相机的高度的最小值,放大时使用
  viewer.scene.screenSpaceCameraController.maximumZoomDistance = 40489014; //相机高度的最大值,缩小操作时用
  viewer.scene.screenSpaceCameraController._minimumZoomRate = 30000; // 设置相机缩小时的速率
  viewer.scene.screenSpaceCameraController._maximumZoomRate = 30762720; //设置相机放大时的速率
  
  // animation和timeline修改为系统时间(北京时间)
  viewer.animation.viewModel.dateFormatter = DateTimeFormatter;
  viewer.animation.viewModel.timeFormatter = TimeFormatter; 
  viewer.timeline.makeLabel = DateTimeFormatter;
  
  viewer.imageryLayers.removeAll();
  // viewer.imageryLayers.addImageryProvider(
  //   // 加载google在线地图
  //   new  Cesium.UrlTemplateImageryProvider({ url: "https://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali" })
  // );
  viewer.imageryLayers.addImageryProvider(
    // 加载高德地图
    new Cesium.UrlTemplateImageryProvider({ url: "https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}" })
  );
  
  // viewer.imageryLayers.addImageryProvider(
  //   // 加载天地图在线地图
  //   new Cesium.WebMapTileServiceImageryProvider({
  //   	url: 'http://t0.tianditu.gov.cn/img_w/wmts?tk=ebf64362215c081f8317203220f133eb',
  //   	layer:'img',
  //   	style:'default',
  //   	tileMatrixSetID:'w',
  //   	format:'tiles',
  //   	maximumLevel: 18
  //   })
  // );
  // viewer.imageryLayers.addImageryProvider(
  //   // 引入天地图标注
  //   new Cesium.WebMapTileServiceImageryProvider({
  //       url: "https://t0.tianditu.gov.cn/cva_w/wmts?tk=c4e3a9d54b4a79e885fff9da0fca712a&service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",
  //       layer: "tdtAnnoLayer",
  //       style: "default",
  //       format: "image/jpeg",
  //       tileMatrixSetID: "GoogleMapsCompatible",
  //       show: false
  //   })
  // );
  
  
  return viewer;
}
/**
 * @description: 视图飞到某处
 * @param {Object} viewer对象
 * @param {String} 笛卡尔空间坐标 coordinate
 * @author: wangchaoxu
 */
function flyTo(viewer, coordinate) {
  viewer.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(103.84, 31.15, 5050000) });
}



function DateTimeFormatter(datetime, viewModel, ignoredate) {
  var julianDT = new Cesium.JulianDate()
  Cesium.JulianDate.addHours(datetime, 8, julianDT)
  var gregorianDT = Cesium.JulianDate.toGregorianDate(julianDT)
  var objDT
  if (ignoredate)
    objDT = ''
  else {
    objDT = new Date(gregorianDT.year, gregorianDT.month - 1, gregorianDT.day)
    objDT = gregorianDT.year + '年' + objDT.toLocaleString('zh-cn', { month: 'short' }) + gregorianDT.day + '日'
    if (viewModel || gregorianDT.hour + gregorianDT.minute === 0)
      return objDT
    objDT += ' '
  }
  return objDT + Cesium.sprintf('%02d:%02d:%02d', gregorianDT.hour, gregorianDT.minute, gregorianDT.second)
}


function TimeFormatter (time, viewModel) {
  return DateTimeFormatter(time, viewModel, true)
}



export { initViewer, flyTo };
