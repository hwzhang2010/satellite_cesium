/*
 * @Author: zhang.huawei
 * @Date: 2020-10-18 15:36:39
 * @LastEditors: zhang.huawei
 * @LastEditTime: 2020-10-18 15:36:39
 * @Description: 时钟设置
 */

function setClockTimeline(viewer, startDate, stopDate) {
 					  
	// 开始时间
	const start = Cesium.JulianDate.fromDate(startDate);
	// 结束时间
	const stop = Cesium.JulianDate.fromDate(stopDate);
	// 将时间刻到时间轴上
	// 设置始时钟始时间
	global.viewer.clock.startTime = start.clone();
	// 设置时钟当前时间
	global.viewer.clock.currentTime = start.clone();
	// 设置始终停止时间
	global.viewer.clock.stopTime = stop.clone();
	// 时间速率，数字越大时间过的越快
	global.viewer.clock.multiplier = 1;
	// 设置时间流动方式，默认UNBOUNDED
	global.viewer.clockRange = Cesium.ClockRange.LOOP_STOP;
	// 时间轴
	global.viewer.timeline.zoomTo(start, stop);
}

export { setClockTimeline };