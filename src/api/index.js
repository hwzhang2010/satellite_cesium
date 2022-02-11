/**
 * 每个模块都应该有自己的接口文件去统一管理api
 */
import { get, post, put, del } from '@/utils/request.js'

// let baseUrl = ''
// const env = process.env.NODE_ENV
// if (process.env.NODE_ENV === 'dev') 
//     baseUrl = 'http://localhost:8902'

export const getUsers = params => get('http://localhost:3000/users', params)

// 获取设置的时间
export const postDateTime = params => post('/api/v1/sisl/datetime', params)

// 设置时间
export const putDateTime = params => put('/api/v1/sisl/datetime/start', params)

// 根据日期更新计划
export const putSatelliteInsituPlan = params => put('/api/v1/sisl/date/insitu/plan', params)

// 根据时间请求卫星的运动位置
export const putTimeStampRequest = params => put('/api/v1/sisl/datetime/timestamp/request', params)

// 获取卫星列表
export const postSatellites = params => post('/api/v1/sisl/satellites', params)

// 获取被选的卫星列表
export const postSatellitesSelected = params => post('/api/v1/sisl/satellites/selected', params)

// 添加被选的卫星列表
export const postSatellitesAdd = params => post('/api/v1/sisl/satellites/add', params)

// 获取地面站列表
export const postGroundStations = params => post('/api/v1/sisl/groundstations', params)

// 获取被选的地面站列表
export const postGroundStationsSelected = params => post('/api/v1/sisl/groundstations/selected', params)

// 添加被选的地面站列表
export const postGroundStationsAdd = params => post('/api/v1/sisl/groundstations/add', params)

// 获取卫星的轨道根数
export const postSatelliteOrbitElem = params => post('api/v1/sisl/satellite/orbitelem', params)

// 通知后台发送卫星的轨道根数
export const postSatelliteOrbitElemSend = params => post('api/v1/sisl/satellite/orbitelem/send', params)

// 获取卫星24小时内的运动轨迹
export const postSatellitePositions = params => post('/api/v1/sisl/satellite/positions', params)

// 获取卫星24小时内的运行轨迹(含覆盖范围半径)
export const postSatelliteCircles = params => post('/api/v1/sisl/satellite/circles', params)

// 获取卫星的两行根数
export const postSatelliteTle = params => post('/api/v1/sisl/satellite/tle', params)

// 获取卫星的运行周期
export const postSatelliteTlePeriod = params => post('/api/v1/sisl/satellite/tle/period', params)

// 获取卫星一个周期内的运行轨迹
export const postSatelliteTlePositions = params => post('/api/v1/sisl/satellite/tle/positions', params)

// 获取卫星24小时内的覆盖范围(相关信关站)
export const postSatelliteCovers = params => post('/api/v1/sisl/satellite/covers', params)

// 获取卫星下一次过境信关站的时间和角度
export const postGroundStationNextPass = params => post('/api/v1/sisl/groundstation/nextpass', params)

// 获取卫星一定时间范围内过境信关站的时间和角度
export const postGroundStationNextPasses = params => post('/api/v1/sisl/groundstation/nextpasses', params)

// 获取卫星下一次过境信关站的跟踪角度
export const postGroundStationNextFollows = params => post('/api/v1/sisl/groundstation/nextfollows', params)

// 根据卫星ID获取卫星一段时间内的原位测控: 超宽幅成像
export const postSatelliteInsituWides = params => post('/api/v1/sisl/satellite/insitu/wide', params)

// 根据卫星ID获取卫星一段时间内的原位测控: 多目标分散观测
export const postSatelliteInsituDesperseds = params => post('/api/v1/sisl/satellite/insitu/dispersed', params)

// 根据卫星ID获取卫星一段时间内的原位测控: 多星协同观测
export const postSatelliteInsituCoordinations = params => post('/api/v1/sisl/satellite/insitu/coordination', params)

