/*
 * @Author: wangchaoxu
 * @Date: 2020-07-15 20:32:58
 * @LastEditors: wangchaoxu
 * @LastEditTime: 2020-07-21 19:00:57
 * @Description:引入cesium的方法
 */
import { initViewer, flyTo } from './viewer'
import { addLayer, getAllLayer, getLayerByAttr, removeAllLayer, removeLayerByAttr } from './layer'
import { leftSingleClick, mouseMove } from './mouse';
import { addLabel, addBillboard, addMarker, getAllEntities, getEntitysByAttr, removeAllEntities, removeEntitiesByAttr, clickGetEntitties, clickRemoveEntities, checkEntityById, removeEntityById, removeEntitiesById } from './entities';
import { setClockTimeline } from './clock'
import { initCzmlPolyline, getCzmlPolyline, genCzmlPolyline, addDataSource } from './dataSource'
import { addSatellite, addSatelliteWithCircle, addSatelliteInsitu, addSatelliteRectangle, addOribt, addGroundStation } from './satellite'
import addBoundary from './addBoundary'

export default {
  initViewer,
  flyTo,
  addLayer,
  getAllLayer,
  getLayerByAttr,
  removeAllLayer,
  removeLayerByAttr,
  addBoundary,
  mouseMove,
  addLabel,
  addBillboard,
  addMarker,
  getAllEntities,
  getEntitysByAttr,
  removeAllEntities,
  removeEntitiesByAttr,
  clickRemoveEntities,
  clickGetEntitties,
  leftSingleClick,
  checkEntityById,  
  removeEntityById,
  removeEntitiesById,
  setClockTimeline,
  initCzmlPolyline, 
  getCzmlPolyline,
  genCzmlPolyline,
  addDataSource,
  addSatellite,
  addSatelliteWithCircle,
  addSatelliteInsitu,
  addSatelliteRectangle,
  addOribt,
  addGroundStation
};
