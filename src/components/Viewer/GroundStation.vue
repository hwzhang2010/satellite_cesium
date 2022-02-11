<template>
	<el-tabs v-model="activeTab">
	    <el-tab-pane label="信关站选择" name="opt">
			<el-form :model="groundstationopt" label-width="80px" label-position="left">
				<el-form-item>
				  <el-transfer
				      v-model="groundstationopt.selected" 
				  	  :data="groundstationopt.groundstations"
				      :titles="['可选信关站', '被选信关站']"></el-transfer>
				</el-form-item>
			  
			    <el-form-item class="form-footer">
			      <el-button size="small" @click="handleGroundStationOpt(false)">取 消</el-button>
				  <el-button size="small" type="primary" @click="handleGroundStationOpt(true)">确 定</el-button>
			    </el-form-item>
			</el-form>
		</el-tab-pane>
	    <el-tab-pane label="信关站参数" name="set">
			<el-form :model="groundstationset" label-width="80px" label-position="left">
				<el-form-item>
				  <el-table
				    :data="groundstationset.data"
				    border
				    style="width: 100%"
				  	height="300">
				      <el-table-column
				        prop="groundStationId"
				        label="ID"
				        width="120">
				      </el-table-column>
				      <el-table-column
				        label="详情"
				        width="180">
				        <template slot-scope="scope">
				            <el-popover trigger="hover" placement="top">
				                <p>名称: {{ scope.row.groundStationName }}</p>
				                <p>经度: {{ scope.row.groundStationLng }}</p>
								<p>纬度: {{ scope.row.groundStationLat }}</p>
				                <div slot="reference" class="name-wrapper">
				                  <el-tag size="medium">{{ scope.row.groundStationText }}</el-tag>
				                </div>
				            </el-popover>
				        </template>
				      </el-table-column>
				  	  <el-table-column
				  	    fixed="right"
				  	    label="操作">
				  	    <template slot-scope="scope">
							<el-popover trigger="hover" placement="top">
							    <p>...</p>
							    <div slot="reference" class="name-wrapper">
							      <el-button size="mini">状态</el-button>
							    </div>
							</el-popover>
				  	    </template>
				  	  </el-table-column>
				  </el-table>
				</el-form-item>
			  
			    <el-form-item class="form-footer">
				  <el-button size="small" @click="handleGroundStationSet(false)">取 消</el-button>
				  <el-button size="small" type="primary" @click="handleGroundStationSet(true)">确 定</el-button>
			    </el-form-item>
			</el-form>
	
		</el-tab-pane>
		
	</el-tabs>
</template>

<script>
	import { formatDateTime } from '@/utils/common'
	import { postGroundStationsAdd, postGroundStationNextPass, postGroundStationNextPasses, postGroundStationNextFollows } from '@/api'
	
	export default {
		name: 'GroundStation',
		data() {
			return {
				activeTab: 'opt',
				groundstationopt: {
					groundstations: [],
					selected: [],
				},
				groundstationset: {
					data: []
				},
				
			}
		},
		mounted() {
			this.init()
		},
		methods: {
			init() {
				const groundstationDB = this.$store.state.groundstationDB
				const opts = []
				for(let i = 0, length = groundstationDB.length; i < length; i++) {
					opts.push({
						key: groundstationDB[i].groundStationId,
						label: groundstationDB[i].groundStationText
					})
				}
				this.groundstationopt.groundstations = opts
				this.groundstationopt.selected = this.$store.getters.selectedGroundStation
				
				this.groundstationset.data = groundstationDB
			},
			initGroundStations(groundstations) {
				console.log("groundstations:", groundstations)
				const opts = []
				for(let i = 0, length = groundstations.length; i < length; i++) {
					opts.push({
						key: groundstations[i].groundStationId,
						label: groundstations[i].groundStationText
					})
				}
				this.groundstationopt.groundstations = opts
				
				this.groundstationset.data = groundstations
			},
			initGroundStationSelected(selected) {
				console.log("selected:", selected)
				this.groundstationopt.selected = selected
			},
			initSatellites(satellites) {
				console.log("satellites:", satellites)
				
				// 从sessionStorage获取卫星列表
				//const satelliteDB = this.$store.state.satelliteDB
				//this.groundstationpass.satellites = satelliteDB
				//if (satelliteDB.length > 0)
				//    this.groundstationpass.satelliteid = satelliteDB[0].satelliteId
			},
			
			handleGroundStationOpt(isOk) {
				// 已选的地面站ID列表
				const groundstations = this.groundstationopt.selected
				console.log("selected:", groundstations)
				// 向后台添加被选的地面站列表
				postGroundStationsAdd({groundstations})
				
				this.$emit('on-groundstation-opt', isOk, groundstations)
			},
			handleGroundStationSet(isOk) {
				this.$emit('on-groundstation-opt', false)
			},
			
		}
	}
</script>

<style scoped>
.form-footer {
    text-align: right;
	margin: 10px 0 10px 10px;
}
</style>
