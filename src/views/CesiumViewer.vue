<template>
	<div class="container">
		<div class="container-handle">
			<el-checkbox style="margin: 5px 15px auto auto" size="mini" v-model="isContinue" @change="handleTimer">定时</el-checkbox>
			
			<el-button-group>
			    <el-button plain size="mini" @click="handleDateTimeSetting">时间</el-button>
				<el-button plain size="mini" @click="handleSatelliteSetting">卫星</el-button>
				<el-button plain size="mini" @click="handleGroundStationSetting">信关站</el-button>
			</el-button-group>
			
		</div>
		<div id="container-view">
		  <Viewer @on-viewer-completed="viewerCompletedHandler">
			  <el-card class="view-setting" v-show="settingVisible.setting">
			    <div v-if="settingVisible.dateTime">
			        <DateTime ref="datetime" @on-datetime-completed="settingDateTimeHandler"></DateTime>
			    </div>
				<div v-if="settingVisible.satellite">
					<Satellite ref="satellite" @on-satellite-opt="settingSatelliteOptHandler" @on-satellite-orbit="settingSatelliteOrbitHandler" @on-satellite-cover="settingSatelliteCoverHandler"></Satellite>
				</div>
				<div v-if="settingVisible.groundStation">
					<GroundStation ref="groundstation" @on-groundstation-opt="settingGroundStationOptHandler" @on-groundstation-pass="settingGroundStationPassHandler"></GroundStation>
				</div>
			  </el-card>
		  </Viewer>
		</div>
	</div>
</template>

<script>
	import { twoline2satrec, propagate, gstime, eciToEcf, eciToGeodetic, degreesLong, degreesLat } from 'satellite.js'
	import Viewer from '../components/Viewer'
	import DateTime from '../components/Viewer/DateTime'
	import Satellite from '../components/Viewer/Satellite'
	import GroundStation from '../components/Viewer/GroundStation'
	import mycesium from '../mycesium'
	import { stringToDate, findEqual } from '@/utils/common'
	import { 
		postDateTime, putTimeStampRequest,
		postSatellites, postSatellitesSelected, 
		postSatelliteTle, postSatelliteTlePeriod, postSatelliteTlePositions, 
		postSatellitePositions, postSatelliteCircles, 
		postGroundStations, postGroundStationsSelected,
		postSatelliteInsituWides, postSatelliteInsituDesperseds, postSatelliteInsituCoordinations
	} from '@/api'
	
	export default {
	  name: 'CesiumViewer',
	  components: {
		  Viewer,
		  DateTime,
		  Satellite,
		  GroundStation
	  },
	  data() {  
	    return {
			isContinue: false,
			timer: null,  //定时器
			settingVisible: {
				setting: false,
				dateTime: false,
				satellite: false,
				groundStation: false,
			},
			plantype: 5,
			
	    }
	  },
	  mounted() {
		  // 初始化时间设置
		  this.initDateTime()
		  // 初始化卫星数据：后台请求 + 前端会话数据--sessionStorage
		  this.initSatellite()
		  // 初始化地面站数据：后台请求 + 前端会话数据--sessionStorage
		  this.initGroundStation()

	  },
	  beforeDestroy() {
		  //清除定时器
	    clearInterval(this.timer)             
	    this.timer = null
	  },
	  methods: {
		  // 初始化时间设置
		  initDateTime() {
			  // 从后台获取已经设置的时间
			  postDateTime({}).then(response => {
			  	if (response.code === 200) {
			  		const datetime = response.respBody
			  		const startDate = stringToDate(datetime.start)
					const endDate = stringToDate(datetime.end)
					mycesium.setClockTimeline(global.viewer, startDate, endDate)
			  	}
			  })
			  
		  },
		  
		  // 初始化卫星数据：后台请求 + 前端会话数据--sessionStorage
		  initSatellite() {
			  // 从后台获取所有可用的卫星列表
			  postSatellites({}).then(response => {
			  	if (response.code === 200) 
			  		return response.respBody
			  	return null
			  }).then(db => {
				  // 使用vuex共享数据(所有可用的卫星)
				  this.$store.commit("setSatelliteDB", []);
				  if (db != null) {
				  	  this.$store.commit("setSatelliteDB", db)
				  }
				  // 从后台获取被选的卫星列表
				  return postSatellitesSelected({})
			  }).then(response => {
				  if (response.code === 200) {
					  const selected = response.respBody
					  // 获取vuex的共享数据(从sessionStorage获取所有可用的卫星)
					  const db = this.$store.state.satelliteDB
					  
					  if (db != null && selected != null) {
						  const satellites = db.filter(item => selected.includes(item.satelliteId))
						  return satellites
					  }
				  }
				  return null
			  }).then(satellites => {
				if (satellites != null) {  
				  // 从cesium clock获取时间
				  const julianDate = global.viewer.clock.currentTime.clone()
				  const currentDate = Cesium.JulianDate.toDate(julianDate)
				  const timeStamp = currentDate.getTime()
				  
				  for(let i = 0, length = satellites.length; i < length; i++) {
				  	  const satelliteId = satellites[i].satelliteId
				  	  postSatellitePositions({satelliteId, timeStamp}).then(response => {
				  		  if (response.code === 200) {
				  			  let property = new Cesium.SampledPositionProperty()
				  			  const positions = response.respBody
				  			  for (let j = 0, len = positions.length; j < len; j++) {
				  				  const time = Cesium.JulianDate.fromIso8601(positions[j].epoch)
				  				  const position =Cesium.Cartesian3.fromDegrees(positions[j].lng, positions[j].lat, positions[j].alt)
				  				  // 添加一个新样本：添加位置，和时间对应
				  				  property.addSample (time, position)
				  			  }
				  						  								  
				  			  let param = {}
				  			  param.id = satelliteId
				  			  param.name = satelliteId
				  			  param.property = property
				  						  								  
				  			  mycesium.addSatellite(global.viewer, param)
				  		  }
				  	  })	
				  } 
				}
			  })
		  },
		  
		  // 初始化地面站数据：后台请求 + 前端会话数据--sessionStorage
		  initGroundStation() {
			  // 从后台获取所有可用的地面站列表
			  postGroundStations({}).then(response => {
			  	  if (response.code === 200)
			  		  return response.respBody
			  	  return null
			  }).then(db => {
			  	  //使用vuex共享数据(所有可用的地面站)
			  	  this.$store.commit("setGroundStationDB", []);
			  	  if (db != null) {
			  		  this.$store.commit("setGroundStationDB", db)
			  	  }
			  	  // 从后台获取被选的地面站列表
			  	  return postGroundStationsSelected({})
			  }).then(response => {
				  if (response.code === 200) {
				  	  const selected = response.respBody
				  	  // 获取vuex的共享数据(从sessionStorage获取所有可用的地面站)
				  	  const db = this.$store.state.groundstationDB			  
				  	  if (db != null && selected != null) {
				  		  const groundstations = db.filter(item => selected.includes(item.groundStationId))  
				  		  return groundstations
				  	  }
				  }
				  return null
			  }).then(groundstations => {
				  if (groundstations != null) {
					  for (let i = 0, length = groundstations.length; i < length; i++) {
			  			  let param = {}
			  			  param.id = groundstations[i].groundStationId,
			  			  param.name = groundstations[i].groundStationName,
			  			  param.text = groundstations[i].groundStationText,
			  			  param.lng = groundstations[i].groundStationLng,
			  			  param.lat = groundstations[i].groundStationLat,
			  			  param.alt = groundstations[i].groundStationAlt
			  					      					      					  	      						  
			  			  mycesium.removeEntityById(global.viewer, groundstations[i].groundStationId)
			  			  mycesium.addGroundStation(global.viewer, param)     	  
			  		  }
				  }
			  }) 
		  },
		  
		  czmlPolylineOfOribit(satellites) {
			  // 从cesium clock获取时间
		  	  const julianDate = global.viewer.clock.currentTime.clone()
		  	  const currentDate = Cesium.JulianDate.toDate(julianDate)
			  const timeStamp = currentDate.getTime()
		  			  
		  	  let polyline = satelliteId => postSatelliteTlePositions({satelliteId, timeStamp}).then(response => {
		  	      console.log("czmlPolylineOfOrbit:", response)
				  if (response.code === 200) {
		  	          const positions = response.respBody
					  if (positions.length > 0) {
						  const satelliteId = positions[0].id
						  let param = {
					          id: `orbit_${satelliteId}`,
					  		  name: `orbit_${satelliteId}`,
					  		  orbit: positions
					      }
					      return mycesium.getCzmlPolyline(param)
					  }
		  	      }
				  return null
		  	  })
		  			  
		  	  let czmlPolyline = mycesium.initCzmlPolyline()
		  	  const polylines = satellites.map(satelliteId => polyline(satelliteId))
		  	    
			  return Promise.all(polylines).then(polylines => {
		  	      czmlPolyline = mycesium.genCzmlPolyline(czmlPolyline, polylines)	  
		  	      return czmlPolyline			  
		  	  })
		  			  
		  },
		  
		  
		  viewerCompletedHandler(viewer) {
		  	  //全局cesium viewer
		      global.viewer = viewer
		  },
		  settingDateTimeHandler(isOk, datetime, plantype) {
		  	  if (isOk) {
                //设置时间
				//console.log('datetime', datetime, plantype)
				this.plantype = plantype
                const startDate = stringToDate(datetime.start)
				let endDate = new Date(startDate)
				endDate = endDate.setDate(startDate.getDate() + 1)
				endDate = new Date(endDate)
				 
                mycesium.setClockTimeline(global.viewer, startDate, endDate)	  				  
		  	  }	  
		  			  
		      this.settingVisible.setting = false
		  },
		  settingSatelliteOptHandler(isOk, satellites, isCircle) {
			  if (isOk) {
			      console.log("satellites of opt:", satellites)
				  const plantype = this.plantype
				  // 获取vuex的共享数据(所有可用的卫星)
				  const satelliteDB = this.$store.state.satelliteDB
				  // 首先移除所有可用的卫星
				  const satelliteIds = satelliteDB.map(item => { return item.satelliteId })
				  mycesium.removeEntitiesById(global.viewer, satelliteIds)
				  
				  // 从cesium clock获取时间
				  const julianDate = global.viewer.clock.currentTime.clone()
				  const currentDate = Cesium.JulianDate.toDate(julianDate)
				  const timeStamp = currentDate.getTime()
				  
				  // 然后添加被选的卫星(ID)
				  for(let i = 0, length = satellites.length; i < length; i++) {
				  	  const satellite = findEqual(satelliteDB, 'satelliteId', satellites[i]);
				  	  if (satellite) {
						  const satelliteId = satellites[i]
						  if (plantype === 5) {
							  postSatelliteInsituWides({satelliteId, timeStamp}).then(response => {
							  	  if (response.code === 200) {
							  		  let positionProperty = new Cesium.SampledPositionProperty()
							  		  let posProperty = new Cesium.SampledPositionProperty()						  
							          let situProperty = new Cesium.SampledProperty(Cesium.Cartesian2)
							  		  const insitus = response.respBody
							  		  for (let j = 0, len = insitus.length; j < len; j++) {
							  		      const time = Cesium.JulianDate.fromIso8601(insitus[j].epoch)
							  		      const position =Cesium.Cartesian3.fromDegrees(insitus[j].lng, insitus[j].lat, insitus[j].alt)
							  			 const pos =Cesium.Cartesian3.fromDegrees(insitus[j].lng, insitus[j].lat)
							  		      // 添加一个新样本：添加位置，和时间对应
							  			  positionProperty.addSample(time, position)
							  			  posProperty.addSample(time, pos)
							  			  const situ = insitus[j].situ
							  			 if (situ === 5) {
							  				situProperty.addSample(time, new Cesium.Cartesian2(1200000.0, 200000.0))  
							  			 } else {
											situProperty.addSample(time, new Cesium.Cartesian2(1.0, 1.0)) 
										 } 
							  		  }
							  								  
							  		  let positionParam = {}
							  		  positionParam.id = satellites[i]
							  		  positionParam.name = satellites[i]
							  		  positionParam.positionProperty = positionProperty					  
							  		  mycesium.addSatellite(global.viewer, positionParam)
							  								  
							  		  let insituParam = {}
							  		  insituParam.id = "insitu" + satellites[i]
							   		  insituParam.name = "insitu" + satellites[i]
							  		  insituParam.posProperty = posProperty
							  		  insituParam.situProperty = situProperty
							  		  mycesium.removeEntityById(global.viewer, insituParam.id)
							  		  mycesium.addSatelliteInsitu(global.viewer, insituParam)
							  								  
							  	  }
							  })
						  }
						  
						  if (plantype === 7) {
							  postSatelliteInsituDesperseds({satelliteId, timeStamp}).then(response => {
							  	  if (response.code === 200) {
							  		  let positionProperty = new Cesium.SampledPositionProperty()
							  		  let posProperty = new Cesium.SampledPositionProperty()						  
							          let situProperty = new Cesium.SampledProperty(Cesium.Cartesian2)
							  		  const insitus = response.respBody
							  		  for (let j = 0, len = insitus.length; j < len; j++) {
							  		      const time = Cesium.JulianDate.fromIso8601(insitus[j].epoch)
							  		      const position =Cesium.Cartesian3.fromDegrees(insitus[j].lng, insitus[j].lat, insitus[j].alt)
							  			  const pos =Cesium.Cartesian3.fromDegrees(insitus[j].lng, insitus[j].lat)
							  		      // 添加一个新样本：添加位置，和时间对应
							  			  positionProperty.addSample(time, position)
							  			  posProperty.addSample(time, pos)
							  			  const situ = insitus[j].situ
							  			  if (situ === 7) {
							  				situProperty.addSample(time, new Cesium.Cartesian2(200000.0, 200000.0))  
							  			  } else {
											 situProperty.addSample(time, new Cesium.Cartesian2(1.0, 1.0))
										  }
							  		  }
							  								  
							  		  let positionParam = {}
							  		  positionParam.id = satellites[i]
							  		  positionParam.name = satellites[i]
							  		  positionParam.positionProperty = positionProperty					  
							  		  mycesium.addSatellite(global.viewer, positionParam)
							  								  
							  		  let insituParam = {}
							  		  insituParam.id = "insitu" + satellites[i]
							   		  insituParam.name = "insitu" + satellites[i]
							  		  insituParam.posProperty = posProperty
							  		  insituParam.situProperty = situProperty
							  		  mycesium.removeEntityById(global.viewer, insituParam.id)
							  		  mycesium.addSatelliteInsitu(global.viewer, insituParam)
							  								  
							  	  }
							  })
						  }
						  
						  if (plantype === 6) {
							  postSatelliteInsituCoordinations({satelliteId, timeStamp}).then(response => {
							  	  if (response.code === 200) {
							  		  let positionProperty = new Cesium.SampledPositionProperty()
							  		  let posProperty = new Cesium.SampledPositionProperty()						  
							  		  let situProperty = new Cesium.SampledProperty(Cesium.Cartesian2)
							  		  const insitus = response.respBody
							  		  for (let j = 0, len = insitus.length; j < len; j++) {
							  		      const time = Cesium.JulianDate.fromIso8601(insitus[j].epoch)
							  		      const position =Cesium.Cartesian3.fromDegrees(insitus[j].lng, insitus[j].lat, insitus[j].alt)
							  		  	  const pos =Cesium.Cartesian3.fromDegrees(insitus[j].lng, insitus[j].lat)
							  		      // 添加一个新样本：添加位置，和时间对应
							  		  	  positionProperty.addSample(time, position)
							  		  	  posProperty.addSample(time, pos)
							  		  	  const situ = insitus[j].situ
							  		  	  if (situ === 6) {
							  		  		situProperty.addSample(time, new Cesium.Cartesian2(500000.0, 500000.0))  
							  		  	  } else {
							  		  		situProperty.addSample(time, new Cesium.Cartesian2(1.0, 1.0))
							  		  	  }
							  		  }
							  		  							  								  
							  		  let positionParam = {}
							  		  positionParam.id = satellites[i]
							  		  positionParam.name = satellites[i]
							  		  positionParam.positionProperty = positionProperty					  
							  		  mycesium.addSatellite(global.viewer, positionParam)
							  		  							  								  
							  		  let insituParam = {}
							  		  insituParam.id = "insitu" + satellites[i]
							  		  insituParam.name = "insitu" + satellites[i]
							  		  insituParam.posProperty = posProperty
							  		  insituParam.situProperty = situProperty
							  		  mycesium.removeEntityById(global.viewer, insituParam.id)
							  		  mycesium.addSatelliteInsitu(global.viewer, insituParam)			  
							  	  }
							  })
						  }
						  
						  
						  
				  	  }				  
				  } 
				  
			  }
			  
			  this.settingVisible.setting = false
		  },
		  settingSatelliteOrbitHandler(isOk, satellites) {
			  if (isOk) {
			      console.log("satellites of orbit:", satellites) 
				  let czmlPolyline = this.$options.methods.czmlPolylineOfOribit(satellites)
				  czmlPolyline.then(czml => {
					  // console.log("satellite czml:", czml)
				      mycesium.addDataSource(global.viewer, czml)
					 
				  })	
			  }
			  
			  this.settingVisible.setting = false
		  },
		  settingSatelliteCoverHandler(isOk) {
			  if (isOk) {
			  }
			  
			  this.settingVisible.setting = false
		  },
		  
		  
		  settingGroundStationOptHandler(isOk, groundstations) {
			  if (isOk) {
			      console.log("groundstations of opt:", groundstations) 
				  // 获取vuex的共享数据(所有可用的地面站)
				  const groundstationDB = this.$store.state.groundstationDB
				  // 首先移除所有可用的地面站
				  const groundstationIds = groundstationDB.map(item => { return item.groundStationId })
				  mycesium.removeEntitiesById(global.viewer, groundstationIds)
				  
				  // 然后添加被选的地面站(ID)
				  for (let i = 0, length = groundstations.length; i < length; i++) {
					  const groundstation = findEqual(groundstationDB, 'groundStationId', groundstations[i])
					  if (groundstation) {
						  let param = {}
						  param.id = groundstations[i],
						  param.name = groundstation.groundStationName,
						  param.text = groundstation.groundStationText,
						  param.lng = groundstation.groundStationLng,
						  param.lat = groundstation.groundStationLat,
						  param.alt = groundstation.groundStationAlt
						  
						  mycesium.addGroundStation(global.viewer, param)
					  }
				  }		  
			  }
			  
			  this.settingVisible.setting = false
		  },
		  
		  settingGroundStationPassHandler(isOk) {
			  if (isOk) {
				  
			  }
			  
			  this.settingVisible.setting = false
		  },
		  
		  handleDateTimeSetting() {
			  // 从后台获取已经设置的时间
			  postDateTime({}).then(response => {
			  	if (response.code === 200) {
					const datetime = response.respBody
					this.$refs.datetime.init(datetime)
				}
			  })
			  
		      this.settingVisible.setting = true
		      this.settingVisible.dateTime = true
		      this.settingVisible.satellite = false
		      this.settingVisible.groundStation = false
		  },
		  handleSatelliteSetting() {
			  // 从后台获取卫星列表
			  postSatellites({}).then(response => {
				  if (response.code === 200) {
					  const satellites = response.respBody
					  this.$refs.satellite.initSatellites(satellites)
				  }
				  // 从后台获取被选的卫星列表
				  return postSatellitesSelected({})
			  }).then(response => {
				  if (response.code === 200) {
					  const selected = response.respBody
					  this.$refs.satellite.initSatelliteSelected(selected)
				  }
			  })
			  
			  // 从后台获取地面站列表
			  postGroundStations({}).then(response => {
				  if (response.code === 200) {
					  const groundstations = response.respBody
					  this.$refs.satellite.initGroundStations(groundstations)
				  }
			  })
			  
		  	  this.settingVisible.setting = true
		      this.settingVisible.dateTime = false
		  	  this.settingVisible.satellite = true
		  	  this.settingVisible.groundStation = false
		  },
		  handleGroundStationSetting() {
			  // 从后台获取地面站列表
			  postGroundStations({}).then(response => {
			  	  if (response.code === 200) {
			  		  const groundstations = response.respBody
			  		  this.$refs.groundstation.initGroundStations(groundstations)
			  	  }
				  // 从后台获取被选的地面站列表
				  return postGroundStationsSelected({})
			  }).then(response => {
				  if (response.code === 200) {
					  const selected = response.respBody
					  this.$refs.groundstation.initGroundStationSelected(selected)
				  }
			  })
			  
			  // 从后台获取卫星列表
			  postSatellites({}).then(response => {
			  	  if (response.code === 200) {
			  		  const satellites = response.respBody
			  		  this.$refs.groundstation.initSatellites(satellites)
			  	  }
			  })
			  
		  	  this.settingVisible.setting = true
		  	  this.settingVisible.dateTime = false
		  	  this.settingVisible.satellite = false
		  	  this.settingVisible.groundStation = true
		  },
		  
		  
		  // 定时器
		  handleTimer() {
			  // 清除定时器
			  if (this.timer != null) {
			  	clearInterval(this.timer)
			  	this.timer = null
			  }
			  if (this.isContinue) {
				  //箭头函数的this指向所在的函数绑定到的那个对象
				this.timer = setInterval(() => {
				  const julianDate = global.viewer.clock.currentTime.clone()
				  //const julianDate = global.viewer.clock.tick()
				  const currentDate = Cesium.JulianDate.toDate(julianDate)
				  const timeStamp = currentDate.getTime()
				  //console.log("current:", julianDate, currentDate, timeStamp)
				  
				  //const multiplier = global.viewer.clock.multiplier
				  putTimeStampRequest({ timeStamp }).then(response => {
					if (response.code === 200) 
						return response.respBody
					return Promise.reject(new Error('response error'))
				  }).then(date => {
					  console.log("date:", date)
				  })
				}, 1000);  
				  
			  } 
		  },
		  
		  //控制卫星运动(星下点位置)
		  refreshSatellitePosition(positions) {
			  for (let i = 0, length = positions.length; i < length; i++) {
				  let pos = positions[i]
				  const entity = global.viewer.entities.getById(pos.id)
				  if (Cesium.defined(entity)) 
				      entity.position = Cesium.Cartesian3.fromDegrees(pos.lng, pos.lat, pos.alt)
			  }
		  },
		  
	
	  }
	  
	}
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
} 

.view-setting {
    position: absolute;
    top: 30px;
    left: 1px;
	width: 720px;
	z-index: 10;
}

</style>
