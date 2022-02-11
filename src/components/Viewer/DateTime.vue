<template>
	<el-form :model="datetime" label-width="120px" label-position="left">
		<el-form-item label="起始时间">
			<el-date-picker
			    v-model="datetime.start" @change="handleDateTimeStartChange"
			    type="datetime"
				format="yyyy-MM-dd HH:mm:ss"
				value-format="yyyy-MM-dd HH:mm:ss"
			    placeholder="选择起始时间">
			</el-date-picker>
		</el-form-item>
		<el-form-item label="时间长度(小时)">
			<el-input-number v-model="datetime.hours" :disabled="true" :min="1" :max="168" label="时间范围(小时数)"></el-input-number>
		</el-form-item>
		<el-form-item label="计划日期">
			<el-date-picker
			    v-model="plandate"
			    type="date"
				format="yyyy-MM-dd"
				value-format="yyyy-MM-dd"
			    placeholder="选择计划日期">
			</el-date-picker>
			<el-divider direction="vertical"></el-divider>
			<el-button size="small" type="primary" @click="handlePlanDate">更新</el-button>
		</el-form-item>
		<el-form-item label="计划类型">
			<el-radio-group v-model="plantype">
			    <el-radio :label="5">超宽幅成像</el-radio>
			    <el-radio :label="6">多星协同观测</el-radio>
			    <el-radio :label="7">多目标分散观测</el-radio>
			 </el-radio-group>
		</el-form-item>
		
		<el-form-item>
		  <el-row :gutter="10">	
		    <el-col :span="12">
			  <el-button type="text" @click="handleEpoch">后台计算时间</el-button>			  
		  	  <el-divider direction="vertical"></el-divider>
		    </el-col>
			<el-col :span="12" style="text-align: right;">
			  <el-button size="small" @click="handleDateTime(false)">取 消</el-button>
			  <el-button size="small" type="primary" @click="handleDateTime(true)">确 定</el-button>
			</el-col>
		  </el-row>
		</el-form-item>
		
		<el-dialog title="后台计算时间" width="25%" :visible.sync="dlgFormEpochVisible" append-to-body>
		  <el-form :model="epoch">
		    <el-form-item label="时间设置" label-width="80px">
		      <el-date-picker
		        v-model="epoch.timestamp" @change="handleEpochTimeStampChange"
		        type="datetime"
		      	format="yyyy-MM-dd HH:mm:ss"
		      	value-format="yyyy-MM-dd HH:mm:ss"
		          placeholder="选择计算时间">
		      </el-date-picker>
		    </el-form-item>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button size="small" @click="dlgFormEpochVisible = false">取 消</el-button>
		    <el-button size="small" type="primary" @click="dlgFormEpochVisible = false">确 定</el-button>
		  </div>
		</el-dialog>
		
	</el-form>
</template>

<script>
	import { formatDateTime } from '@/utils/common'
	import { putDateTime, putSatelliteInsituPlan } from '@/api'
	
	export default {
		name: 'DateTime',
		data() {
			return {
				datetime: {
					start: '',
					hours: 24
				},
				plandate: '',
				plantype: 5,
				dlgFormEpochVisible: false,
				epoch: {
					timestamp: ''
				}
			}
		},
		mounted() {
		},
		methods: {
			init(datetime) {
				//console.log("datetime init:", datetime)
				const start = datetime.start
				//const end = datetime.end
				this.$nextTick(() => {
					this.datetime.start = start
					this.plandate = start
				})
				
			},
			
			handlePlanDate() {
				const plandate = this.plandate
				const plantype = this.plantype
				//console.log(plandate, plantype)
				putSatelliteInsituPlan({ plandate, plantype}).then(response => {
					//console.log(response)
				})
			},
			
			handleDateTimeStartChange(value) {
				//console.log("start: ", value)
				this.datetime.start = value
			},
			handleEpoch() {
				const date = new Date()
				const dateString = formatDateTime(date, "yyyy-MM-dd HH:mm:ss")
				this.epoch.timestamp = dateString
				
				this.dlgFormEpochVisible = true
			},
			
			handleEpochTimeStampChange(value) {
				console.log("epoch: ", value)
			},
			
			handleDateTime(isOk) {
				if (isOk) {
					//console.log("datetime set: ", this.datetime)
					const start = this.datetime.start
					
					if (!start) {
					    this.$message.error('时间未设置')
					    return	
					}
					putDateTime({start}).then(response => {
						if (response.respBody != null) {
						    this.$message.success('时间设置成功')
						}
						else {
						    this.$message.error('时间设置失败')
						}
					})
				}
				this.$emit('on-datetime-completed', isOk, this.datetime, this.plantype)
			}
		}
	}
</script>

<style scoped>
.form-footer {
	text-align: right;
	margin: 10px 0 10px 10px;
}
</style>
