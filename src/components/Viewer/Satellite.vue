<template>
	<el-tabs v-model="activeTab">
	    <el-tab-pane label="卫星选择" name="opt">
			<el-form :model="satelliteopt" label-width="80px" label-position="left">
				<el-form-item>
				  <el-transfer
				      v-model="satelliteopt.selected" 
				  	  :data="satelliteopt.satellites"
				      :titles="['可选卫星', '被选卫星']"></el-transfer>
				</el-form-item>
			    <el-form-item>
				  <el-row :gutter="10">	
				    <el-col :span="12">
				  	  <el-divider direction="vertical"></el-divider>
				    </el-col>
					<el-col :span="12" style="text-align: right;">
			          <el-button size="small" @click="handleSatelliteOpt(false)">取 消</el-button>
				      <el-button size="small" type="primary" @click="handleSatelliteOpt(true)">确 定</el-button>
					</el-col>
				  </el-row>
			    </el-form-item>
			</el-form>
		</el-tab-pane>
		
	</el-tabs>
</template>

<script>
	import { formatDateTime } from '@/utils/common'
	import { postSatellitesAdd, postSatelliteOrbitElem, postSatelliteOrbitElemSend, postSatelliteCovers } from '@/api'
	
	export default {
		name: 'Satellite',
		data() {
			return {
				activeTab: 'opt',
				satelliteopt: {
					satellites: [],
					selected: []
				},
			}
		},
		mounted() {
			//this.init()
		},
		methods: {
			// init() {			
			// 	const satelliteDB = this.$store.state.satelliteDB
			// },
			initSatellites(satellites) {
				//console.log("satellites:", satellites)
				const opts = []
				for(let i = 0, length = satellites.length; i < length; i++) {
					opts.push({
						key: satellites[i].satelliteId,
						label: satellites[i].satelliteId
					})
				}
				this.satelliteopt.satellites = opts
			},
			initSatelliteSelected(selected) {
				//console.log("selected:", selected)
				this.satelliteopt.selected = selected
			},
			initGroundStations(groundstations) {
				//console.log("groundstations:", groundstations)
				
				// 从sessionStorage获取信关站列表
				//const groundstationDB = this.$store.state.groundstationDB
				//this.satellitecover.groundstations = groundstationDB
			},
			
			handleSatelliteOpt(isOk) {
				// 已选的卫星列表
				const satellites = this.satelliteopt.selected
				console.log("selected:", satellites)
				// 向后台添加被选的卫星列表
				postSatellitesAdd({satellites})
				
				const isCircle = false
				this.$emit('on-satellite-opt', isOk, satellites, isCircle)
			},
			
			
		}
	}
</script>

<style scoped>
.form-footer {
	text-align: right;
	margin: 10px 0 10px 10px;
}
.dialog-footer {
	text-align: right;
	margin: 10px 0 10px 10px;
}
</style>
